from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Register DB connection hooks (e.g. enforce PostgreSQL search_path on Neon pooler).
        from . import db_connection_hooks  # noqa: F401
