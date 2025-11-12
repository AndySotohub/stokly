from sqlalchemy import Column, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base

class Venta(Base):
    __tablename__ = "venta"
    
    id_venta = Column(Integer, primary_key=True, index=True)
    fecha_venta = Column(DateTime(timezone=True), server_default=func.now())
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), nullable=True)
    total = Column(Numeric(12, 2), nullable=True)
    
    usuario = relationship("Usuario", back_populates="ventas")
    detalles = relationship("DetalleVenta", back_populates="venta", cascade="all, delete-orphan")

