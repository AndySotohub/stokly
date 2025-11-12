import { useState, useEffect } from 'react';
import { ventasService, productosService } from '../services/api';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ detalles: [{ id_producto: "", cantidad: 1, precio_unitario: "" }] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vts, prods] = await Promise.all([
        ventasService.getAll(),
        productosService.getAll()
      ]);
      setVentas(vts);
      setProductos(prods);
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
      const detalles = formData.detalles
        .filter(d => d.id_producto && d.cantidad > 0)
        .map(d => ({
          id_producto: parseInt(d.id_producto),
          cantidad: parseInt(d.cantidad),
          precio_unitario: d.precio_unitario ? parseFloat(d.precio_unitario) : null
        }));

      if (detalles.length === 0) {
        alert('Debes agregar al menos un producto');
        return;
      }

      await ventasService.create({ id_usuario: null, detalles });
      setShowModal(false);
      setFormData({ detalles: [{ id_producto: "", cantidad: 1, precio_unitario: "" }] });
      loadData();
    } catch (error) {
      alert('Error al crear venta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta venta? El stock será restaurado.')) return;
    try {
      await ventasService.delete(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const openModal = () => {
    setFormData({ detalles: [{ id_producto: "", cantidad: 1, precio_unitario: "" }] });
    setShowModal(true);
  };

  const addDetalle = () => {
    setFormData({
      ...formData,
      detalles: [...formData.detalles, { id_producto: "", cantidad: 1, precio_unitario: "" }]
    });
  };

  const removeDetalle = (index) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData({ ...formData, detalles: nuevosDetalles });
  };

  const updateDetalle = (index, field, value) => {
    const nuevosDetalles = [...formData.detalles];
    nuevosDetalles[index][field] = value;
    setFormData({ ...formData, detalles: nuevosDetalles });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#1f2937" }}>Ventas</h1>
        <button
          onClick={openModal}
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
          + Nueva Venta
        </button>
      </div>

      {loading && ventas.length === 0 ? (
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
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Fecha</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Total</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Productos</th>
                <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id_venta} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem" }}>#{v.id_venta}</td>
                  <td style={{ padding: "0.75rem" }}>{new Date(v.fecha_venta).toLocaleString('es-ES')}</td>
                  <td style={{ padding: "0.75rem", fontWeight: "600", color: "#10b981" }}>
                    ${parseFloat(v.total || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                    {v.detalles?.map(d => `${d.producto?.nombre || d.id_producto} (x${d.cantidad})`).join(", ") || "-"}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => handleDelete(v.id_venta)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ventas.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
              No hay ventas registradas. Crea una nueva venta para comenzar.
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
            maxWidth: "600px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h3 style={{ marginTop: 0 }}>Nueva Venta</h3>
            <form onSubmit={handleSubmit}>
              {formData.detalles.map((detalle, idx) => (
                <div key={idx} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "500" }}>Producto {idx + 1}</span>
                    {formData.detalles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetalle(idx)}
                        style={{ padding: "0.25rem 0.5rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem" }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <select
                    value={detalle.id_producto || ""}
                    onChange={(e) => updateDetalle(idx, "id_producto", e.target.value)}
                    required
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", border: "1px solid #d1d5db", borderRadius: "4px" }}
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre} - ${parseFloat(p.precio_unitario).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={detalle.cantidad || ""}
                    onChange={(e) => updateDetalle(idx, "cantidad", e.target.value)}
                    required
                    min="1"
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "4px" }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addDetalle}
                style={{ marginBottom: "1rem", padding: "0.5rem 1rem", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                + Agregar Producto
              </button>
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
                  {loading ? "Procesando..." : "Crear Venta"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({ detalles: [{ id_producto: "", cantidad: 1, precio_unitario: "" }] }); }}
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

