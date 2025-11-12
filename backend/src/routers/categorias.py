from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.database import get_db
from src.models.categoria import Categoria
from src.schemas.categoria import CategoriaCreate, CategoriaRead

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.get("/", response_model=List[CategoriaRead])
def get_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categorias = db.query(Categoria).offset(skip).limit(limit).all()
    return categorias

@router.post("/", response_model=CategoriaRead)
def create_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    db_categoria = Categoria(nombre=categoria.nombre)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.get("/{categoria_id}", response_model=CategoriaRead)
def get_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

@router.put("/{categoria_id}", response_model=CategoriaRead)
def update_categoria(categoria_id: int, categoria: CategoriaCreate, db: Session = Depends(get_db)):
    db_categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db_categoria.nombre = categoria.nombre
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.delete("/{categoria_id}")
def delete_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(categoria)
    db.commit()
    return {"detail": "Categoría eliminada"}

