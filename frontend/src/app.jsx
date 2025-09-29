export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "1rem", color: "#1f2937" }}>Stokly</h1>
        <p style={{ marginBottom: "2rem", color: "#4b5563" }}>Bienvenido, inicia sesión</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Iniciar sesión con Google
          </button>
          <button style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Iniciar sesión con Facebook
          </button>
          <button style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6b7280",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Iniciar sesión con correo
          </button>
        </div>
      </div>
    </div>
  );
}

