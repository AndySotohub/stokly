import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_docs_endpoint():
    """Verifica que la documentación Swagger (/docs) esté disponible"""
    response = client.get("/docs")
    assert response.status_code == 200




## correr test con TESTING=true pytest --maxfail=1 --disable-warnings -q