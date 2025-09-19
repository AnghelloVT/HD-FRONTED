import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo-tambo2.png";
import "./Registro.css";

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.firstName) nuevosErrores.firstName = "Nombre es requerido";
    if (!form.lastName) nuevosErrores.lastName = "Apellido es requerido";
    if (!form.email) nuevosErrores.email = "Email es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) nuevosErrores.email = "Email inválido";
    if (!form.password) nuevosErrores.password = "Contraseña requerida";
    else if (form.password.length < 6) nuevosErrores.password = "Debe tener mínimo 6 caracteres";
    if (!form.phoneNumber) {
      nuevosErrores.phoneNumber = "Teléfono es requerido";
    } else if (/\D/.test(form.phoneNumber)) { 
      nuevosErrores.phoneNumber = "Teléfono inválido";
    } else if (form.phoneNumber.length !== 9) {
      nuevosErrores.phoneNumber = "Teléfono inválido, debe tener 9 dígitos";
    }
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacion = validar();
    if (Object.keys(validacion).length > 0) {
      setErrors(validacion);
      setMensajeExito("");
    } else {
      setErrors({});
      localStorage.setItem("registroUsuario", JSON.stringify(form));
      setMensajeExito("Registro exitoso!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
      navigate("/login");
    }
  };

  const handleRedirectLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="left"></div>
      <div className="right">
        <img src={Logo} alt="Logo empresa" className="form-logo" />
        <h2 className="form-title">Registro</h2>
        <form onSubmit={handleSubmit} noValidate className="brand-form">
          <input
            name="firstName"
            type="text"
            placeholder="Nombre"
            className="brand-input"
            value={form.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <small className="error-message">{errors.firstName}</small>}

          <input
            name="lastName"
            type="text"
            placeholder="Apellido"
            className="brand-input"
            value={form.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <small className="error-message">{errors.lastName}</small>}

          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            className="brand-input"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <small className="error-message">{errors.email}</small>}

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="brand-input"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <small className="error-message">{errors.password}</small>}

          <input
            name="phoneNumber"
            type="text"
            placeholder="Teléfono"
            className="brand-input"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <small className="error-message">{errors.phoneNumber}</small>}

          <button type="submit" className="brand-submit-btn">Registrarse</button>
          <button type="button" className="brand-login-btn" onClick={handleRedirectLogin}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;