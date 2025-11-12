from pydantic import BaseModel
from typing import Optional

class CategoriaBase(BaseModel):
    nombre: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaRead(CategoriaBase):
    id_categoria: int
    
    class Config:
        from_attributes = True

