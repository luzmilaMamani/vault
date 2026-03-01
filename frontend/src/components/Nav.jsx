import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("mv_token");

  function logout() {
    localStorage.removeItem("mv_token");
    navigate("/login");
  }

  return (
    <header className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span>Mini Vault</span>
        </Link>

        <nav className="nav-links">
          {token ? (
            <>
              <Link
                to="/credentials"
                className={`nav-link ${location.pathname === "/credentials" ? "active" : ""}`}
              >
                Credenciales
              </Link>
              <button className="nav-link" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
              >
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
