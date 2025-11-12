from pydantic import BaseModel
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    correo: str
    id_rol: Optional[int] = None

class UsuarioCreate(UsuarioBase):
    contrasena: str

class UsuarioRead(UsuarioBase):
    id_usuario: int
    rol: Optional["RolRead"] = None
    
    class Config:
        from_attributes = True

from src.schemas.rol import RolRead
UsuarioRead.model_rebuild()

