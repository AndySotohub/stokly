import { useState, useEffect } from 'react';
import { productosService, categoriasService } from '../services/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
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
      const [prods, cats] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll()
      ]);
      setProductos(prods);
      setCategorias(cats);
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
      if (formData.id_producto) {
        await productosService.update(formData.id_producto, formData);
      } else {
        await productosService.create(formData);
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
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productosService.delete(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const openModal = (producto = null) => {
    setFormData(producto || {});
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#1f2937" }}>Productos</h1>
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
          + Nuevo Producto
        </button>
      </div>

      {loading && productos.length === 0 ? (
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
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Descripción</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Precio</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Categoría</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id_producto} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem" }}>{p.id_producto}</td>
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>{p.nombre}</td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>{p.descripcion || "-"}</td>
                  <td style={{ padding: "0.75rem" }}>${parseFloat(p.precio_unitario).toLocaleString()}</td>
                  <td style={{ padding: "0.75rem" }}>{p.categoria?.nombre || "-"}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => openModal(p)}
                      style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_producto)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
              No hay productos. Crea uno nuevo para comenzar.
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
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h3 style={{ marginTop: 0 }}>
              {formData.id_producto ? "Editar Producto" : "Nuevo Producto"}
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
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Descripción</label>
                <textarea
                  value={formData.descripcion || ""}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "4px", minHeight: "80px" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Precio Unitario *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_unitario || ""}
                  onChange={(e) => setFormData({...formData, precio_unitario: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "4px" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Categoría</label>
                <select
                  value={formData.id_categoria || ""}
                  onChange={(e) => setFormData({...formData, id_categoria: e.target.value ? parseInt(e.target.value) : null})}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "4px" }}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                  ))}
                </select>
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

