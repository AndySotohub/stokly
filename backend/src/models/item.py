from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from src.database import Base

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    stock = Column(Integer, default=0)