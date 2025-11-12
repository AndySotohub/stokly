from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.database import Base

class Categoria(Base):
    __tablename__ = "categoria"
    
    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    
    productos = relationship("Producto", back_populates="categoria")

