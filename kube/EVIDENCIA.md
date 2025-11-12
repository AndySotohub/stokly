# Evidencia del Despliegue en Kubernetes

Este documento contiene los comandos necesarios para generar la evidencia del despliegue de Stokly en Minikube.

## Comandos para Capturas de Pantalla

### 1. Estado de los Pods

```bash
kubectl get pods
```

Salida esperada:
```
NAME                              READY   STATUS    RESTARTS   AGE
stokly-backend-xxxxxxxxxx-xxxxx   1/1     Running   0          XXs
stokly-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          XXs
stokly-db-xxxxxxxxxx-xxxxx         1/1     Running   0          XXs
stokly-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          XXs
stokly-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          XXs
```

### 2. Estado de los Services

```bash
kubectl get svc
```

Salida esperada:
```
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
stokly-backend   NodePort    10.XX.XX.XX     <none>        8000:30080/TCP    XXs
stokly-db        ClusterIP   10.XX.XX.XX     <none>        5432/TCP          XXs
stokly-frontend  NodePort    10.XX.XX.XX     <none>        80:30081/TCP      XXs
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP           XXm
```

### 3. Estado de los Deployments

```bash
kubectl get deployments
```

Salida esperada:
```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
stokly-backend   2/2     2            2           XXs
stokly-db        1/1     1            1           XXs
stokly-frontend  2/2     2            2           XXs
```

### 4. Estado de los ConfigMaps

```bash
kubectl get configmaps
```

### 5. Estado de los Secrets

```bash
kubectl get secrets
```

### 6. Estado del PersistentVolumeClaim

```bash
kubectl get pvc
```

Salida esperada:
```
NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-pvc   Bound    pvc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   2Gi        RWO            standard       XXs
```

### 7. Vista Completa de Recursos

```bash
kubectl get all
```

### 8. Descripción Detallada de un Pod

```bash
kubectl describe pod <nombre-del-pod>
```

## URLs de Servicios Locales

### Backend

```bash
# Obtener URL del servicio backend
minikube service stokly-backend --url

# O abrir en el navegador
minikube service stokly-backend
```

URL esperada: `http://192.168.49.2:30080` (IP puede variar)

Endpoints disponibles:
- `http://<minikube-ip>:30080/` - Endpoint raíz
- `http://<minikube-ip>:30080/docs` - Documentación Swagger
- `http://<minikube-ip>:30080/ping-db` - Health check de base de datos

### Frontend

```bash
# Obtener URL del servicio frontend
minikube service stokly-frontend --url

# O abrir en el navegador
minikube service stokly-frontend
```

URL esperada: `http://192.168.49.2:30081` (IP puede variar)

## Verificación de Funcionalidad

### 1. Verificar que el backend responde

```bash
curl http://$(minikube ip):30080/
```

Respuesta esperada:
```json
{"message": "Bienvenido a Stokly - API de Inventarios"}
```

### 2. Verificar conexión a la base de datos

```bash
curl http://$(minikube ip):30080/ping-db
```

Respuesta esperada:
```json
{"status": "ok", "db_version": "PostgreSQL 17.x ..."}
```

### 3. Verificar logs del backend

```bash
kubectl logs -f deployment/stokly-backend
```

### 4. Verificar logs de la base de datos

```bash
kubectl logs -f deployment/stokly-db
```

## Comandos Adicionales Útiles

### Ver eventos del cluster

```bash
kubectl get events --sort-by='.lastTimestamp'
```

### Ver recursos con más detalle

```bash
kubectl get pods -o wide
kubectl get svc -o wide
```

### Ver logs de un pod específico

```bash
kubectl logs <nombre-del-pod>
```

### Ejecutar comando en un pod

```bash
# En el pod del backend
kubectl exec -it deployment/stokly-backend -- /bin/bash

# En el pod de la base de datos
kubectl exec -it deployment/stokly-db -- psql -U postgres -d stokly
```

## Checklist de Evidencia

- [ ] Captura de `kubectl get pods` mostrando todos los pods en estado Running
- [ ] Captura de `kubectl get svc` mostrando los servicios configurados
- [ ] Captura de `kubectl get deployments` mostrando los deployments
- [ ] Captura de `kubectl get all` mostrando todos los recursos
- [ ] Captura de la URL del backend funcionando (navegador o curl)
- [ ] Captura de la URL del frontend funcionando (navegador)
- [ ] Captura de la respuesta del endpoint `/ping-db` verificando conexión a BD
- [ ] Captura de `minikube service stokly-backend --url`
- [ ] Captura de `minikube service stokly-frontend --url`

## Notas

- La IP de Minikube puede variar. Usa `minikube ip` para obtener la IP actual.
- Los pods pueden tardar unos minutos en estar completamente listos, especialmente la base de datos.
- Si algún pod está en estado `Pending` o `Error`, revisa los logs con `kubectl describe pod <nombre>`.

