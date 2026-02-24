import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem("mv_token");

  function logout() {
    localStorage.removeItem("mv_token");
    navigate("/login");
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/">Mini Vault</Link>
        <nav>
          {token ? (
            <>
              <Link to="/credentials">Credenciales</Link>
              <button className="btn" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Registro</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
