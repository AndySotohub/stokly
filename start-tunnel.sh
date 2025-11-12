#!/bin/bash

# Script para iniciar minikube tunnel (necesario para LoadBalancer en macOS)

echo "Iniciando minikube tunnel..."
echo "Este proceso debe mantenerse corriendo en una terminal separada"
echo "Presiona Ctrl+C para detener el túnel"
echo ""
echo "Una vez iniciado, los servicios estarán disponibles en:"
echo "  - Backend:  http://localhost:8000"
echo "  - Frontend: http://localhost:80"
echo ""

minikube tunnel

