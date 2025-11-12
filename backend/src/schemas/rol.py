from pydantic import BaseModel

class RolBase(BaseModel):
    nombre_rol: str

class RolCreate(RolBase):
    pass

class RolRead(RolBase):
    id_rol: int
    
    class Config:
        from_attributes = True

