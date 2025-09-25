from fastapi import FastAPI
from routers import items


app = FastAPI(title="Stokly - Control de Inventarios", version="0.1.0")
app.include_router(items.router)

@app.get("/")
def root():
    return {"message": "Bienvenido a Stokly - API de Inventarios"}