import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!username || !password) return setError("Completa todos los campos");
    if (
      username.includes("@") &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(username)
    ) {
      return setError("Email con formato inválido");
    }
    setLoading(true);
    try {
      const data = await login({ username, password });
      localStorage.setItem("mv_token", data.token);
      navigate("/credentials");
    } catch (err) {
      setError(err.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1 className="auth-title">Iniciar sesión</h1>
          <p className="auth-subtitle">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Usuario o Email</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <div className="auth-footer">
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
