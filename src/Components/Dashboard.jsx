import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(44,62,80,0.07)',
  padding: '1.5rem 2rem',
  minWidth: '220px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  marginBottom: '2rem',
};

const Dashboard = () => {
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [umbralStock, setUmbralStock] = useState(10);

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line
  }, [umbralStock]);

  const cargarDatos = () => {
    const pedidos = JSON.parse(localStorage.getItem('pedidosTambo')) || [];
    const productos = JSON.parse(localStorage.getItem('productosTambo')) || [];

    // Agrupar ventas por mes
    const ventas = {};
    let sumaVentas = 0;
    pedidos.forEach(p => {
      const fecha = new Date(p.fecha || Date.now());
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      ventas[mes] = (ventas[mes] || 0) + Number(p.cantidad || 1);
      sumaVentas += Number(p.cantidad || 1);
    });

    const meses = Object.keys(ventas).sort();
    setVentasPorMes(meses.map(mes => ({ mes, cantidad: ventas[mes] })));
    setTotalVentas(sumaVentas);
    setTotalPedidos(pedidos.length);
    setTotalProductos(productos.length);

    setProductosBajoStock(productos.filter(p => Number(p.stock) <= umbralStock));
  };

  // Datos para el gráfico de barras
  const barData = {
    labels: ventasPorMes.map(v => v.mes),
    datasets: [
      {
        label: 'Ventas por mes',
        data: ventasPorMes.map(v => v.cantidad),
        backgroundColor: '#232946',
        borderRadius: 8,
      },
    ],
  };

  // Datos para el gráfico de productos bajos en stock
  const doughnutData = {
    labels: productosBajoStock.map(p => p.nombre),
    datasets: [
      {
        label: 'Stock',
        data: productosBajoStock.map(p => p.stock),
        backgroundColor: [
          '#eebbc3', '#b8c1ec', '#f6c90e', '#ff6f61', '#6a89cc', '#38ada9'
        ],
      },
    ],
  };

  // Alertas
  const productosCriticos = productosBajoStock.filter(p => Number(p.stock) <= 3);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
      <h1 style={{ color: '#232946', marginBottom: '2rem', fontWeight: 700 }}>Dashboard de Ventas</h1>
      
      {/* Filtros y alerta única */}
      <div style={{
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap'
      }}>
        <label style={{ fontWeight: 600, color: '#232946' }}>
          Mostrar productos con stock menor  a:&nbsp;
          <input
            type="number"
            min={1}
            max={100}
            value={umbralStock}
            onChange={e => setUmbralStock(Number(e.target.value))}
            style={{
              width: 60,
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid #b8c1ec',
              fontSize: 16,
              marginLeft: 8
            }}
          />
        </label>
        {productosCriticos.length > 0 && (
          <div style={{
            background: '#ff6f61',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(255,111,97,0.12)'
          }}>
            ¡Alerta! {productosCriticos.length} producto(s) con stock crítico (≤ 3)
          </div>
        )}
        {productosBajoStock.length > 0 && productosCriticos.length === 0 && (
          <div style={{
            background: '#f6c90e',
            color: '#232946',
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(246,201,14,0.12)'
          }}>
            Atención: {productosBajoStock.length} producto(s) con bajo stock (≤ {umbralStock})
          </div>
        )}
        {productosBajoStock.length === 0 && (
          <div style={{
            background: '#38ada9',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(56,173,169,0.12)'
          }}>
            ¡Todos los productos tienen stock suficiente!
          </div>
        )}
      </div>

      {/* Tarjetas de resumen */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <span style={{ fontSize: 18, color: '#888' }}>Total Ventas</span>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#232946' }}>{totalVentas}</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: 18, color: '#888' }}>Total Pedidos</span>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#232946' }}>{totalPedidos}</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: 18, color: '#888' }}>Productos Registrados</span>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#232946' }}>{totalProductos}</span>
        </div>
      </div>

      {/* Gráficos y tabla */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
        <div style={{ flex: 2, minWidth: 320, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(44,62,80,0.07)', padding: '2rem' }}>
          <h2 style={{ color: '#232946', marginBottom: 24 }}>Ventas mensuales</h2>
          {ventasPorMes.length > 0 ? (
            <Bar data={barData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }} />
          ) : (
            <p>No hay ventas registradas.</p>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 280, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(44,62,80,0.07)', padding: '2rem' }}>
          <h2 style={{ color: '#232946', marginBottom: 24, fontSize: 20 }}>Productos con bajo stock</h2>
          {productosBajoStock.length > 0 ? (
            <>
              <Doughnut data={doughnutData} options={{
                plugins: { legend: { position: 'bottom' } }
              }} />
              <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f4f6f8' }}>
                    <th style={{ padding: 8, textAlign: 'left', fontWeight: 600 }}>Producto</th>
                    <th style={{ padding: 8, textAlign: 'center', fontWeight: 600 }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productosBajoStock.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>{p.nombre}</td>
                      <td style={{
                        padding: 8,
                        textAlign: 'center',
                        fontWeight: 700,
                        color:
                          Number(p.stock) <= 3
                            ? '#ff6f61'
                            : Number(p.stock) <= umbralStock
                            ? '#f6c90e'
                            : '#232946'
                      }}>
                        {p.stock}
                        {Number(p.stock) <= 3 && (
                          <span style={{ marginLeft: 8, fontWeight: 600, fontSize: 14 }}>⚠️</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No hay productos con bajo stock.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;