from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base

class Inventario(Base):
    __tablename__ = "inventario"
    
    id_inventario = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("producto.id_producto", ondelete="CASCADE"), unique=True, nullable=False)
    stock_actual = Column(Integer, nullable=False)
    stock_minimo = Column(Integer, default=0)
    
    producto = relationship("Producto", back_populates="inventario")

