from pydantic import BaseModel

class ItemBase(BaseModel):
    name: str
    stock: int

class ItemCreate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: int

    class Config:
        orm_mode = True