#!/bin/bash

# Script de despliegue universal (funciona con túnel o sin túnel)

set -e

echo "Desplegando Stokly..."

# Verificar que minikube esté corriendo
if ! minikube status &> /dev/null; then
    echo " Minikube no está corriendo. Iniciando..."
    minikube start
fi

# Configurar Docker para usar Minikube
echo "🔧 Configurando Docker para Minikube..."
eval $(minikube docker-env)

# Obtener IP de Minikube
MINIKUBE_IP=$(minikube ip)

# Construir imagen backend
echo "Construyendo backend..."
cd /Users/mateomolina/Documents/stokly/stokly/backend
docker build -t mmolina07/stokly-backend:v1 . --quiet

# Determinar URL del backend (túnel o NodePort)
if pgrep -f "minikube tunnel" > /dev/null; then
    BACKEND_URL="http://localhost:8000"
    FRONTEND_URL="http://localhost"
    echo "✓ Túnel detectado - usando localhost"
else
    BACKEND_URL="http://${MINIKUBE_IP}:30080"
    FRONTEND_URL="http://${MINIKUBE_IP}:30081"
    echo "✓ Sin túnel - usando IP de Minikube"
fi

echo "Backend URL: $BACKEND_URL"

# Construir imagen frontend con la URL correcta
echo "🏗️  Construyendo frontend..."
cd /Users/mateomolina/Documents/stokly/stokly/frontend

# Crear .env con la URL del backend
echo "VITE_API_URL=$BACKEND_URL" > .env

# Instalar dependencias si no están
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias npm..."
  npm install --silent
fi

docker build -t mmolina07/stokly-frontend:v1 . --quiet

# Aplicar manifiestos
echo "📦 Aplicando manifiestos..."
cd /Users/mateomolina/Documents/stokly/stokly
kubectl apply -f kube/secret.yaml
kubectl apply -f kube/configmap.yaml
kubectl apply -f kube/postgres-init-configmap.yaml
kubectl apply -f kube/pvc.yaml
kubectl apply -f kube/deployment.yaml
kubectl apply -f kube/service.yaml
kubectl apply -f kube/prometheus.yaml

# Esperar a que los pods estén listos
echo "⏳ Esperando a que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=stokly-db --timeout=120s || true
kubectl wait --for=condition=ready pod -l app=stokly-backend --timeout=120s || true
kubectl wait --for=condition=ready pod -l app=stokly-frontend --timeout=120s || true
kubectl wait --for=condition=ready pod -l app=prometheus --timeout=120s || true

echo ""
echo "¡Despliegue completado!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ACCESO A LA APLICACIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if pgrep -f "minikube tunnel" > /dev/null; then
    echo "Frontend:   $FRONTEND_URL"
    echo "Backend:    $BACKEND_URL"
    echo "API Docs:   $BACKEND_URL/docs"
    echo "Métricas:   $BACKEND_URL/metrics"
    echo "Prometheus: http://localhost:9090"
    echo ""
    echo "✓ Túnel activo - accede directamente a localhost"
else
    PROMETHEUS_URL="http://${MINIKUBE_IP}:30090"
    echo "Frontend:   $FRONTEND_URL"
    echo "Backend:    $BACKEND_URL"
    echo "API Docs:   $BACKEND_URL/docs"
    echo "Métricas:   $BACKEND_URL/metrics"
    echo "Prometheus: $PROMETHEUS_URL"
    echo ""
    echo " Para usar localhost, ejecuta en otra terminal:"
    echo "   sudo minikube tunnel"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Estado de los pods:"
kubectl get pods
echo ""
echo "Servicios:"
kubectl get svc
echo ""
