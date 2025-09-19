import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductosAdmin.css';

const categorias = ['Bebidas', 'Comidas', 'Snacks', 'Licores'];

const formatPrecio = (precio) => {
  if (typeof precio === 'string' && precio.startsWith('S/.')) return precio;
  return `S/.${precio}`;
};

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '', imagen: '', categoria: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productosTambo')) || [];
    setProductos(guardados);
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'precio') {
      value = value.replace(/^S\.\//, '').replace(/^S\./, '').replace(/^S/, '');
      // Se permite solo números y puntos para decimales
      if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
        setForm({ ...form, [e.target.name]: value });
        setErrors({ ...errors, [e.target.name]: '' });
      }
    } else {
      setForm({ ...form, [e.target.name]: value });
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, imagen: reader.result }));
      setErrors(prev => ({ ...prev, imagen: '' }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const validar = () => {
    const errores = {};
    if (!form.nombre.trim()) errores.nombre = 'Nombre es requerido';
    if (!form.precio.trim()) errores.precio = 'Precio es requerido';
    else if (isNaN(Number(form.precio)) || Number(form.precio) <= 0) errores.precio = 'Precio inválido';
    if (!form.stock.trim()) errores.stock = 'Stock es requerido';
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) errores.stock = 'Stock inválido';
    if (!form.categoria) errores.categoria = 'Categoría es requerida';
    if (!form.imagen) errores.imagen = 'Imagen es requerida';
    return errores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errores = validar();
    if (Object.keys(errores).length > 0) {
      setErrors(errores);
      setMensajeExito('');
      return;
    }
    const formData = { ...form, precio: form.precio.trim() };
    if (editingId !== null) {
      const nuevosProductos = productos.map((p, idx) =>
        idx === editingId ? formData : p
      );
      setProductos(nuevosProductos);
      localStorage.setItem('productosTambo', JSON.stringify(nuevosProductos));
      setEditingId(null);
      setMensajeExito('Producto actualizado correctamente');
    } else {
      const nuevosProductos = [...productos, formData];
      setProductos(nuevosProductos);
      localStorage.setItem('productosTambo', JSON.stringify(nuevosProductos));
      setMensajeExito('Producto registrado correctamente');
    }
    setForm({ nombre: '', precio: '', stock: '', imagen: '', categoria: '' });
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(productos[idx]);
    setEditingId(idx);
    setErrors({});
    setMensajeExito('');
  };

  const handleDelete = (idx) => {
  const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
  if (!confirmar) return;
  
  const nuevosProductos = productos.filter((_, i) => i !== idx);
  setProductos(nuevosProductos);
  localStorage.setItem('productosTambo', JSON.stringify(nuevosProductos));
  setMensajeExito('Producto eliminado');
  
  if (editingId === idx) {
    setEditingId(null);
    setForm({ nombre: '', precio: '', stock: '', imagen: '', categoria: '' });
    setErrors({});
  }
};

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaBoxOpen size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Productos</h1>
        </div>
        <div className="d-flex align-items-center">
          <span>Administrador</span>
        </div>
      </div>

      <div className="admin-container">
        <div className="card">
          <div className="card-body">
            <h5>{editingId !== null ? 'Editar Producto' : 'Registrar Producto'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={`form-control mb-2 ${errors.nombre ? 'is-invalid' : ''}`}
                required
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}

              <div className="input-group mb-2">
                <span className="input-group-text">S/.</span>
                <input
                  type="text"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="Precio"
                  className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                  required
                />
              </div>
              {errors.precio && <div className="invalid-feedback d-block">{errors.precio}</div>}

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className={`form-control mb-2 ${errors.stock ? 'is-invalid' : ''}`}
                required
              />
              {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}

              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className={`form-control mb-2 ${errors.categoria ? 'is-invalid' : ''}`}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`form-control mb-2 ${errors.imagen ? 'is-invalid' : ''}`}
                required
              />
              {errors.imagen && <div className="invalid-feedback d-block">{errors.imagen}</div>}

              {form.imagen && (
                <img
                  src={form.imagen}
                  alt="Previsualización"
                  style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: '10px' }}
                />
              )}

              <button type="submit" className="btn btn-primary me-2" disabled={
                !form.nombre || !form.precio || !form.stock || !form.categoria || !form.imagen
              }>
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-3">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Productos</h5>
            {productos.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto, idx) => (
                    <tr key={idx}>
                      <td>
                        {producto.imagen ? (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                          />
                        ) : (
                          'Sin imagen'
                        )}
                      </td>
                      <td>{producto.nombre}</td>
                      <td>{formatPrecio(producto.precio)}</td>
                      <td>{producto.stock}</td>
                      <td>{producto.categoria}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(idx)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(idx)}>
                          <FaTrash /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductosAdmin;