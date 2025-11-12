import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/productos', label: 'Productos', icon: '📦' },
    { path: '/categorias', label: 'Categorías', icon: '🏷️' },
    { path: '/inventario', label: 'Inventario', icon: '📋' },
    { path: '/ventas', label: 'Ventas', icon: '💰' },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "system-ui, -apple-system" }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#1f2937",
        color: "white",
        padding: "1rem 2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            📦 Stokly
            <span style={{ fontSize: "0.875rem", fontWeight: "normal", opacity: 0.8 }}>
              - Gestión de Inventarios
            </span>
          </h1>
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{
          width: "250px",
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
          minHeight: "calc(100vh - 73px)",
          padding: "1rem 0"
        }}>
          <nav>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1.5rem",
                    color: isActive ? "#3b82f6" : "#6b7280",
                    backgroundColor: isActive ? "#eff6ff" : "transparent",
                    borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                    textDecoration: "none",
                    fontWeight: isActive ? "600" : "400",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

