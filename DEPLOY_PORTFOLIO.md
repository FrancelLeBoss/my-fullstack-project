# Deploiement Portfolio Shopsy (gratuit)

Objectif: mettre en ligne rapidement une version publique stable pour portfolio.

Stack recommandee:
- Frontend: Vercel (gratuit)
- Backend Django: Render (gratuit)
- Base de donnees PostgreSQL: Neon (gratuit)
- Media images produits: Cloudinary (gratuit) ou temporairement media local

---

## 1. Preparer le backend Django pour la production

Dans backend/myshop/settings.py, verifier ces points:

1. DEBUG pilote par variable d'environnement
- DEBUG=False en production

2. ALLOWED_HOSTS
- Ajouter le domaine Render

3. CORS
- Remplacer CORS_ALLOW_ALL_ORIGINS=True par CORS_ALLOWED_ORIGINS
- Ajouter le domaine Vercel

4. CSRF trusted origins
- Ajouter https://<ton-frontend>.vercel.app

5. DATABASE_URL
- Deja present via dj_database_url: garder ce mecanisme

6. Static files
- Ajouter STATIC_ROOT si absent

7. FRONTEND_URL / FRONTEND_BASE_URL
- Mettre l'URL Vercel en prod

8. Secrets
- Aucun secret en dur dans le code

Dependances backend a verifier dans backend/requirements.txt:
- gunicorn
- dj-database-url
- psycopg2-binary
- whitenoise (optionnel mais recommande)

---

## 2. Creer la base PostgreSQL sur Neon

1. Creer un compte Neon
2. Creer un projet + database
3. Recuperer l'URL de connexion PostgreSQL
4. Garder cette valeur pour DATABASE_URL sur Render

---

## 3. Deployer le backend sur Render

1. Connecter ton repo GitHub a Render
2. Creer un Web Service sur le dossier backend
3. Renseigner:
- Build Command:
  pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
- Start Command:
  gunicorn myshop.wsgi:application --bind 0.0.0.0:$PORT

4. Variables d'environnement Render a configurer:
- SECRET_KEY
- DEBUG=False
- DATABASE_URL=<URL Neon>
- ALLOWED_HOSTS=<ton-backend>.onrender.com
- FRONTEND_URL=https://<ton-frontend>.vercel.app
- FRONTEND_BASE_URL=https://<ton-frontend>.vercel.app/
- EMAIL_HOST_USER
- EMAIL_HOST_PASSWORD
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- CORS_ALLOWED_ORIGINS=https://<ton-frontend>.vercel.app

5. Tester rapidement:
- https://<ton-backend>.onrender.com/api/hello/

---

## 4. Deployer le frontend sur Vercel

1. Connecter le meme repo a Vercel
2. Selectionner le dossier frontend
3. Build settings:
- Install Command: npm ci
- Build Command: npm run build
- Output Directory: dist

4. Variable d'environnement Vercel:
- VITE_API_BASE_URL=https://<ton-backend>.onrender.com/

5. Redeployer puis tester:
- navigation
- login/register
- listing produits
- paiement (si Stripe config)

---

## 5. Relier Stripe (si tu veux montrer un flow paiement)

1. Configurer les cles Stripe prod/test cote backend
2. Ajouter un endpoint webhook backend si pas encore fait
3. Dans Stripe Dashboard, declarer le webhook:
- URL: https://<ton-backend>.onrender.com/api/<webhook-endpoint>
4. Tester un paiement de bout en bout

---

## 6. Checklist portfolio finale

- App frontend accessible publiquement
- Backend API accessible publiquement
- HTTPS actif sur les deux
- README avec:
  - lien live frontend
  - lien API backend
  - identifiants demo (si besoin)
  - capture d'ecran
  - stack technique

---

## 7. Limites du gratuit (normal pour portfolio)

- Backend gratuit peut se mettre en veille (cold start)
- Premiere requete parfois lente
- Suffisant pour un portfolio tant que tu l'indiques dans le README

---

## Plan 45 minutes (ordre recommande)

1. 10 min: Neon DB + URL
2. 15 min: Render backend + env vars
3. 10 min: Vercel frontend + VITE_API_BASE_URL
4. 10 min: tests smoke + maj README

---

Si tu veux, prochaine etape: je peux te preparer une liste exacte de modifications de settings.py et des variables d'environnement, prete a copier-coller pour ton projet actuel.
