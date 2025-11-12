from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from src.database import get_db
from src.models.producto import Producto
from src.models.categoria import Categoria
from src.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from src.metrics import productos_creados_counter, total_productos_gauge

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("/", response_model=List[ProductoRead])
def get_productos(
    skip: int = 0, 
    limit: int = 100, 
    categoria_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Producto)
    if categoria_id:
        query = query.filter(Producto.id_categoria == categoria_id)
    productos = query.offset(skip).limit(limit).all()
    
    # Actualizar gauge de total de productos
    total = db.query(Producto).count()
    total_productos_gauge.set(total)
    
    return productos

@router.post("/", response_model=ProductoRead)
def create_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    # Verificar que la categoría existe si se proporciona
    if producto.id_categoria:
        categoria = db.query(Categoria).filter(Categoria.id_categoria == producto.id_categoria).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    db_producto = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio_unitario=producto.precio_unitario,
        id_categoria=producto.id_categoria
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    
    # Incrementar métricas
    productos_creados_counter.inc()
    total_productos_gauge.inc()
    
    return db_producto

@router.get("/{producto_id}", response_model=ProductoRead)
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.put("/{producto_id}", response_model=ProductoRead)
def update_producto(producto_id: int, producto: ProductoUpdate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if producto.nombre is not None:
        db_producto.nombre = producto.nombre
    if producto.descripcion is not None:
        db_producto.descripcion = producto.descripcion
    if producto.precio_unitario is not None:
        db_producto.precio_unitario = producto.precio_unitario
    if producto.id_categoria is not None:
        if producto.id_categoria:
            categoria = db.query(Categoria).filter(Categoria.id_categoria == producto.id_categoria).first()
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")
        db_producto.id_categoria = producto.id_categoria
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.delete("/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    
    # Decrementar gauge
    total_productos_gauge.dec()
    
    return {"detail": "Producto eliminado"}

