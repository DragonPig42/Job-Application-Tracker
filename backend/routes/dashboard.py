from flask import Blueprint, jsonify
from sqlalchemy import func

from models import Application, STATUSES


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/summary")
def dashboard_summary():
    # Build the small set of aggregate data needed by the dashboard.
    total = Application.query.count()
    grouped_counts = dict(
        Application.query.with_entities(Application.status, func.count(Application.id))
        .group_by(Application.status)
        .all()
    )
    # Fill missing statuses with zero so the frontend chart always has every workflow step.
    by_status = {status: grouped_counts.get(status, 0) for status in STATUSES}

    recent_applications = (
        Application.query.order_by(Application.created_at.desc()).limit(5).all()
    )

    return jsonify(
        {
            "total": total,
            "by_status": by_status,
            "recent_applications": [
                application.to_dict() for application in recent_applications
            ],
        }
    )
