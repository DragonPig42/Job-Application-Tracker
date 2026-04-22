from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy import or_

from models import Application, Note, STATUSES, StatusHistory, db


applications_bp = Blueprint("applications", __name__)

REQUIRED_FIELDS = ("company", "role", "status", "date_applied")


def error_response(message, status_code=400):
    return jsonify({"error": message}), status_code


def parse_date(value):
    # The frontend sends date inputs as YYYY-MM-DD strings.
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def validate_application_payload(data):
    # Centralized validation keeps create and update behavior identical.
    missing = [field for field in REQUIRED_FIELDS if not str(data.get(field, "")).strip()]
    if missing:
        return f"Missing required field(s): {', '.join(missing)}"

    if data.get("status") not in STATUSES:
        return "Invalid status"

    if parse_date(data.get("date_applied")) is None:
        return "date_applied must use YYYY-MM-DD format"

    return None


def apply_application_payload(application, data):
    # Normalize blank optional fields to None before storing them.
    application.company = data.get("company", "").strip()
    application.role = data.get("role", "").strip()
    application.location = data.get("location", "").strip() or None
    application.salary = data.get("salary", "").strip() or None
    application.job_url = data.get("job_url", "").strip() or None
    application.status = data.get("status")
    application.date_applied = parse_date(data.get("date_applied"))


@applications_bp.get("")
def list_applications():
    # Query params power the table search, status filter, and date sorting.
    search = request.args.get("search", "").strip()
    status = request.args.get("status", "").strip()
    sort = request.args.get("sort", "date_desc")

    query = Application.query

    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(Application.company.ilike(pattern), Application.role.ilike(pattern)))

    if status and status != "All":
        if status not in STATUSES:
            return error_response("Invalid status")
        query = query.filter(Application.status == status)

    if sort == "date_asc":
        query = query.order_by(Application.date_applied.asc(), Application.created_at.asc())
    else:
        query = query.order_by(Application.date_applied.desc(), Application.created_at.desc())

    applications = query.all()
    return jsonify({"applications": [application.to_dict() for application in applications]})


@applications_bp.post("")
def create_application():
    data = request.get_json(silent=True) or {}
    validation_error = validate_application_payload(data)
    if validation_error:
        return error_response(validation_error)

    application = Application()
    apply_application_payload(application, data)
    db.session.add(application)
    # Flush assigns application.id before commit, which lets us write history in one transaction.
    db.session.flush()
    db.session.add(
        StatusHistory(
            application_id=application.id,
            old_status=None,
            new_status=application.status,
        )
    )
    db.session.commit()

    return jsonify({"application": application.to_dict(include_history=True)}), 201


@applications_bp.get("/<int:application_id>")
def get_application(application_id):
    # Detail pages need the parent record plus notes and status history.
    application = Application.query.get_or_404(application_id)
    return jsonify(
        {"application": application.to_dict(include_notes=True, include_history=True)}
    )


@applications_bp.put("/<int:application_id>")
def update_application(application_id):
    application = Application.query.get_or_404(application_id)
    data = request.get_json(silent=True) or {}
    validation_error = validate_application_payload(data)
    if validation_error:
        return error_response(validation_error)

    old_status = application.status
    apply_application_payload(application, data)

    # Full edits can change status too, so preserve that change in the history table.
    if old_status != application.status:
        db.session.add(
            StatusHistory(
                application_id=application.id,
                old_status=old_status,
                new_status=application.status,
            )
        )

    db.session.commit()
    return jsonify(
        {"application": application.to_dict(include_notes=True, include_history=True)}
    )


@applications_bp.delete("/<int:application_id>")
def delete_application(application_id):
    # Model cascades remove dependent notes and status history.
    application = Application.query.get_or_404(application_id)
    db.session.delete(application)
    db.session.commit()
    return "", 204


@applications_bp.post("/<int:application_id>/notes")
def add_note(application_id):
    # Notes are added as new rows so previous context is preserved.
    application = Application.query.get_or_404(application_id)
    data = request.get_json(silent=True) or {}
    content = data.get("content", "").strip()

    if not content:
        return error_response("Note content is required")

    note = Note(application_id=application.id, content=content)
    db.session.add(note)
    db.session.commit()

    return jsonify({"note": note.to_dict()}), 201


@applications_bp.patch("/<int:application_id>/status")
def update_status(application_id):
    # Dedicated status endpoint keeps the detail page quick to update.
    application = Application.query.get_or_404(application_id)
    data = request.get_json(silent=True) or {}
    new_status = data.get("status", "").strip()

    if new_status not in STATUSES:
        return error_response("Invalid status")

    if new_status != application.status:
        old_status = application.status
        application.status = new_status
        db.session.add(
            StatusHistory(
                application_id=application.id,
                old_status=old_status,
                new_status=new_status,
            )
        )
        db.session.commit()

    return jsonify(
        {"application": application.to_dict(include_notes=True, include_history=True)}
    )
