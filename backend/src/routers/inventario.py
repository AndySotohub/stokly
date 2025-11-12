from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.database import get_db
from src.models.inventario import Inventario
from src.models.producto import Producto
from src.schemas.inventario import InventarioCreate, InventarioRead, InventarioUpdate
from src.metrics import productos_stock_bajo_gauge

router = APIRouter(prefix="/inventario", tags=["inventario"])

@router.get("/", response_model=List[InventarioRead])
def get_inventario(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inventario = db.query(Inventario).offset(skip).limit(limit).all()
    
    # Actualizar métrica de productos con stock bajo
    stock_bajo_count = db.query(Inventario).filter(
        Inventario.stock_actual <= Inventario.stock_minimo
    ).count()
    productos_stock_bajo_gauge.set(stock_bajo_count)
    
    return inventario

@router.get("/stock-bajo", response_model=List[InventarioRead])
def get_stock_bajo(db: Session = Depends(get_db)):
    """Obtiene productos con stock por debajo del mínimo"""
    inventario = db.query(Inventario).filter(
        Inventario.stock_actual <= Inventario.stock_minimo
    ).all()
    return inventario

@router.post("/", response_model=InventarioRead)
def create_inventario(inventario: InventarioCreate, db: Session = Depends(get_db)):
    # Verificar que el producto existe
    producto = db.query(Producto).filter(Producto.id_producto == inventario.id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar que no existe inventario para este producto
    existing = db.query(Inventario).filter(Inventario.id_producto == inventario.id_producto).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe inventario para este producto")
    
    db_inventario = Inventario(
        id_producto=inventario.id_producto,
        stock_actual=inventario.stock_actual,
        stock_minimo=inventario.stock_minimo
    )
    db.add(db_inventario)
    db.commit()
    db.refresh(db_inventario)
    return db_inventario

@router.get("/producto/{producto_id}", response_model=InventarioRead)
def get_inventario_by_producto(producto_id: int, db: Session = Depends(get_db)):
    inventario = db.query(Inventario).filter(Inventario.id_producto == producto_id).first()
    if not inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado para este producto")
    return inventario

@router.put("/{inventario_id}", response_model=InventarioRead)
def update_inventario(inventario_id: int, inventario: InventarioUpdate, db: Session = Depends(get_db)):
    db_inventario = db.query(Inventario).filter(Inventario.id_inventario == inventario_id).first()
    if not db_inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    
    if inventario.stock_actual is not None:
        db_inventario.stock_actual = inventario.stock_actual
    if inventario.stock_minimo is not None:
        db_inventario.stock_minimo = inventario.stock_minimo
    
    db.commit()
    db.refresh(db_inventario)
    return db_inventario

@router.put("/producto/{producto_id}/ajustar", response_model=InventarioRead)
def ajustar_stock(producto_id: int, cantidad: int, db: Session = Depends(get_db)):
    """Ajusta el stock de un producto (suma o resta según el signo)"""
    inventario = db.query(Inventario).filter(Inventario.id_producto == producto_id).first()
    if not inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado para este producto")
    
    nuevo_stock = inventario.stock_actual + cantidad
    if nuevo_stock < 0:
        raise HTTPException(status_code=400, detail="No se puede tener stock negativo")
    
    inventario.stock_actual = nuevo_stock
    db.commit()
    db.refresh(inventario)
    return inventario

@router.delete("/{inventario_id}")
def delete_inventario(inventario_id: int, db: Session = Depends(get_db)):
    inventario = db.query(Inventario).filter(Inventario.id_inventario == inventario_id).first()
    if not inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    db.delete(inventario)
    db.commit()
    return {"detail": "Inventario eliminado"}

