import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCredential } from "../api";

export default function CredentialDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCredential(id)
      .then((data) => setItem(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Cargando...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!item) return <div className="container muted">No encontrado</div>;

  return (
    <div className="container">
      <h2>{item.serviceName}</h2>
      <div className="card detail">
        <div>
          <strong>Usuario:</strong> {item.accountUsername}
        </div>
        <div>
          <strong>Contraseña:</strong>
          <span className="pw">
            {showPassword ? item.password : "••••••••"}
          </span>
          <button
            className="btn small"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <div>
          <strong>URL:</strong> {item.url || "-"}
        </div>
        <div>
          <strong>Notas:</strong> {item.notes || "-"}
        </div>
        <div>
          <strong>Última actualización:</strong>{" "}
          {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
        </div>
        <div className="form-actions">
          <button className="btn" onClick={() => navigate(-1)}>
            Volver
          </button>
          <button
            className="btn"
            onClick={() => navigate(`/credentials/${id}/edit`)}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
