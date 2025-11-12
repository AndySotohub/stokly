import { useState, useEffect } from 'react';
import { inventarioService } from '../services/api';

export default function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await inventarioService.getAll();
      setInventario(data);
    } catch (error) {
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && inventario.length === 0) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Cargando...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#1f2937" }}>Inventario</h1>
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Producto</th>
              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Stock Actual</th>
              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Stock Mínimo</th>
              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(inv => {
              const stockBajo = inv.stock_actual <= inv.stock_minimo;
              return (
                <tr 
                  key={inv.id_inventario} 
                  style={{ 
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: stockBajo ? "#fef2f2" : "white"
                  }}
                >
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                    {inv.producto?.nombre || `Producto ${inv.id_producto}`}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "1.125rem", fontWeight: "600" }}>
                    {inv.stock_actual}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{inv.stock_minimo}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      backgroundColor: stockBajo ? "#fee2e2" : "#d1fae5",
                      color: stockBajo ? "#991b1b" : "#065f46"
                    }}>
                      {stockBajo ? "⚠️ Stock Bajo" : "✓ OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inventario.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
            No hay productos en inventario. Crea productos y asigna inventario para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}

