from fastapi import FastAPI, Depends
from src.routers import items
from sqlalchemy.orm import Session
from src.database import Base, engine, get_db
from sqlalchemy import text
from src.models import item  


## Levantar server 'python3 -m uvicorn src.main:app --reload'

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stokly - Control de Inventarios",
    description="API para gestionar productos, entradas y salidas de inventario",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.include_router(items.router)

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