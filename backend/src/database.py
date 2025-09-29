from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexión a la base de datos
# Reemplaza los valores con los tuyos
DATABASE_URL = "postgresql+psycopg2://postgres:12345@db:5432/stokly"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()


# Dependencia para obtener sesión en cada request (si usas FastAPI, por ejemplo)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()