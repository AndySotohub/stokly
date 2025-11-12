from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.database import Base

class Rol(Base):
    __tablename__ = "rol"
    
    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(50), nullable=False)
    
    usuarios = relationship("Usuario", back_populates="rol")

