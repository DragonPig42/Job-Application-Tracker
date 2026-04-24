from datetime import date, timedelta

from app import create_app
from models import Application, Note, StatusHistory, db


SAMPLE_APPLICATIONS = [
    {
        "company": "Northstar Labs",
        "role": "Frontend Engineer",
        "location": "Remote",
        "salary": "$115k - $135k",
        "job_url": "https://example.com/jobs/northstar-frontend",
        "status": "Applied",
        "days_ago": 3,
        "notes": ["Submitted tailored resume and portfolio link."],
    },
    {
        "company": "Finch Analytics",
        "role": "Data Platform Engineer",
        "location": "New York, NY",
        "salary": "$130k - $155k",
        "job_url": "https://example.com/jobs/finch-data-platform",
        "status": "Interviewing",
        "days_ago": 8,
        "notes": ["Recruiter screen went well.", "Technical interview scheduled."],
    },
    {
        "company": "Cloud Harbor",
        "role": "Full Stack Developer",
        "location": "Austin, TX",
        "salary": "$120k - $145k",
        "job_url": "https://example.com/jobs/cloud-harbor-full-stack",
        "status": "OA",
        "days_ago": 5,
        "notes": ["Online assessment due this week."],
    },
    {
        "company": "BrightPath Health",
        "role": "Backend Engineer",
        "location": "Boston, MA",
        "salary": "$125k - $150k",
        "job_url": "https://example.com/jobs/brightpath-backend",
        "status": "Rejected",
        "days_ago": 21,
        "notes": ["Rejected after hiring manager round."],
    },
    {
        "company": "Orbit Commerce",
        "role": "React Engineer",
        "location": "Seattle, WA",
        "salary": "$118k - $142k",
        "job_url": "https://example.com/jobs/orbit-react",
        "status": "Offer",
        "days_ago": 16,
        "notes": ["Offer received. Comparing compensation package."],
    },
    {
        "company": "Mosaic AI",
        "role": "Product Engineer",
        "location": "San Francisco, CA",
        "salary": "$145k - $170k",
        "job_url": "https://example.com/jobs/mosaic-product-engineer",
        "status": "Wishlist",
        "days_ago": 1,
        "notes": ["Looks promising. Need referral before applying."],
    },
    {
        "company": "Atlas Energy",
        "role": "Software Engineer II",
        "location": "Denver, CO",
        "salary": "$110k - $130k",
        "job_url": "https://example.com/jobs/atlas-software-engineer",
        "status": "Rejected",
        "days_ago": 35,
        "notes": ["Rejected after recruiter follow-up."],
    },
    {
        "company": "Pioneer Robotics",
        "role": "UI Engineer",
        "location": "Pittsburgh, PA",
        "salary": "$105k - $128k",
        "job_url": "https://example.com/jobs/pioneer-ui-engineer",
        "status": "Applied",
        "days_ago": 2,
        "notes": ["Applied through company portal."],
    },
    {
        "company": "Summit Security",
        "role": "Application Security Engineer",
        "location": "Remote",
        "salary": "$140k - $165k",
        "job_url": "https://example.com/jobs/summit-appsec",
        "status": "Interviewing",
        "days_ago": 12,
        "notes": ["Panel interview next Tuesday."],
    },
    {
        "company": "Evergreen Learning",
        "role": "Junior Full Stack Engineer",
        "location": "Chicago, IL",
        "salary": "$85k - $105k",
        "job_url": "https://example.com/jobs/evergreen-full-stack",
        "status": "Applied",
        "days_ago": 6,
        "notes": ["Strong mission fit."],
    },
]


def seed_database():
    # This is a local reset script: it wipes existing rows and reloads sample data.
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        today = date.today()
        for item in SAMPLE_APPLICATIONS:
            application = Application(
                company=item["company"],
                role=item["role"],
                location=item["location"],
                salary=item["salary"],
                job_url=item["job_url"],
                status=item["status"],
                date_applied=today - timedelta(days=item["days_ago"]),
            )
            db.session.add(application)
            # Flush gives this new application an id before adding related rows.
            db.session.flush()

            db.session.add(
                StatusHistory(
                    application_id=application.id,
                    old_status=None,
                    new_status=application.status,
                )
            )

            for note_content in item["notes"]:
                db.session.add(Note(application_id=application.id, content=note_content))

        db.session.commit()
        print(f"Seeded {len(SAMPLE_APPLICATIONS)} applications.")


if __name__ == "__main__":
    seed_database()
