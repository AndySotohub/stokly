#!/bin/bash

# Script para reconstruir y redesplegar las imágenes

set -e

echo "🔧 Configurando Docker para Minikube..."
eval $(minikube docker-env)

echo "Construyendo imagen del backend..."
cd /Users/mateomolina/Documents/stokly/stokly/backend
docker build -t mmolina07/stokly-backend:v1 .

echo "Construyendo imagen del frontend..."
cd /Users/mateomolina/Documents/stokly/stokly/frontend
# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "Instalando dependencias de npm..."
  npm install
fi
docker build -t mmolina07/stokly-frontend:v1 .

echo "Reiniciando deployments..."
kubectl rollout restart deployment/stokly-backend deployment/stokly-frontend

echo "Esperando a que los pods estén listos..."
kubectl rollout status deployment/stokly-backend --timeout=120s
kubectl rollout status deployment/stokly-frontend --timeout=120s

echo ""
echo "Despliegue completado!"
echo ""
echo "Estado de los pods:"
kubectl get pods -l app=stokly-backend -l app=stokly-frontend
echo ""
echo "URLs:"
echo "  Frontend: http://$(minikube ip):30081"
echo "  Backend:  http://$(minikube ip):30080"
echo "  API Docs: http://$(minikube ip):30080/docs"

minikube service stokly-frontend