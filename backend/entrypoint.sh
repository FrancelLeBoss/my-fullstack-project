#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

# Attendre la DB
echo "Waiting for database ${DB_HOST}:${DB_PORT}..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "Database available."

# Appliquer migrations et collectstatic si besoin
python manage.py migrate --noinput
# python manage.py collectstatic --noinput

# Exécuter la commande du service (ex: runserver)
exec "$@"