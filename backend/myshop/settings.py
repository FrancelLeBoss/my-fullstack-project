# Django settings for myshop project.
from pathlib import Path
import os
from urllib.parse import urlparse
from dotenv import load_dotenv  # Import the load_dotenv function from dotenv
import dj_database_url  # Import the dj_database_url module

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173/").rstrip("/") + "/"
BACKEND_URL = os.getenv("BACKEND_URL", os.getenv("RENDER_EXTERNAL_URL", "")).strip()


def to_origin(url: str) -> str:
    if not url:
        return ""
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return ""
    return f"{parsed.scheme}://{parsed.netloc}"


def normalize_host(raw_value: str) -> str:
    value = (raw_value or "").strip().strip('"').strip("'")
    if not value:
        return ""

    # Accept full URLs in env values and keep only the hostname.
    if "://" in value:
        parsed = urlparse(value)
        return parsed.hostname or ""

    # Accept optional host:port and keep only host for Django's ALLOWED_HOSTS.
    return value.split(":", 1)[0]


FRONTEND_ORIGIN = to_origin(FRONTEND_URL)
BACKEND_ORIGIN = to_origin(BACKEND_URL)


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "/media/"  # URL de base pour les fichiers médias
MEDIA_ROOT = os.path.join(
    BASE_DIR, "media"
)  # Chemin absolu vers le dossier des fichiers médias


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", "changeme")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = [
    host
    for host in (
        normalize_host(item)
        for item in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    )
    if host
]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api.apps.ApiConfig",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "anymail",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",  # C'est une bonne valeur par défaut pour les API JWT
    ),
}

from datetime import timedelta  # N'oubliez pas d'importer timedelta !

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        hours=8
    ),  # Le token d'accès sera valide 8 heures
    "REFRESH_TOKEN_LIFETIME": timedelta(
        weeks=2
    ),  # Le token de rafraîchissement sera valide 2 semaines
    # --- Paramètres de sécurité et de rotation des tokens (hautement recommandés) ---
    "ROTATE_REFRESH_TOKENS": True,  # Quand un refresh token est utilisé, un nouveau est généré
    "BLACKLIST_AFTER_ROTATION": True,  # L'ancien refresh token est blacklisté après rotation
    "UPDATE_LAST_LOGIN": False,  # Optionnel: met à jour le champ last_login de l'utilisateur
    # --- Autres paramètres par défaut (généralement pas besoin de les modifier) ---
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,  
    "AUDIENCE": None,
    "ISSUER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
    "AUTH_USER_MODEL": "api.User",
    "AUTH_HEADER_TYPES": (
        "Bearer",
    ),  # Le type de préfixe pour le token dans l'en-tête Authorization
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    # Pour les tokens "glissants" (Sliding Tokens), si vous les utilisiez. Pas nécessaires pour votre cas.
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}

CORS_ALLOW_ALL_ORIGINS = DEBUG
CORS_ALLOWED_ORIGINS = [origin for origin in {FRONTEND_ORIGIN} if origin]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]
CSRF_TRUSTED_ORIGINS = [origin for origin in {FRONTEND_ORIGIN, BACKEND_ORIGIN} if origin]

# Render place Django derrière un proxy HTTPS ; ces flags évitent les faux positifs CSRF.
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

if DEBUG:
    local_origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    }
    CORS_ALLOWED_ORIGINS = sorted(set(CORS_ALLOWED_ORIGINS) | local_origins)
    CORS_ALLOWED_ORIGIN_REGEXES = list(CORS_ALLOWED_ORIGIN_REGEXES)
    CSRF_TRUSTED_ORIGINS = sorted(set(CSRF_TRUSTED_ORIGINS) | local_origins)

AUTH_USER_MODEL = "api.User"
FRONTEND_BASE_URL = FRONTEND_URL
ROOT_URLCONF = "myshop.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "myshop.wsgi.application"


'''DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "my_shop_db"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", "francelKazakh*2022"),
        "HOST": os.getenv("DB_HOST", "db"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}'''

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL")
    )
}

# Neon pooler does not support startup "options" parameters.
# Apply search_path only for non-pooler PostgreSQL connections.
db_url = os.environ.get("DATABASE_URL", "")
db_host = urlparse(db_url).hostname or ""
if db_host and "pooler" not in db_host:
    DATABASES["default"].setdefault("OPTIONS", {})
    DATABASES["default"]["OPTIONS"]["options"] = "-c search_path=public"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Configuration de l'envoi d'e-mails
# En développement: console backend (affiche les emails en terminal)
# En production: SMTP avec variables d'environnement
if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"
    ANYMAIL = {
        "RESEND_API_KEY": os.getenv("RESEND_API_KEY"),
    }
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL") or "noreply@francel-prowo.com"
# else:
#     EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
#     EMAIL_HOST = "smtp.gmail.com"
#     EMAIL_PORT = 587
#     EMAIL_USE_TLS = True
#     EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
#     EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
#     EMAIL_TIMEOUT = int(os.getenv("EMAIL_TIMEOUT", "10"))

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL") or os.getenv("EMAIL_HOST_USER") or "noreply@shopsy.com"

# Configuration du stockage des médias (S3 en production, système de fichiers local en développement)
if DEBUG:
    # Développement: stockage local
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
else:
    # Production: S3 / AWS
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'ca-central-1')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False
    
    # URL publique pour accéder aux médias
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
    
    # Ne pas utiliser MEDIA_ROOT en S3 (pas pertinent)
    # MEDIA_ROOT = None
