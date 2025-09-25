from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["items"])

fake_items_db = [{"id": 1, "name": "Laptop", "stock": 10},
                 {"id": 2, "name": "Mouse", "stock": 50}]

@router.get("/")
def get_items():
    return fake_items_db