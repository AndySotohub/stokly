FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY src/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ src/

# Exponer el puerto del backend
EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]