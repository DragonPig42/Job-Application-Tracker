from datetime import date, datetime, timezone

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

# Keep the workflow statuses in one place so the API and seed data stay consistent.
STATUSES = [
    "Wishlist",
    "Applied",
    "OA",
    "Interviewing",
    "Offer",
    "Rejected",
]

DEPRECATED_STATUS_MAP = {
    "Ghosted": "Rejected",
}


def normalize_status(status):
    return DEPRECATED_STATUS_MAP.get(status, status)


def utc_now():
    # Store timestamps in UTC so the database remains portable across machines.
    return datetime.now(timezone.utc)


def iso_datetime(value):
    if value is None:
        return None
    return value.isoformat()


def iso_date(value):
    if value is None:
        return None
    if isinstance(value, date):
        return value.isoformat()
    return value


class Application(db.Model):
    # Main job application record. Notes and status history hang off this table.
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(160), nullable=False)
    role = db.Column(db.String(160), nullable=False)
    location = db.Column(db.String(160), nullable=True)
    salary = db.Column(db.String(80), nullable=True)
    job_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(40), nullable=False, default="Wishlist")
    date_applied = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    notes = db.relationship(
        "Note",
        back_populates="application",
        # Deleting an application should also delete its notes.
        cascade="all, delete-orphan",
        order_by="desc(Note.created_at)",
    )
    status_history = db.relationship(
        "StatusHistory",
        back_populates="application",
        # Keep history scoped to its application; it should not outlive the parent row.
        cascade="all, delete-orphan",
        order_by="desc(StatusHistory.changed_at)",
    )

    def to_dict(self, include_notes=False, include_history=False):
        # Convert ORM objects into JSON-safe dictionaries for API responses.
        data = {
            "id": self.id,
            "company": self.company,
            "role": self.role,
            "location": self.location,
            "salary": self.salary,
            "job_url": self.job_url,
            "status": normalize_status(self.status),
            "date_applied": iso_date(self.date_applied),
            "created_at": iso_datetime(self.created_at),
            "updated_at": iso_datetime(self.updated_at),
        }

        if include_notes:
            data["notes"] = [note.to_dict() for note in self.notes]
        if include_history:
            data["status_history"] = [entry.to_dict() for entry in self.status_history]

        return data


class Note(db.Model):
    # Notes are append-only text entries for an application.
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(
        db.Integer, db.ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    application = db.relationship("Application", back_populates="notes")

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "content": self.content,
            "created_at": iso_datetime(self.created_at),
        }


class StatusHistory(db.Model):
    # One row is added whenever the status changes, creating a simple audit trail.
    __tablename__ = "status_history"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(
        db.Integer, db.ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    old_status = db.Column(db.String(40), nullable=True)
    new_status = db.Column(db.String(40), nullable=False)
    changed_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    application = db.relationship("Application", back_populates="status_history")

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "old_status": normalize_status(self.old_status),
            "new_status": normalize_status(self.new_status),
            "changed_at": iso_datetime(self.changed_at),
        }
