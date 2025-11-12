import { API_URL } from '../config/api';

// Función helper para manejar respuestas
const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Error HTTP: ${res.status}`);
  }
  return res.json();
};

// Servicio para Productos
export const productosService = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_URL}/productos/`);
      return handleResponse(res);
    } catch (error) {
      console.error('Error en productosService.getAll:', error);
      throw error;
    }
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`);
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_URL}/productos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `Error HTTP: ${res.status}`);
    }
    return res.json().catch(() => ({ detail: 'Producto eliminado' }));
  }
};

// Servicio para Categorías
export const categoriasService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/categorias/`);
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/categorias/${id}`);
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_URL}/categorias/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `Error HTTP: ${res.status}`);
    }
    return res.json().catch(() => ({ detail: 'Categoría eliminada' }));
  }
};

// Servicio para Inventario
export const inventarioService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/inventario/`);
    return handleResponse(res);
  },
  getStockBajo: async () => {
    const res = await fetch(`${API_URL}/inventario/stock-bajo`);
    return handleResponse(res);
  },
  getByProducto: async (productoId) => {
    const res = await fetch(`${API_URL}/inventario/producto/${productoId}`);
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_URL}/inventario/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/inventario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  ajustarStock: async (productoId, cantidad) => {
    const res = await fetch(`${API_URL}/inventario/producto/${productoId}/ajustar?cantidad=${cantidad}`, {
      method: 'PUT'
    });
    return handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/inventario/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `Error HTTP: ${res.status}`);
    }
    return res.json().catch(() => ({ detail: 'Inventario eliminado' }));
  }
};

// Servicio para Ventas
export const ventasService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/ventas/`);
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/ventas/${id}`);
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_URL}/ventas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/ventas/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `Error HTTP: ${res.status}`);
    }
    return res.json().catch(() => ({ detail: 'Venta eliminada' }));
  }
};

