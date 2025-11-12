# Despliegue de Stokly en Kubernetes (Minikube)

Este directorio contiene los manifiestos de Kubernetes necesarios para desplegar la aplicación Stokly en Minikube.

## Requisitos Previos

1. **Minikube instalado y ejecutándose**
   ```bash
   minikube start
   ```

2. **kubectl configurado** para conectarse a Minikube
   ```bash
   kubectl get nodes
   ```

3. **Imágenes Docker disponibles**:
   - `mmolina07/stokly-backend:v1`
   - `mmolina07/stokly-frontend:v1`
   - `postgres:17` (se descargará automáticamente)

## Estructura de Archivos

- `secret.yaml` - Credenciales de PostgreSQL (usuario, contraseña, base de datos)
- `configmap.yaml` - Configuración de la aplicación (URL de base de datos)
- `postgres-init-configmap.yaml` - Scripts de inicialización de PostgreSQL
- `pvc.yaml` - PersistentVolumeClaim para almacenar datos de PostgreSQL
- `deployment.yaml` - Deployments para PostgreSQL, Backend y Frontend
- `service.yaml` - Services para exponer los servicios

## Despliegue

### 1. Aplicar todos los manifiestos

Desde el directorio raíz del proyecto:

```bash
kubectl apply -f ./kube
```

O desde el directorio `kube/`:

```bash
kubectl apply -f .
```

### 2. Verificar el estado del despliegue

```bash
# Ver pods
kubectl get pods

# Ver servicios
kubectl get svc

# Ver deployments
kubectl get deployments

# Ver configmaps
kubectl get configmaps

# Ver secrets
kubectl get secrets
```

### 3. Ver logs de los pods

```bash
# Logs del backend
kubectl logs -f deployment/stokly-backend

# Logs del frontend
kubectl logs -f deployment/stokly-frontend

# Logs de la base de datos
kubectl logs -f deployment/stokly-db
```

## Acceso a los Servicios

### Backend API

El backend está expuesto en el puerto 30080 (NodePort):

```bash
# Obtener la URL del servicio
minikube service stokly-backend --url

# O acceder directamente
curl http://$(minikube ip):30080/
curl http://$(minikube ip):30080/docs
```

### Frontend

El frontend está expuesto en el puerto 30081 (NodePort):

```bash
# Obtener la URL del servicio
minikube service stokly-frontend --url

# O abrir en el navegador
minikube service stokly-frontend
```

### Base de Datos

La base de datos PostgreSQL está disponible internamente en el cluster como `stokly-db:5432`.

## Verificación del Despliegue

### Comandos de verificación

```bash
# Ver todos los recursos
kubectl get all

# Ver descripción detallada de un pod
kubectl describe pod <nombre-del-pod>

# Ver eventos del namespace
kubectl get events --sort-by='.lastTimestamp'

# Verificar conectividad del backend a la base de datos
kubectl exec -it deployment/stokly-backend -- curl http://localhost:8000/ping-db
```
# Verificar prometheus y metricas

curl http://localhost:8000/
curl http://localhost:8000/docs
curl http://localhost:8000/metrics

- Comando para UI de prometheus

kubectl port-forward svc/prometheus 9090:9090 &
open http://localhost:9090


### Estado esperado

Después del despliegue, deberías ver:

- **3 deployments** (stokly-db, stokly-backend, stokly-frontend)
- **3 services** (stokly-db, stokly-backend, stokly-frontend)
- **Pods en estado Running** (1 para DB, 2 para backend, 2 para frontend)
- **1 PVC** (postgres-pvc) en estado Bound
- **2 ConfigMaps** (stokly-config, postgres-init-scripts)
- **1 Secret** (stokly-secrets)

## Troubleshooting

### Si los pods no inician

```bash
# Ver logs de un pod específico
kubectl logs <nombre-del-pod>

# Ver descripción del pod para identificar problemas
kubectl describe pod <nombre-del-pod>

# Reiniciar un deployment
kubectl rollout restart deployment/stokly-backend
```

### Si el backend no se conecta a la base de datos

1. Verificar que el pod de la base de datos esté corriendo:
   ```bash
   kubectl get pods -l app=stokly-db
   ```

2. Verificar que el servicio de la base de datos esté disponible:
   ```bash
   kubectl get svc stokly-db
   ```

3. Probar conectividad desde el backend:
   ```bash
   kubectl exec -it deployment/stokly-backend -- python3 -c "import psycopg2; psycopg2.connect('postgresql://postgres:12345@stokly-db:5432/stokly')"
   ```

### Limpiar el despliegue

Para eliminar todos los recursos:

```bash
kubectl delete -f ./kube
```

O eliminar recursos específicos:

```bash
kubectl delete deployment stokly-backend stokly-frontend stokly-db
kubectl delete service stokly-backend stokly-frontend stokly-db
kubectl delete pvc postgres-pvc
kubectl delete configmap stokly-config postgres-init-scripts
kubectl delete secret stokly-secrets
```

## Notas Importantes

- Las credenciales en `secret.yaml` están en texto plano para desarrollo.
- El PVC usa la clase de almacenamiento `standard`. Asegúrate de que Minikube tenga un StorageClass disponible.
- Los servicios de backend y frontend usan NodePort para facilitar el acceso desde fuera del cluster.
- El backend tiene 2 réplicas y el frontend tiene 2 réplicas para alta disponibilidad.

