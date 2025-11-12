from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime

class VentaBase(BaseModel):
    id_usuario: Optional[int] = None
    total: Optional[Decimal] = None

class VentaCreate(BaseModel):
    id_usuario: Optional[int] = None
    detalles: List["DetalleVentaCreate"]

class VentaRead(VentaBase):
    id_venta: int
    fecha_venta: datetime
    detalles: List["DetalleVentaRead"] = []
    usuario: Optional["UsuarioRead"] = None
    
    class Config:
        from_attributes = True

from src.schemas.detalle_venta import DetalleVentaCreate, DetalleVentaRead
from src.schemas.usuario import UsuarioRead
VentaRead.model_rebuild()

