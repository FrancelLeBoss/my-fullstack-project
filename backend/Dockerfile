# ...existing code...
FROM python:3.11.5

WORKDIR /app

# Installer netcat pour que l'entrypoint puisse faire "nc -z"
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY ./ ./

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copier et rendre exécutable l'entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# ...existing code...