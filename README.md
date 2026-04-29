# Job Application Tracker

A full-stack job application tracker built with React, Vite, Tailwind CSS, React Router, Flask, SQLAlchemy, and SQLite/PostgreSQL-ready database configuration.

## Live Demo

Demo website: https://job-applications-tracker.dragonpig.workers.dev/

The demo is hosted with a React/Vite frontend served through Cloudflare Workers Static Assets and a Flask API backend connected over REST. The backend can run with SQLite locally or PostgreSQL by setting `DATABASE_URL`.

## Project Structure

```text
.
+-- backend/
|   +-- app.py
|   +-- models.py
|   +-- requirements.txt
|   +-- routes/
|   |   +-- __init__.py
|   |   +-- applications.py
|   |   +-- dashboard.py
|   +-- seed.py
+-- frontend/
    +-- index.html
    +-- package.json
    +-- postcss.config.js
    +-- tailwind.config.js
    +-- vite.config.js
    +-- public/
    +-- src/
        +-- App.jsx
        +-- main.jsx
        +-- styles.css
        +-- components/
        +-- pages/
        +-- services/
```

## Backend Setup

From the `backend` folder:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python app.py
```

On Windows, if `python` is not recognized, use `py` instead:

```bash
py -m venv .venv
```

The Flask API runs at:

```text
http://localhost:5000
```

Useful endpoints:

- `GET /api/health`
- `GET /api/dashboard/summary`
- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/<id>`
- `PUT /api/applications/<id>`
- `DELETE /api/applications/<id>`
- `POST /api/applications/<id>/notes`
- `PATCH /api/applications/<id>/status`

SQLite is used by default and creates `backend/job_tracker.db`. To upgrade later to PostgreSQL, set `DATABASE_URL` before starting Flask.

## PostgreSQL Setup

The backend uses SQLite when `DATABASE_URL` is not set. To run the same app with PostgreSQL, create a PostgreSQL database and set `DATABASE_URL` before starting the backend.

For local development, this repo includes Docker Compose services for PostgreSQL, Flask, and Vite. Start Docker Desktop first, then run this from the project root:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:5180
```

The Compose setup starts:

- PostgreSQL on `localhost:5432`
- Flask API on `localhost:5000`
- React/Vite frontend on `localhost:5180`

To run the stack in the background:

```bash
docker compose up --build -d
```

To stop it:

```bash
docker compose down
```

Example `backend/.env` for running the backend directly on your host machine against the included Docker database:

```text
DATABASE_URL=postgresql://jobtracker:jobtracker_dev_password@localhost:5432/job_tracker
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Then install dependencies and seed the PostgreSQL database:

```bash
cd backend
pip install -r requirements.txt
python seed.py
python app.py
```

The `seed.py` script resets whichever database `DATABASE_URL` points to. Do not run it against a database that contains real data you want to keep.

## Frontend Setup

From the `frontend` folder:

```bash
npm install
npm run dev
```

The Vite app runs at:

```text
http://localhost:5173
```

The frontend expects the API at `http://localhost:5000/api`. To change it, create `frontend/.env`:

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

## Local Development Flow

1. Start the backend in one terminal:

   ```bash
   cd backend
   .\.venv\Scripts\python.exe app.py
   ```

2. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Files To Customize First

- `backend/models.py`: database tables, fields, and serialization.
- `backend/routes/applications.py`: application CRUD, notes, status changes, validation, search, filters, and sorting.
- `backend/routes/dashboard.py`: dashboard summary and recent application logic.
- `frontend/src/services/api.js`: API base URL, status list, and REST request helpers.
- `frontend/src/components/ApplicationForm.jsx`: form fields and validation.
- `frontend/src/pages/Dashboard.jsx`: dashboard cards, recent applications, and status chart.
- `frontend/src/pages/ApplicationsPage.jsx`: table columns, search, filters, and sort behavior.
- `frontend/src/pages/ApplicationDetail.jsx`: details view, notes, status history, status updates, and deletion.

## Seed Data

Run this any time you want to reset the local database with sample data:

```bash
cd backend
python seed.py
```

The seed script creates 10 sample applications with notes and initial status history.
