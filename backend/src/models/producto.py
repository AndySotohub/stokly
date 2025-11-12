from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.database import Base

class Producto(Base):
    __tablename__ = "producto"
    
    id_producto = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"), nullable=True)
    
    categoria = relationship("Categoria", back_populates="productos")
    inventario = relationship("Inventario", back_populates="producto", uselist=False)
    detalles_venta = relationship("DetalleVenta", back_populates="producto")

