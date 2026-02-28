// src/pages/CredentialDetail.jsx (opcional, para mantener el estilo)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCredential, revealCredential } from "../api";

export default function CredentialDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCredential(id)
      .then((data) => setItem(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container loading">Cargando...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!item) return <div className="container loading">No encontrado</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <button className="btn" onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>

      <div
        className="auth-card"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="auth-header">
          <div className="auth-icon">🔑</div>
          <h1 className="auth-title">{item.serviceName}</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <div
              className="form-input"
              style={{ background: "var(--bg-card)" }}
            >
              {item.accountUsername}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="password-field">
              <div
                className="form-input password-input"
                style={{ background: "var(--bg-card)" }}
              >
                {showPassword ? revealedPassword || "-" : "••••••••"}
              </div>
              <button
                className="password-toggle"
                onClick={async () => {
                  if (showPassword) {
                    setShowPassword(false);
                    setRevealedPassword(null);
                    return;
                  }
                  setRevealing(true);
                  try {
                    const data = await revealCredential(id);
                    setRevealedPassword(data.password);
                    setShowPassword(true);
                  } catch (e) {
                    setError(e.message);
                  } finally {
                    setRevealing(false);
                  }
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL</label>
            <div
              className="form-input"
              style={{ background: "var(--bg-card)" }}
            >
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="url-link"
                >
                  {item.url}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas</label>
            <div
              className="form-input"
              style={{ background: "var(--bg-card)", minHeight: "80px" }}
            >
              {item.notes || "-"}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Última actualización</label>
            <div
              className="form-input"
              style={{ background: "var(--bg-card)" }}
            >
              {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/credentials/${id}/edit`)}
              style={{ flex: 1 }}
            >
              Editar
            </button>
            <button
              className="btn"
              onClick={() => navigate(-1)}
              style={{ flex: 1 }}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
