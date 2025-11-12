#!/bin/bash

# Script de despliegue de Stokly en Kubernetes (Minikube)

set -e

echo "🚀 Desplegando Stokly en Kubernetes..."

# Verificar que kubectl esté disponible
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl no está instalado"
    exit 1
fi

# Verificar que minikube esté corriendo
if ! minikube status &> /dev/null; then
    echo "Minikube no está corriendo. Iniciando Minikube..."
    minikube start
fi

echo "📦 Aplicando manifiestos de Kubernetes..."

# Aplicar en el orden correcto
echo "1 Creando Secret..."
kubectl apply -f secret.yaml

echo "2 Creando ConfigMaps..."
kubectl apply -f configmap.yaml
kubectl apply -f postgres-init-configmap.yaml

echo "3 Creando PersistentVolumeClaim..."
kubectl apply -f pvc.yaml

echo "4 Creando Deployments..."
kubectl apply -f deployment.yaml

echo "5 Creando Services..."
kubectl apply -f service.yaml

echo ""
echo "Esperando a que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=stokly-db --timeout=120s || true
kubectl wait --for=condition=ready pod -l app=stokly-backend --timeout=120s || true
kubectl wait --for=condition=ready pod -l app=stokly-frontend --timeout=120s || true

echo ""
echo "Despliegue completado!"
echo ""
echo "Estado de los recursos:"
kubectl get pods
echo ""
kubectl get svc
echo ""
echo "URLs de acceso:"
echo "  Backend:  $(minikube service stokly-backend --url 2>/dev/null || echo 'http://$(minikube ip):30080')"
echo "  Frontend: $(minikube service stokly-frontend --url 2>/dev/null || echo 'http://$(minikube ip):30081')"
echo ""
echo "Para ver los logs:"
echo "  kubectl logs -f deployment/stokly-backend"
echo "  kubectl logs -f deployment/stokly-frontend"
echo "  kubectl logs -f deployment/stokly-db"

