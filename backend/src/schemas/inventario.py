from pydantic import BaseModel
from typing import Optional

class InventarioBase(BaseModel):
    stock_actual: int
    stock_minimo: int = 0

class InventarioCreate(InventarioBase):
    id_producto: int

class InventarioUpdate(BaseModel):
    stock_actual: Optional[int] = None
    stock_minimo: Optional[int] = None

class InventarioRead(InventarioBase):
    id_inventario: int
    id_producto: int
    producto: Optional["ProductoRead"] = None
    
    class Config:
        from_attributes = True

from src.schemas.producto import ProductoRead
InventarioRead.model_rebuild()

