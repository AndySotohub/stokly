from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from src.database import Base, engine, get_db
from sqlalchemy import text
from prometheus_fastapi_instrumentator import Instrumentator

# Importar todos los modelos para que se creen las tablas
from src.models import (
    Rol, Usuario, Categoria, Producto, 
    Inventario, Venta, DetalleVenta
)

# Importar routers
from src.routers import categorias, productos, inventario, ventas


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stokly - Control de Inventarios",
    description="API para gestionar productos, categorías, inventario y ventas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instrumentar FastAPI con Prometheus
Instrumentator().instrument(app).expose(app)

# Incluir routers
app.include_router(categorias.router)
app.include_router(productos.router)
app.include_router(inventario.router)
app.include_router(ventas.router)

@app.get("/")
def root():
    return {"message": "Bienvenido a Stokly - API de Inventarios"}


@app.get("/ping-db")
def ping_db(db: Session = Depends(get_db)):
    try:
        version = db.execute(text("SELECT version();")).fetchone()
        return {"status": "ok", "db_version": version[0]}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@app.get("/metrics-info")
def metrics_info():
    """Endpoint informativo sobre las métricas disponibles"""
    return {
        "metrics_endpoint": "/metrics",
        "custom_metrics": [
            {
                "name": "stokly_ventas_totales",
                "type": "counter",
                "description": "Número total de ventas realizadas"
            },
            {
                "name": "stokly_productos_stock_bajo",
                "type": "gauge",
                "description": "Número de productos con stock por debajo del mínimo"
            },
            {
                "name": "stokly_ventas_monto",
                "type": "histogram",
                "description": "Distribución de montos de ventas"
            },
            {
                "name": "stokly_productos_creados",
                "type": "counter",
                "description": "Número total de productos creados"
            },
            {
                "name": "stokly_total_productos",
                "type": "gauge",
                "description": "Número total de productos en el sistema"
            }
        ],
        "automatic_metrics": [
            "http_requests_total",
            "http_request_duration_seconds",
            "http_requests_inprogress"
        ]
    }