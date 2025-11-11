# Stokly

Stokly es una aplicación de **gestion de inventarios** diseñada para la gestión de tiendas, control de estadisticas y ventas
---

## Tecnologías utilizadas

| Componente | Tecnología | Versión / Detalle |
|------------|------------|-----------------|
| Backend | Python | 3.11, FastAPI, SQLAlchemy, Psycopg2-binary |
| Frontend | React | 18, Vite|
| Base de datos | PostgreSQL | 17, gestionada con pgAdmin4 |
| Contenedores | Docker | Docker Compose |

---

## Estructura del proyecto

```
Stokly/
├─ backend/
│  ├─ src/
│  │  ├─ models/        # Definición de modelos SQLAlchemy
│  │  ├─ routers/       # Endpoints FastAPI    
│  │  ├─ main.py        # Entrada del backend
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  │  ├─ components/    # Componentes React
│  │  ├─ pages/         # Páginas principales
│  │  └─ App.jsx        # Entrada del frontend
│  └─ package.json
├─ docker-compose.yml
└─ README.md
```

---

## Cómo descargar el proyecto

### Clonar desde GitHub
```bash
git clone https://github.com/AndySotohub/stokly.git
cd Stokly
```
---

## Requisitos

- **Docker** y **Docker Compose** instalados  
- **Node.js** 20+ (para frontend local)  
- **Python** 3.11+ (para backend local)  
- Puerto 8000 libre para backend y 5173 para frontend  

---

## Cómo ejecutar el proyecto

### Con Docker Compose
Desde la raíz del proyecto:
```bash
docker-compose up --build
```
Servicios levantados:
- Backend: `http://localhost:8000`  
- Frontend: `http://localhost:5173`  
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

---

## Configuración adicional

- **Variables de entorno**:
  - `DATABASE_URL=postgresql+psycopg2://postgres:123@localhost:5432/stokly_db`

- **Base de datos**:
  - Puede ser administrada desde **pgAdmin4**  
  - Ejecutar migraciones iniciales desde `backend/src/models` si se hacen cambios en los modelos  

---

## Documentación de la API

La documentación de esta API se genera automáticamente gracias a FastAPI, utilizando Swagger UI.

Para acceder a ella, simplemente ejecuta el servidor y se abre en el navegador:

- http://localhost:8000/docs

Ahí se podrá visualizar y probar todos los endpoints disponibles

## Notas importantes

- Guardar los cambios antes de reconstruir los contenedores Docker  
- Verificar que los puertos 8000 y 5173 estén libres antes de levantar el proyecto  