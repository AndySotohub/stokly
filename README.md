# Stokly

Stokly es una aplicación de gestion de inventarios diseñada para la gestión de tiendas, control de estadisticas y ventas.

## Tecnologías utilizadas

| Componente | Tecnología | Versión / Detalle |
|------------|------------|-----------------|
| Backend | Python | 3.11, FastAPI, SQLAlchemy, Psycopg2-binary |
| Frontend | React | 18, Vite, React Router |
| Base de datos | PostgreSQL | 17 |
| Contenedores | Docker | Docker Compose |
| Orquestación | Kubernetes | Minikube |

## Estructura del proyecto

```
Stokly/
├─ backend/
│  ├─ src/
│  │  ├─ models/        # Definición de modelos SQLAlchemy
│  │  ├─ routers/       # Endpoints FastAPI    
│  │  ├─ schemas/       # Schemas Pydantic
│  │  ├─ services/      # Servicios de negocio
│  │  ├─ main.py        # Entrada del backend
│  │  └─ database.py    # Configuración de base de datos
│  ├─ db_init/          # Scripts de inicialización de BD
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  │  ├─ components/    # Componentes React
│  │  ├─ pages/         # Páginas principales
│  │  ├─ services/      # Servicios API
│  │  ├─ config/        # Configuración
│  │  └─ app.jsx        # Entrada del frontend
│  └─ package.json
├─ kube/                 # Manifiestos de Kubernetes
│  ├─ deployment.yaml
│  ├─ service.yaml
│  ├─ configmap.yaml
│  ├─ secret.yaml
│  ├─ pvc.yaml
│  └─ postgres-init-configmap.yaml
├─ docker-compose.yml
└─ README.md
```

## Requisitos

- Docker y Docker Compose instalados
- Node.js 20+ (para frontend local)
- Python 3.11+ (para backend local)
- Minikube instalado (para despliegue en Kubernetes)
- kubectl instalado y configurado

## Despliegue en Kubernetes (Minikube)

### Paso 1: Iniciar Minikube

```bash
minikube start
```

Verificar que Minikube esté corriendo:

```bash
minikube status
kubectl get nodes
```

### Paso 2: Construir las imágenes Docker

Las imágenes deben construirse en el contexto de Docker de Minikube:

```bash
# Configurar Docker para usar el contexto de Minikube
eval $(minikube docker-env)

# Construir imagen del backend
cd backend
docker build -t mmolina07/stokly-backend:v1 .

# Construir imagen del frontend
cd ../frontend
npm install  # Instalar dependencias si es necesario
docker build -t mmolina07/stokly-frontend:v1 .
```

### Links de dockerhub

- Imagen de backend: https://hub.docker.com/r/mmolina0721/stokly-backend
- Imagen de frontend: https://hub.docker.com/r/dubinasoto9/stokly-frontend

O usar el script de rebuild:

```bash
cd /Users/mateomolina/Documents/stokly/stokly
./rebuild.sh
```

### Paso 3: Desplegar en Kubernetes

Aplicar todos los manifiestos:

```bash
kubectl apply -f ./kube
```

Esto creará:
- Secret con credenciales de PostgreSQL
- ConfigMaps con configuración y scripts de inicialización
- PersistentVolumeClaim para la base de datos
- Deployments para PostgreSQL, Backend y Frontend
- Services para exponer los servicios

### Paso 4: Verificar el despliegue

Verificar que todos los pods estén corriendo:

```bash
kubectl get pods
```

Deberías ver:
- stokly-db: 1/1 Running
- stokly-backend: 2/2 Running
- stokly-frontend: 2/2 Running

Verificar servicios:

```bash
kubectl get svc
```

### Paso 5: Iniciar Minikube Tunnel (IMPORTANTE)

En macOS con Minikube usando Docker driver, los servicios LoadBalancer requieren que se ejecute minikube tunnel en una terminal separada:

```bash
minikube tunnel
```

Mantén esta terminal abierta mientras uses la aplicación. El túnel expone los servicios LoadBalancer en localhost.

### Paso 6: Acceder a la aplicación

Una vez que minikube tunnel esté corriendo, los servicios estarán disponibles en:

- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Verificación del despliegue

Comandos útiles para verificar el estado:

```bash
# Ver todos los pods
kubectl get pods

# Ver todos los servicios
kubectl get svc

# Ver todos los recursos
kubectl get all

# Ver logs del backend
kubectl logs -f deployment/stokly-backend

# Ver logs del frontend
kubectl logs -f deployment/stokly-frontend

# Ver logs de la base de datos
kubectl logs -f deployment/stokly-db

# Ver descripción de un pod
kubectl describe pod <nombre-del-pod>
```

### Solución de problemas

Si los pods no inician:

```bash
# Ver logs de un pod específico
kubectl logs <nombre-del-pod>

# Ver descripción del pod para identificar problemas
kubectl describe pod <nombre-del-pod>

# Reiniciar un deployment
kubectl rollout restart deployment/stokly-backend
```

Si el frontend no puede conectarse al backend:

1. Verificar que minikube tunnel esté corriendo
2. Verificar que los servicios tengan EXTERNAL-IP asignada:
   ```bash
   kubectl get svc stokly-backend stokly-frontend
   ```
3. Verificar que el backend responda:
   ```bash
   curl http://localhost:8000/
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

## Ejecución local con Docker Compose

### Con Docker Compose

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Servicios levantados:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- PostgreSQL: usuario `postgres`, contraseña `12345`, puerto `5432`

### Backend local (sin Docker)

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn src.main:app --reload
```

### Frontend local (sin Docker)

```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades de la aplicación

### Dashboard
- Vista general con estadísticas de productos, categorías, stock bajo y ventas
- Navegación rápida a las diferentes secciones

### Productos
- Listar todos los productos
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Asignar productos a categorías

### Categorías
- Listar todas las categorías
- Crear nuevas categorías
- Editar categorías existentes
- Eliminar categorías

### Inventario
- Ver stock actual de todos los productos
- Ver stock mínimo configurado
- Alertas visuales para productos con stock bajo
- Vista consolidada del estado del inventario

### Ventas
- Crear nuevas ventas con múltiples productos
- Validación automática de stock disponible
- Cálculo automático de totales
- Historial de ventas realizadas
- Eliminación de ventas (restaura stock automáticamente)

## Documentación de la API

La documentación de la API se genera automáticamente con FastAPI usando Swagger UI.

Para acceder a ella:
- Local: http://localhost:8000/docs
- Kubernetes: http://localhost:8000/docs (con minikube tunnel corriendo)

Endpoints disponibles:

- GET /productos/ - Listar productos
- POST /productos/ - Crear producto
- GET /productos/{id} - Obtener producto
- PUT /productos/{id} - Actualizar producto
- DELETE /productos/{id} - Eliminar producto

- GET /categorias/ - Listar categorías
- POST /categorias/ - Crear categoría
- GET /categorias/{id} - Obtener categoría
- PUT /categorias/{id} - Actualizar categoría
- DELETE /categorias/{id} - Eliminar categoría

- GET /inventario/ - Listar inventario
- GET /inventario/stock-bajo - Productos con stock bajo
- POST /inventario/ - Crear registro de inventario
- PUT /inventario/{id} - Actualizar inventario
- PUT /inventario/producto/{id}/ajustar - Ajustar stock

- GET /ventas/ - Listar ventas
- POST /ventas/ - Crear venta
- GET /ventas/{id} - Obtener venta
- DELETE /ventas/{id} - Eliminar venta

## Configuración

### Variables de entorno

El backend usa las siguientes variables de entorno:

- DATABASE_URL: URL de conexión a PostgreSQL (configurada en ConfigMap)
- TESTING: Si está en "true", usa SQLite para pruebas

### Base de datos

La base de datos se inicializa automáticamente con:
- Tablas: rol, usuario, categoria, producto, inventario, venta, detalle_venta
- Datos de ejemplo: 3 categorías, 3 productos, inventario inicial y 2 ventas

Credenciales por defecto:
- Usuario: postgres
- Contraseña: 12345
- Base de datos: stokly

## Notas importantes

- En macOS con Minikube usando Docker driver, es necesario ejecutar `minikube tunnel` para que los servicios LoadBalancer funcionen
- El túnel debe mantenerse corriendo mientras se usa la aplicación
- Las imágenes Docker deben construirse en el contexto de Minikube usando `eval $(minikube docker-env)`
- Los datos de PostgreSQL se persisten en un PersistentVolumeClaim
- El backend tiene CORS configurado para permitir peticiones desde cualquier origen (solo para desarrollo)

## Scripts útiles

### rebuild.sh
Reconstruye las imágenes Docker y reinicia los deployments:

```bash
./rebuild.sh
```

### start-tunnel.sh
Inicia minikube tunnel:

```bash
./start-tunnel.sh
```

O directamente:

```bash
minikube tunnel
```
