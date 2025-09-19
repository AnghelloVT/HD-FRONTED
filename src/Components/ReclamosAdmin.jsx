import React, { useState, useEffect } from 'react';
import './ReclamosAdmin.css';

const estados = ['Pendiente', 'Resuelto'];

const ReclamosAdmin = () => {
  const [reclamos, setReclamos] = useState(() => {
    return JSON.parse(localStorage.getItem('reclamosTambo')) || [];
  });
  const [form, setForm] = useState({ cliente: '', detalle: '', estado: 'Pendiente' });
  const [editingId, setEditingId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    localStorage.setItem('reclamosTambo', JSON.stringify(reclamos));
  }, [reclamos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cliente.trim() || !form.detalle.trim()) {
      setMensaje('Completa todos los campos.');
      return;
    }
    if (editingId !== null) {
      setReclamos(reclamos.map((r, idx) => (idx === editingId ? form : r)));
      setMensaje('Reclamo actualizado correctamente.');
      setEditingId(null);
    } else {
      setReclamos([{ ...form }, ...reclamos]);
      setMensaje('Reclamo registrado correctamente.');
    }
    setForm({ cliente: '', detalle: '', estado: 'Pendiente' });
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (idx) => {
    setForm(reclamos[idx]);
    setEditingId(idx);
  };

  const handleDelete = (idx) => {
    if (window.confirm('¿Seguro que deseas eliminar este reclamo?')) {
      setReclamos(reclamos.filter((_, i) => i !== idx));
    }
  };

  const handleEstado = (idx) => {
    const nuevoEstado = reclamos[idx].estado === 'Pendiente' ? 'Resuelto' : 'Pendiente';
    setReclamos(
      reclamos.map((r, i) => (i === idx ? { ...r, estado: nuevoEstado } : r))
    );
  };

  const reclamosFiltrados = reclamos.filter(
    r =>
      r.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Tarjetas resumen
  const total = reclamos.length;
  const pendientes = reclamos.filter(r => r.estado === 'Pendiente').length;
  const resueltos = reclamos.filter(r => r.estado === 'Resuelto').length;

  return (
    <div className="reclamos-admin-container">
      <h2 className="reclamos-admin-title">Gestión de Reclamos</h2>

      {/* Tarjetas resumen */}
      <div className="reclamos-admin-cards">
        <div className="reclamos-admin-card reclamos-admin-card-total">
          <span>Total Reclamos</span>
          <span>{total}</span>
        </div>
        <div className="reclamos-admin-card reclamos-admin-card-pendientes">
          <span>Pendientes</span>
          <span>{pendientes}</span>
        </div>
        <div className="reclamos-admin-card reclamos-admin-card-resueltos">
          <span>Resueltos</span>
          <span>{resueltos}</span>
        </div>
      </div>

      {/* Formulario */}
      <form className="reclamos-admin-form" onSubmit={handleSubmit}>
        <input
          name="cliente"
          placeholder="Cliente"
          value={form.cliente}
          onChange={handleChange}
          required
        />
        <input
          name="detalle"
          placeholder="Detalle del reclamo"
          value={form.detalle}
          onChange={handleChange}
          required
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
        >
          {estados.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <button type="submit">
          {editingId !== null ? 'Actualizar' : 'Registrar'}
        </button>
        {mensaje && (
          <span className="reclamos-admin-mensaje">{mensaje}</span>
        )}
      </form>

      {/* Filtro de búsqueda */}
      <div className="reclamos-admin-busqueda">
        <input
          type="text"
          placeholder="Buscar por cliente o estado..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <span>
          Mostrando <b>{reclamosFiltrados.length}</b> reclamos
        </span>
      </div>

      {/* Tabla */}
      <div className="reclamos-admin-table-container">
        <table className="reclamos-admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Detalle</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reclamosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="reclamos-admin-table-empty">
                  No hay reclamos registrados.
                </td>
              </tr>
            ) : (
              reclamosFiltrados.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.cliente}</td>
                  <td>{r.detalle}</td>
                  <td>
                    <span className={`reclamos-admin-estado ${r.estado === 'Pendiente' ? 'pendiente' : 'resuelto'}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-estado"
                      onClick={() => handleEstado(idx)}
                    >
                      {r.estado === 'Pendiente' ? 'Marcar Resuelto' : 'Marcar Pendiente'}
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(idx)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDelete(idx)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReclamosAdmin;