import React from 'react';
import { FaHome, FaUsers, FaBoxOpen, FaShoppingCart, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/img/logo-tambo2.png';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ setVista, vista }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('registroUsuario');
    navigate('/');
  };
  return (
    <nav className="sidebar">
      <a href="/" className="sidebar-logo-link">
        <img src={logo} alt="Logo" className="sidebar-logo-img" />
      </a>

      <hr />

      <ul className="nav flex-column mb-auto">
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'dashboard' ? 'active' : ''}`}
            onClick={() => setVista('dashboard')}
          >
            <FaHome className="me-2" />Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'usuarios' ? 'active' : ''}`}
            onClick={() => setVista('usuarios')}
          >
            <FaUsers className="me-2" />Usuarios
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'productos' ? 'active' : ''}`}
            onClick={() => setVista('productos')}
          >
            <FaBoxOpen className="me-2" />Productos
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'pedidos' ? 'active' : ''}`}
            onClick={() => setVista('pedidos')}
          >
            <FaShoppingCart className="me-2" />Pedidos
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'reclamos' ? 'active' : ''}`}
            onClick={() => setVista('reclamos')}
          >
            <FaExclamationTriangle className="me-2" />Reclamos
          </a>
        </li>
      </ul>

      <hr />

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;