// Configuración de la API
// En Minikube con LoadBalancer, el backend estará disponible en localhost:8000 cuando se ejecute minikube tunnel
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('Hostname detectado:', hostname);
    
    // Si estamos en localhost, el backend debería estar en localhost:8000 (con minikube tunnel)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      const url = "http://localhost:8000";
      console.log('Usando URL para localhost:', url);
      return url;
    }
    
    // Si estamos accediendo desde una IP, intentar usar el mismo hostname con puerto 8000
    const url = `http://${hostname}:8000`;
    console.log('Usando URL con mismo hostname:', url);
    return url;
  }
  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";
  console.log('Usando URL por defecto:', url);
  return url;
};

export const API_URL = getApiUrl();
console.log("✅ API URL configurada:", API_URL);

// Función para verificar conectividad con timeout
export const testConnection = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
  
  try {
    console.log('Probando conexión a:', `${API_URL}/`);
    const res = await fetch(`${API_URL}/`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    console.log('Respuesta del servidor:', res.status, res.statusText);
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Conexión exitosa:', data);
      return true;
    } else {
      console.error('❌ Error en la respuesta:', res.status, res.statusText);
      return false;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('❌ Timeout: La conexión tardó más de 5 segundos');
      console.error('💡 Solución: Ejecuta "minikube tunnel" en otra terminal para exponer los servicios');
    } else {
      console.error('❌ Error de conexión:', error);
      console.error('Detalles del error:', error.message);
    }
    return false;
  }
};

