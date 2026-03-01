import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCredentials, deleteCredential } from "../api";

export default function CredentialsList() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function load(q) {
    setLoading(true);
    setError(null);
    try {
      const data = await getCredentials(q);
      setItems(data);
    } catch (err) {
      setError(err.message || "Error cargando credenciales");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta credencial?")) return;
    try {
      await deleteCredential(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message || "No se pudo eliminar");
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    load(query);
  }

  return (
    <div className="container">
      <div className="list-header">
        <h1 className="page-title">Credenciales</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/credentials/new")}
        >
          + Nueva credencial
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-box">
        <div className="search-wrapper"></div>
      </form>

      {loading && <div className="loading">Cargando credenciales...</div>}

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="credentials-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Usuario</th>
                <th>URL</th>
                <th>Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-table">
                    No hay credenciales
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="service-cell">
                      <span className="service-icon">🔑</span>
                      {item.serviceName}
                    </td>
                    <td>
                      <span className="username-icon">👤</span>
                      {item.accountUsername}
                    </td>
                    <td>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="url-link"
                        >
                          {item.url.length > 30
                            ? item.url.substring(0, 30) + "..."
                            : item.url}
                        </a>
                      ) : (
                        <span className="no-url">—</span>
                      )}
                    </td>
                    <td className="date-cell">
                      <span className="date-icon">📅</span>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div className="action-group">
                        <Link
                          to={`/credentials/${item.id}`}
                          className="action-btn"
                          title="Ver detalles"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/credentials/${item.id}/edit`}
                          className="action-btn"
                          title="Editar"
                        >
                          ✏️
                        </Link>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(item.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="table-footer">
          <span>Total: {items.length} credenciales</span>
        </div>
      )}
    </div>
  );
}
