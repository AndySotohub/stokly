from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from src.database import Base, engine, get_db
from sqlalchemy import text

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