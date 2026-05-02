#!/usr/bin/env python3
"""
Script pour uploader les médias locaux vers un bucket S3.
Usage: python upload_media_to_s3.py
Prérequis: 
  - Avoir défini les variables d'environnement AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME
  - Ou les passer en arguments
"""

import os
import sys
import boto3
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

# Configuration
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'ca-central-1')

MEDIA_ROOT = Path(__file__).parent / 'media'


def get_content_type(file_path):
    """Retourne le type MIME en fonction de l'extension du fichier."""
    import mimetypes

    content_type, _ = mimetypes.guess_type(str(file_path))
    return content_type or 'application/octet-stream'

# Validation
if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME]):
    print("❌ Erreur: Variables d'environnement manquantes")
    print("   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME doivent être définis")
    sys.exit(1)

if not MEDIA_ROOT.exists():
    print(f"❌ Erreur: Dossier media/{MEDIA_ROOT} n'existe pas")
    sys.exit(1)

# Créer le client S3
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION_NAME
)

# Upload des fichiers
print(f"📤 Upload des médias vers bucket S3: {AWS_STORAGE_BUCKET_NAME}")
print(f"📁 Source locale: {MEDIA_ROOT}")
print("-" * 60)

uploaded_count = 0
error_count = 0

for file_path in MEDIA_ROOT.rglob('*'):
    if file_path.is_file():
        # Calcul du chemin relatif (clé S3)
        relative_path = file_path.relative_to(MEDIA_ROOT)
        s3_key = f'media/{relative_path}'.replace('\\', '/')  # Normaliser les chemins Windows
        
        try:
            # Upload du fichier
            s3_client.upload_file(
                str(file_path),
                AWS_STORAGE_BUCKET_NAME,
                s3_key,
                ExtraArgs={'ContentType': get_content_type(file_path)}
            )
            print(f"✓ {s3_key}")
            uploaded_count += 1
        except Exception as e:
            print(f"✗ {s3_key} - Erreur: {str(e)}")
            error_count += 1

print("-" * 60)
print(f"✅ Upload terminé: {uploaded_count} fichiers uploadés, {error_count} erreurs")

if error_count == 0:
    print(f"\n🎉 Succès! Les images sont maintenant accessibles à:")
    print(f"   https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com/media/...")
