"""
Módulo de métricas de Prometheus para Stokly
"""
from prometheus_client import Counter, Gauge, Histogram

# Contador de ventas totales
ventas_totales_counter = Counter(
    'stokly_ventas_totales',
    'Número total de ventas realizadas'
)

# Gauge de productos con stock bajo
productos_stock_bajo_gauge = Gauge(
    'stokly_productos_stock_bajo',
    'Número de productos con stock por debajo del mínimo'
)

# Histograma de montos de ventas
ventas_monto_histogram = Histogram(
    'stokly_ventas_monto',
    'Distribución de montos de ventas',
    buckets=[0, 10000, 50000, 100000, 500000, 1000000, 5000000]
)

# Contador de productos creados
productos_creados_counter = Counter(
    'stokly_productos_creados',
    'Número total de productos creados'
)

# Gauge de total de productos
total_productos_gauge = Gauge(
    'stokly_total_productos',
    'Número total de productos en el sistema'
)
