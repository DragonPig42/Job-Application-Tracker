import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from models import db
from routes.applications import applications_bp
from routes.dashboard import dashboard_bp


load_dotenv()


def create_app():
    # The app factory makes this project easy to reuse from tests, scripts, or a WSGI server.
    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL")
    if database_url and database_url.startswith("postgres://"):
        # Some hosts expose postgres://, while SQLAlchemy expects postgresql://.
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    # SQLite is the local default. Set DATABASE_URL later to switch to PostgreSQL.
    default_db_path = os.path.join(os.path.dirname(__file__), "job_tracker.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url or f"sqlite:///{default_db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JSON_SORT_KEYS"] = False

    # During local development, Vite may be opened through localhost or 127.0.0.1.
    default_cors = (
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5180,http://127.0.0.1:5180"
    )
    cors_origins = os.getenv("CORS_ORIGINS", default_cors).split(",")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    db.init_app(app)

    with app.app_context():
        # Simple local setup: create missing tables on startup. Use migrations for production.
        db.create_all()

    # Blueprints keep related endpoints grouped by feature area.
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Unexpected server error"}), 500

    return app


app = create_app()


if __name__ == "__main__":
    # Reloader is opt-in so the Windows background dev process stays predictable.
    use_reloader = os.getenv("FLASK_USE_RELOADER", "false").lower() == "true"
    app.run(debug=True, port=int(os.getenv("PORT", 5000)), use_reloader=use_reloader)
