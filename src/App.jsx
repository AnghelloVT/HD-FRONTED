import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Sidebar';
import UsuarioAdmin from './Components/UsuarioAdmin';
import ProductosAdmin from './Components/ProductosAdmin';
import PedidosAdmin from './Components/PedidosAdmin';
import ReclamosAdmin from './Components/ReclamosAdmin';
import Inicio from './Components/Inicio';
import Login from './Components/Login';
import Registro from './Components/Registro';
import Dashboard from './Components/Dashboard';


const PanelAdmin = () => {
  const [vista, setVista] = useState('inicio');

  const renderVista = () => {
    switch (vista) {
      case 'dashboard':
        return <Dashboard />;
      case 'usuarios':
        return <UsuarioAdmin />;
      case 'productos':
        return <ProductosAdmin />;
      case 'pedidos':
        return <PedidosAdmin />;
      case 'reclamos':
        return <ReclamosAdmin />;
      case 'inicio':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container d-flex">
      <Sidebar setVista={setVista} vista={vista} />
      <main className="content-container" style={{ flex: 1 }}>
        {renderVista()}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/panel" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;




