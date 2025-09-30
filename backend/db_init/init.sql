--Tablas de usuarios

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(200) NOT NULL,
    id_rol INT REFERENCES rol(id_rol) ON DELETE SET NULL
);

-- Tablas de productos

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario NUMERIC(10,2) NOT NULL,
    id_categoria INT REFERENCES categoria(id_categoria) ON DELETE SET NULL
);

CREATE TABLE inventario (
    id_inventario SERIAL PRIMARY KEY,
    id_producto INT REFERENCES producto(id_producto) ON DELETE CASCADE,
    stock_actual INT NOT NULL,
    stock_minimo INT DEFAULT 0
);

-- Tablas de ventas

CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha_venta TIMESTAMP DEFAULT NOW(),
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    total NUMERIC(12,2)
);

CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT REFERENCES venta(id_venta) ON DELETE CASCADE,
    id_producto INT REFERENCES producto(id_producto) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL
);


-- Datos iniciales para pruebas

-- Roles
INSERT INTO rol (nombre_rol) VALUES
('Administrador'),
('Vendedor'),
('Cliente');

-- Usuarios
INSERT INTO usuario (nombre, correo, contrasena, id_rol) VALUES
('Juan Pérez', 'juan@example.com', '1234', 1),
('Ana Gómez', 'ana@example.com', 'abcd', 2);

-- Categorías
INSERT INTO categoria (nombre) VALUES
('Bebidas'),
('Comida'),
('Postres');

-- Productos
INSERT INTO producto (nombre, descripcion, precio_unitario, id_categoria) VALUES
('Café', 'Café negro tradicional', 2500, 1),
('Sandwich', 'Sandwich de jamón y queso', 7500, 2),
('Brownie', 'Brownie de chocolate con nuez', 4500, 3);

-- Inventario
INSERT INTO inventario (id_producto, stock_actual, stock_minimo) VALUES
(1, 50, 5),
(2, 20, 2),
(3, 15, 3);

-- Ventas
INSERT INTO venta (id_usuario, total) VALUES
(1, 10000),
(2, 4500);

-- Detalle de ventas
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 2500),
(1, 2, 1, 7500),
(2, 3, 1, 4500);