from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_unitario: Decimal
    id_categoria: Optional[int] = None

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_unitario: Optional[Decimal] = None
    id_categoria: Optional[int] = None

class ProductoRead(ProductoBase):
    id_producto: int
    categoria: Optional["CategoriaRead"] = None
    
    class Config:
        from_attributes = True

from src.schemas.categoria import CategoriaRead
ProductoRead.model_rebuild()

