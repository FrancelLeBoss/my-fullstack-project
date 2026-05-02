import os
import re

from django.db.backends.signals import connection_created
from django.dispatch import receiver


@receiver(connection_created)
def enforce_postgres_search_path(sender, connection, **kwargs):
    """Neon pooler may start sessions with empty search_path; enforce it per connection."""
    if connection.vendor != "postgresql":
        return

    raw_search_path = os.getenv("DB_SEARCH_PATH", "public").strip()
    if not raw_search_path:
        return

    # Allow comma-separated schema names with conservative identifier rules.
    parts = [p.strip() for p in raw_search_path.split(",") if p.strip()]
    if not parts:
        return
    if any(not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", p) for p in parts):
        return
    search_path = ", ".join(parts)

    with connection.cursor() as cursor:
        cursor.execute(f"SET search_path TO {search_path}")
