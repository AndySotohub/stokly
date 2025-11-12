from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal

from src.database import get_db
from src.models.venta import Venta
from src.models.detalle_venta import DetalleVenta
from src.models.inventario import Inventario
from src.models.producto import Producto
from src.schemas.venta import VentaCreate, VentaRead
from src.metrics import ventas_totales_counter, ventas_monto_histogram

router = APIRouter(prefix="/ventas", tags=["ventas"])

@router.get("/", response_model=List[VentaRead])
def get_ventas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ventas = db.query(Venta).order_by(Venta.fecha_venta.desc()).offset(skip).limit(limit).all()
    return ventas

@router.post("/", response_model=VentaRead)
def create_venta(venta: VentaCreate, db: Session = Depends(get_db)):
    if not venta.detalles:
        raise HTTPException(status_code=400, detail="La venta debe tener al menos un detalle")
    
    # Calcular total y validar stock
    total = Decimal("0")
    detalles_a_crear = []
    
    for detalle in venta.detalles:
        # Verificar que el producto existe
        producto = db.query(Producto).filter(Producto.id_producto == detalle.id_producto).first()
        if not producto:
            raise HTTPException(status_code=404, detail=f"Producto {detalle.id_producto} no encontrado")
        
        # Verificar stock disponible
        inventario = db.query(Inventario).filter(Inventario.id_producto == detalle.id_producto).first()
        if not inventario:
            raise HTTPException(status_code=400, detail=f"No hay inventario para el producto {producto.nombre}")
        
        if inventario.stock_actual < detalle.cantidad:
            raise HTTPException(
                status_code=400, 
                detail=f"Stock insuficiente para {producto.nombre}. Disponible: {inventario.stock_actual}, Solicitado: {detalle.cantidad}"
            )
        
        # Usar precio del producto si no se especifica
        precio = detalle.precio_unitario if detalle.precio_unitario else producto.precio_unitario
        subtotal = precio * detalle.cantidad
        total += subtotal
        
        detalles_a_crear.append({
            "id_producto": detalle.id_producto,
            "cantidad": detalle.cantidad,
            "precio_unitario": precio
        })
    
    # Crear la venta
    db_venta = Venta(
        id_usuario=venta.id_usuario,
        total=total
    )
    db.add(db_venta)
    db.flush()  # Para obtener el id_venta
    
    # Crear los detalles y actualizar inventario
    for detalle_data in detalles_a_crear:
        db_detalle = DetalleVenta(
            id_venta=db_venta.id_venta,
            id_producto=detalle_data["id_producto"],
            cantidad=detalle_data["cantidad"],
            precio_unitario=detalle_data["precio_unitario"]
        )
        db.add(db_detalle)
        
        # Actualizar stock
        inventario = db.query(Inventario).filter(
            Inventario.id_producto == detalle_data["id_producto"]
        ).first()
        inventario.stock_actual -= detalle_data["cantidad"]
    
    db.commit()
    db.refresh(db_venta)
    
    # Incrementar contador de ventas y registrar monto
    ventas_totales_counter.inc()
    ventas_monto_histogram.observe(float(db_venta.total))
    
    return db_venta

@router.get("/{venta_id}", response_model=VentaRead)
def get_venta(venta_id: int, db: Session = Depends(get_db)):
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return venta

@router.delete("/{venta_id}")
def delete_venta(venta_id: int, db: Session = Depends(get_db)):
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Restaurar stock de los productos
    for detalle in venta.detalles:
        inventario = db.query(Inventario).filter(
            Inventario.id_producto == detalle.id_producto
        ).first()
        if inventario:
            inventario.stock_actual += detalle.cantidad
    
    db.delete(venta)
    db.commit()
    return {"detail": "Venta eliminada y stock restaurado"}

