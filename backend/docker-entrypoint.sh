#!/bin/sh
set -e

python - <<'PY'
import os
import time

import psycopg2

database_url = os.environ["DATABASE_URL"]

for attempt in range(30):
    try:
        connection = psycopg2.connect(database_url)
        connection.close()
        break
    except psycopg2.OperationalError:
        if attempt == 29:
            raise
        time.sleep(1)
PY

python app.py
