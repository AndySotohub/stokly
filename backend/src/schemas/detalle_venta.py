from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

class DetalleVentaBase(BaseModel):
    cantidad: int
    precio_unitario: Decimal

class DetalleVentaCreate(DetalleVentaBase):
    id_producto: int

class DetalleVentaRead(DetalleVentaBase):
    id_detalle: int
    id_venta: int
    id_producto: int
    producto: Optional["ProductoRead"] = None
    
    class Config:
        from_attributes = True

from src.schemas.producto import ProductoRead
DetalleVentaRead.model_rebuild()

