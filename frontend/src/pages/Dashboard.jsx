import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productosService, categoriasService, inventarioService, ventasService } from '../services/api';
import { testConnection, API_URL } from '../config/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    categorias: 0,
    stockBajo: 0,
    ventas: 0
  });
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Primero probar la conexión
    testConnection().then(connected => {
      if (!connected) {
        setConnectionError(`No se pudo conectar al backend en ${API_URL}. Verifica que el backend esté corriendo.`);
        setLoading(false);
        return;
      }
      loadStats();
    });
  }, []);

  const loadStats = async () => {
    try {
      console.log('Cargando estadísticas...');
      const [productos, categorias, stockBajo, ventas] = await Promise.allSettled([
        productosService.getAll(),
        categoriasService.getAll(),
        inventarioService.getStockBajo(),
        ventasService.getAll()
      ]);

      setStats({
        productos: productos.status === 'fulfilled' ? productos.value.length : 0,
        categorias: categorias.status === 'fulfilled' ? categorias.value.length : 0,
        stockBajo: stockBajo.status === 'fulfilled' ? stockBajo.value.length : 0,
        ventas: ventas.status === 'fulfilled' ? ventas.value.length : 0
      });

      // Log errores individuales
      if (productos.status === 'rejected') console.error('Error cargando productos:', productos.reason);
      if (categorias.status === 'rejected') console.error('Error cargando categorías:', categorias.reason);
      if (stockBajo.status === 'rejected') console.error('Error cargando stock bajo:', stockBajo.reason);
      if (ventas.status === 'rejected') console.error('Error cargando ventas:', ventas.reason);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div>Cargando...</div>
        <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
          Conectando a: {API_URL}
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div style={{ 
        backgroundColor: "#fef2f2", 
        border: "1px solid #fecaca", 
        borderRadius: "8px", 
        padding: "2rem",
        color: "#991b1b"
      }}>
        <h2 style={{ marginTop: 0 }}>⚠️ Error de Conexión</h2>
        <p>{connectionError}</p>
        <p style={{ fontSize: "0.875rem", marginTop: "1rem" }}>
          <strong>URL intentada:</strong> {API_URL}
        </p>
        <p style={{ fontSize: "0.875rem" }}>
          Abre la consola del navegador (F12) para ver más detalles.
        </p>
        <button
          onClick={() => {
            setConnectionError(null);
            setLoading(true);
            testConnection().then(connected => {
              if (connected) {
                loadStats();
              } else {
                setConnectionError(`No se pudo conectar al backend en ${API_URL}`);
                setLoading(false);
              }
            });
          }}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'Productos', value: stats.productos, icon: '📦', color: '#3b82f6', link: '/productos' },
    { label: 'Categorías', value: stats.categorias, icon: '🏷️', color: '#10b981', link: '/categorias' },
    { label: 'Stock Bajo', value: stats.stockBajo, icon: '⚠️', color: '#ef4444', link: '/inventario' },
    { label: 'Ventas', value: stats.ventas, icon: '💰', color: '#f59e0b', link: '/ventas' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", color: "#1f2937" }}>Dashboard</h1>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {statCards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: `4px solid ${card.color}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                    {card.label}
                  </p>
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#1f2937" }}>
                    {card.value}
                  </p>
                </div>
                <span style={{ fontSize: "3rem" }}>{card.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "1rem", color: "#1f2937" }}>Bienvenido a Stokly</h2>
        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
          Sistema de gestión de inventarios. Desde aquí puedes gestionar productos, categorías, 
          controlar el inventario y registrar ventas. Usa el menú lateral para navegar entre las diferentes secciones.
        </p>
      </div>
    </div>
  );
}

