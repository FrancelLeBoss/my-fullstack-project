# Migration des médias vers S3 AWS

## Résumé du problème
- Les fichiers médias (`backend/media/`) sont ignorés par Git (`.gitignore`)
- Render n'a pas accès aux fichiers médias → images retournent 404 en production
- **Solution** : utiliser S3 AWS pour stocker les médias de façon persistante

## Prérequis

1. **Compte AWS** avec accès à S3
2. **CLI AWS** installé (optionnel, pour vérifier) : `aws --version`
3. **Credentials AWS** : Access Key ID + Secret Access Key (voir étapes de création ci-dessous)

## Étapes de configuration

### 1. Créer un bucket S3 sur AWS

1. Accédez à https://s3.console.aws.amazon.com
2. Cliquez sur **Create bucket**
3. **Bucket name** : `shopsy-media` (ou un nom unique)
4. **Region** : `ca-central-1` (ou ta région préférée)
5. **Block Public Access** : gardez la protection activée au niveau compte si tu veux, mais autorise la bucket policy publique pour `media/*`
6. Créez le bucket

### 2. Générer les credentials AWS

1. Accédez à https://console.aws.amazon.com/iam/
2. Cliquez sur **Users** → **Create user** (ou ajouter un nouveau)
3. Attach policy : **AmazonS3FullAccess** (ou une policy plus restrictive pour production)
4. Dans l'onglet **Security credentials** → **Create access key**
5. Copie les **Access Key ID** et **Secret Access Key** (secret à garder confidentiel ⚠️)

### 3. Configurer les variables d'environnement localement

Ajoute à ton fichier `backend/.env` :

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=<ta-access-key-id>
AWS_SECRET_ACCESS_KEY=<ta-secret-access-key>
AWS_STORAGE_BUCKET_NAME=shopsy-media
AWS_S3_REGION_NAME=ca-central-1
```

### 4. Tester localement (optionnel)

En développement (DEBUG=True), Django sert les fichiers localement. Tu peux tester la config S3 en déploiement sur Render.

### 5. Upload les médias existants vers S3

**Depuis le répertoire du projet :**

```bash
# Exécute le script Python
cd backend
python upload_media_to_s3.py
```

**Ou avec la CLI AWS :**

```bash
# Ajoute "media/" en préfixe à tous les fichiers
aws s3 sync backend/media/ s3://shopsy-media/media/ --region ca-central-1
```

**Vérifie les fichiers uploadés :**
```bash
aws s3 ls s3://shopsy-media/media/ --recursive --region ca-central-1
```

### 6. Configurer les variables sur Render

1. Va sur le dashboard Render : https://dashboard.render.com
2. Sélectionne ton service backend
3. **Environment** → **Add Environment Variable** :
   - `AWS_ACCESS_KEY_ID` = <ta-access-key>
   - `AWS_SECRET_ACCESS_KEY` = <ta-secret>
   - `AWS_STORAGE_BUCKET_NAME` = shopsy-media
   - `AWS_S3_REGION_NAME` = ca-central-1

4. **Redéploie** (push vers GitHub ou redéploiement manuel)

### 7. Vérifier que ça marche

Teste une URL d'image en production (après redéploiement) :

```bash
curl -I 'https://shopsy-media.s3.ca-central-1.amazonaws.com/media/products/3/black%20and%20white/Chaussure_Samba_OG_Enfants_noir.jpg'
```

Résultat attendu : `HTTP/2 200` (pas 404)

## Options bonus (optionnel)

### CloudFront (CDN) pour les images
Ajoute CloudFront devant S3 pour cache/performances :
1. Crée une distribution CloudFront pointant vers ton bucket S3
2. Change `AWS_S3_CUSTOM_DOMAIN` dans `settings.py` vers ton domaine CloudFront

### Bucket policy pour l'accès public (en prod)

Si tu veux que les objets soient publics par défaut, applique une bucket policy sur `media/*` :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shopsy-media/media/*"
    }
  ]
}
```

## Notes de sécurité

- Les objets `media/*` sont publics en lecture, mais l’écriture reste limitée à ton utilisateur IAM.
- Si tu ajoutes des fichiers privés plus tard, mets-les dans un autre bucket ou rends-les accessibles via CloudFront / URLs signées.

## Troubleshooting

### Erreur : "403 Access Denied" après upload
- Vérifie que le bucket allow l'accès public (Block Public Access = OFF)
- Vérifie que les credentials ont la permission `s3:GetObject`

### Erreur : "InvalidAccessKeyId"
- Vérifie que tu as les bonnes clés dans `.env` (copie/colle exactement)
- Peut prendre quelques minutes avant que les nouvelles clés soient actives

### Les images s'affichent en dev mais pas en prod
- Vérifie que `DEBUG=False` sur Render (variables d'env)
- Redéploie après avoir ajouté les variables S3
