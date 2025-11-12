from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base

class Usuario(Base):
    __tablename__ = "usuario"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False, index=True)
    contrasena = Column(String(200), nullable=False)
    id_rol = Column(Integer, ForeignKey("rol.id_rol"), nullable=True)
    
    rol = relationship("Rol", back_populates="usuarios")
    ventas = relationship("Venta", back_populates="usuario")

