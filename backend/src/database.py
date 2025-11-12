from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# URL de conexión a la base de datos para Docker (PostgreSQL)
POSTGRESQL_DATABASE_URL = "postgresql+psycopg2://postgres:12345@db:5432/stokly"

# URL de conexión a la base de datos para pruebas locales (SQLite)
SQLITE_DATABASE_URL = "sqlite:///./test.db"

# Seleccionar la URL de la base de datos según el entorno
# Prioridad: Variable de entorno > Testing > Default PostgreSQL
if os.getenv("DATABASE_URL"):
    DATABASE_URL = os.getenv("DATABASE_URL")
elif os.getenv("TESTING") == "true":
    DATABASE_URL = SQLITE_DATABASE_URL
else:
    DATABASE_URL = POSTGRESQL_DATABASE_URL

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener sesión en cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()