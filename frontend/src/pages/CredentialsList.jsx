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
    if (!confirm("Eliminar esta credencial?")) return;
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
      <h2>Credenciales</h2>
      <div className="toolbar">
        <form onSubmit={handleSearch}>
          <input
            placeholder="Buscar por servicio"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn">Buscar</button>
        </form>
        <div>
          <button className="btn" onClick={() => navigate("/credentials/new")}>
            Crear
          </button>
        </div>
      </div>

      {loading && <div className="muted">Cargando...</div>}
      {error && <div className="error">{error}</div>}

      <table className="list">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Usuario</th>
            <th>URL</th>
            <th>Última actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && !loading && (
            <tr>
              <td colSpan="5" className="muted">
                No hay resultados
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.serviceName}</td>
              <td>{item.accountUsername}</td>
              <td>{item.url || "-"}</td>
              <td>
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString()
                  : "-"}
              </td>
              <td className="actions">
                <Link to={`/credentials/${item.id}`} className="btn small">
                  Ver
                </Link>
                <Link to={`/credentials/${item.id}/edit`} className="btn small">
                  Editar
                </Link>
                <button
                  className="btn small danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
