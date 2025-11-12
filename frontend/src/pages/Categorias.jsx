import { useState, useEffect } from 'react';
import { categoriasService } from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await categoriasService.getAll();
      setCategorias(data);
    } catch (error) {
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id_categoria) {
        await categoriasService.update(formData.id_categoria, formData);
      } else {
        await categoriasService.create(formData);
      }
      setShowModal(false);
      setFormData({});
      loadData();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoriasService.delete(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const openModal = (categoria = null) => {
    setFormData(categoria || {});
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#1f2937" }}>Categorías</h1>
        <button
          onClick={() => openModal()}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500"
          }}
        >
          + Nueva Categoría
        </button>
      </div>

      {loading && categorias.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Cargando...</div>
      ) : (
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>ID</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Nombre</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id_categoria} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem" }}>{c.id_categoria}</td>
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>{c.nombre}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => openModal(c)}
                      style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id_categoria)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categorias.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
              No hay categorías. Crea una nueva para comenzar.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%"
          }}>
            <h3 style={{ marginTop: 0 }}>
              {formData.id_categoria ? "Editar Categoría" : "Nueva Categoría"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre || ""}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "4px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({}); }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

