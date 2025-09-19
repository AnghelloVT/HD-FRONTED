import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/img/logo-tambo2.png';
import { FaShoppingCart, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PedidosAdmin.css';

const estados = ['Pendiente', 'Entregado'];

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    fecha: null,
    estado: '',
    direccion: '',
    telefono: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const tablaRef = useRef(null);
  const logoBase64Ref = useRef('');

  useEffect(() => {
    // Convertir la imagen importada a base64
    const img = new Image();
    img.src = logo;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      logoBase64Ref.current = dataURL;
    };

    // Cargar pedidos guardados
    const guardados = JSON.parse(localStorage.getItem('pedidosTambo')) || [];
    guardados.forEach(p => {
      if (p.fecha) p.fecha = new Date(p.fecha);
    });
    setPedidos(guardados);

    window.html2canvas = html2canvas;
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validar = () => {
    const errores = {};
    if (!form.cliente.trim()) errores.cliente = 'Cliente es requerido';
    if (!form.producto.trim()) errores.producto = 'Producto es requerido';
    if (!form.cantidad.toString().trim()) errores.cantidad = 'Cantidad es requerida';
    else if (!Number.isInteger(Number(form.cantidad)) || Number(form.cantidad) <= 0) errores.cantidad = 'Cantidad inválida';
    if (!form.fecha) errores.fecha = 'Fecha es requerida';
    if (!form.estado) errores.estado = 'Estado es requerido';
    if (!form.direccion.trim()) errores.direccion = 'Dirección es requerida';
    if (!form.telefono.trim()) errores.telefono = 'Teléfono es requerido';
    else if (!/^\d{9}$/.test(form.telefono)) errores.telefono = 'Teléfono debe tener 9 dígitos numéricos';
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
    const formData = { ...form };
    if (editingId !== null) {
      const nuevosPedidos = pedidos.map((p, idx) => (idx === editingId ? formData : p));
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setEditingId(null);
      setMensajeExito('Pedido actualizado correctamente');
    } else {
      const nuevosPedidos = [...pedidos, formData];
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setMensajeExito('Pedido registrado correctamente');
    }
    setForm({
      cliente: '',
      producto: '',
      cantidad: '',
      fecha: null,
      estado: '',
      direccion: '',
      telefono: '',
    });
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(pedidos[idx]);
    setEditingId(idx);
    setErrors({});
    setMensajeExito('');
  };

  const handleDelete = (idx) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este pedido?');
    if (!confirmar) return;
    const nuevosPedidos = pedidos.filter((_, i) => i !== idx);
    setPedidos(nuevosPedidos);
    localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
    setMensajeExito('Pedido eliminado');
    if (editingId === idx) {
      setEditingId(null);
      setForm({
        cliente: '',
        producto: '',
        cantidad: '',
        fecha: null,
        estado: '',
        direccion: '',
        telefono: '',
      });
      setErrors({});
    }
  };

  const exportarPDF = async () => {
    if (!tablaRef.current) {
      console.error('No se encontró la tabla para exportar');
      return;
    }

    const element = document.createElement('div');
    element.style.width = '800px'; 
    element.style.padding = '20px';
    element.style.backgroundColor = 'white';
    element.style.position = 'absolute';
    element.style.left = '-9999px'; 
    document.body.appendChild(element);

    // Agregar logo
    if (logoBase64Ref.current) {
      const imgEl = document.createElement('img');
      imgEl.src = logoBase64Ref.current;
      imgEl.style.width = '150px';
      imgEl.style.display = 'block';
      imgEl.style.margin = '0 auto 20px auto';
      element.appendChild(imgEl);
    }

    // Título
    const titleEl = document.createElement('h2');
    titleEl.innerText = 'Listado de Pedidos';
    titleEl.style.textAlign = 'center';
    titleEl.style.marginBottom = '20px';
    element.appendChild(titleEl);

    // Clonar la tabla
    const tablaClon = tablaRef.current.cloneNode(true);
    tablaClon.style.width = '100%';

    // eliminar botones de acciones en el PDF
    const botones = tablaClon.querySelectorAll('button');
    botones.forEach(b => b.remove());

    element.appendChild(tablaClon);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Margen
      const margin = 20;
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;

      if (imgHeight < pdfHeight - margin * 2) {
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      } else {
        let remainingHeight = imgHeight;
        let pageCanvasHeight = (canvas.width * (pdfHeight - margin * 2)) / imgWidth; 
        let yOffset = 0;

        while (remainingHeight > 0) {
          const sourceY = yOffset;
          const sHeight = Math.min(pageCanvasHeight, canvas.height - yOffset);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sHeight;
          const pageCtx = pageCanvas.getContext('2d');
          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sHeight,
            0,
            0,
            canvas.width,
            sHeight
          );
          const pageImgData = pageCanvas.toDataURL('image/png');
          if (yOffset > 0) {
            pdf.addPage();
          }
          pdf.addImage(
            pageImgData,
            'PNG',
            margin,
            margin,
            imgWidth,
            (sHeight * imgWidth) / canvas.width
          );

          yOffset += sHeight;
          remainingHeight -= sHeight;
        }
      }

      pdf.save('pedidos.pdf');
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Hubo un error al generar el PDF');
    } finally {
      document.body.removeChild(element);
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaShoppingCart size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Pedidos</h1>
        </div>
        <div className="d-flex align-items-center">
          <span>Administrador</span>
        </div>
      </div>
      <div className="admin-container">
        <button className="btn btn-danger mb-3" onClick={exportarPDF}>
          <FaFilePdf /> Descargar PDF
        </button>
        <div className="card">
          <div className="card-body">
            <h5>{editingId !== null ? 'Editar Pedido' : 'Registrar Pedido'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                placeholder="Cliente"
                className={`form-control mb-2 ${errors.cliente ? 'is-invalid' : ''}`}
                required
              />
              {errors.cliente && <div className="invalid-feedback">{errors.cliente}</div>}

              <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                placeholder="Producto"
                className={`form-control mb-2 ${errors.producto ? 'is-invalid' : ''}`}
                required
              />
              {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}

              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
                className={`form-control mb-2 ${errors.cantidad ? 'is-invalid' : ''}`}
                required
              />
              {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}

              <label> Fecha: </label>
              <DatePicker
                selected={form.fecha}
                onChange={(date) => {
                  setForm({ ...form, fecha: date });
                  setErrors({ ...errors, fecha: '' });
                }}
                className={`form-control mb-2 ${errors.fecha ? 'is-invalid' : ''}`}
                placeholderText="Seleccione una fecha"
                dateFormat="yyyy/MM/dd"
                required
              />
              {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha}</div>}

              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className={`form-control mb-2 ${errors.estado ? 'is-invalid' : ''}`}
                required
              >
                <option value="">Seleccione un estado</option>
                {estados.map((est) => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
              {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}

              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                className={`form-control mb-2 ${errors.direccion ? 'is-invalid' : ''}`}
                required
              />
              {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}

              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className={`form-control mb-2 ${errors.telefono ? 'is-invalid' : ''}`}
                maxLength="9"
                required
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}

              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-3">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Pedidos</h5>
            {pedidos.length === 0 ? (
              <p>No hay pedidos registrados.</p>
            ) : (
              <table ref={tablaRef} className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, idx) => (
                    <tr key={idx}>
                      <td>{pedido.cliente}</td>
                      <td>{pedido.producto}</td>
                      <td>{pedido.cantidad}</td>
                      <td>{pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : ''}</td>
                      <td>{pedido.estado}</td>
                      <td>{pedido.direccion}</td>
                      <td>{pedido.telefono}</td>
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

export default PedidosAdmin;