#!/bin/sh
set -e

DB_HOST=${DB_HOST:-}
DB_PORT=${DB_PORT:-}

# Si DB_HOST/DB_PORT ne sont pas fournis, essayer de les lire depuis DATABASE_URL.
if [ -z "$DB_HOST" ] && [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(python - <<'PY'
import os
from urllib.parse import urlparse

url = os.environ.get("DATABASE_URL", "")
host = urlparse(url).hostname or ""
print(host)
PY
)
fi

if [ -z "$DB_PORT" ] && [ -n "$DATABASE_URL" ]; then
  DB_PORT=$(python - <<'PY'
import os
from urllib.parse import urlparse

url = os.environ.get("DATABASE_URL", "")
parsed = urlparse(url)
port = parsed.port or 5432
print(port)
PY
)
fi

# Attendre la DB
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
  echo "Waiting for database ${DB_HOST}:${DB_PORT}..."
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 1
  done
  echo "Database available."
else
  echo "No database host configured for TCP wait. Skipping nc check."
fi

# Appliquer migrations et collectstatic si besoin
python manage.py migrate --noinput
# python manage.py collectstatic --noinput

# Exécuter la commande du service (ex: runserver)
exec "$@"