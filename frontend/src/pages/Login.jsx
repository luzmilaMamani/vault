import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    <div className="container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Email/Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button disabled={loading} className="btn primary">
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
