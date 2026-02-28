import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCredential, updateCredential, getCredential } from "../api";

export default function CredentialForm({ editMode }) {
  const { id } = useParams();
  const [form, setForm] = useState({
    serviceName: "",
    accountUsername: "",
    password: "",
    url: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      getCredential(id)
        .then((data) => setForm(data))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [editMode, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (
      !form.serviceName ||
      !form.accountUsername ||
      (!editMode && !form.password)
    )
      return setError("serviceName, accountUsername y password son requeridos");
    setLoading(true);
    try {
      if (editMode && id) await updateCredential(id, form);
      else await createCredential(form);
      navigate("/credentials");
    } catch (err) {
      setError(err.message || "Error guardando");
    } finally {
      setLoading(false);
    }
  }

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  if (loading && editMode) {
    return (
      <div className="container">
        <div className="loading-spinner">Cargando credencial...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-header">
        <button className="btn back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h2 className="form-title">
          {editMode ? "✏️ Editar" : "➕ Crear"} credencial
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        <div className="form-section">
          <h3 className="section-title">Información básica</h3>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Nombre del servicio</span>
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                className="form-input"
                value={form.serviceName}
                onChange={(e) => setField("serviceName", e.target.value)}
                placeholder="Ej: Gmail, Netflix, GitHub..."
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Usuario / Email</span>
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                className="form-input"
                value={form.accountUsername}
                onChange={(e) => setField("accountUsername", e.target.value)}
                placeholder="usuario@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Contraseña</span>
              {!editMode && <span className="required">*</span>}
            </label>
            <div className="password-input-wrapper">
              <input
                className="form-input password-input"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder={
                  editMode ? "Dejar vacío para no cambiar" : "••••••••"
                }
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {editMode && (
              <span className="field-hint">
                Deja este campo vacío si no quieres cambiar la contraseña
              </span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Información adicional</h3>

          <div className="form-group">
            <label className="form-label">URL del sitio</label>
            <div className="input-wrapper">
              <input
                className="form-input"
                value={form.url}
                onChange={(e) => setField("url", e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas</label>
            <div className="input-wrapper">
              <textarea
                className="form-textarea"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Información adicional, instrucciones, etc..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              <>{editMode ? "💾 Actualizar" : "💾 Crear"} credencial</>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .back-button {
          background: none;
          border: 1px solid #ddd;
          color: #666;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          transition: all 0.2s;
          cursor: pointer;
          border-radius: 4px;
        }

        .back-button:hover {
          background: #f5f5f5;
          border-color: #999;
        }

        .form-title {
          margin: 0;
          color: #333;
          font-size: 2rem;
          font-weight: 600;
        }

        .form-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-title {
          color: #2c3e50;
          font-size: 1.25rem;
          margin: 0 0 1.5rem 0;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a5568;
        }

        .label-text {
          color: #2d3748;
        }

        .required {
          color: #e53e3e;
          margin-left: 0.25rem;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          background: white;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .form-input::placeholder {
          color: #a0aec0;
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input {
          padding-right: 3rem;
        }

        .password-toggle-btn {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          color: #718096;
          transition: color 0.2s;
        }

        .password-toggle-btn:hover {
          color: #2d3748;
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #f8fafc;
          resize: vertical;
          font-family: inherit;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #4299e1;
          background: white;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .field-hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #718096;
          font-style: italic;
        }

        .error-message {
          background: #fff5f5;
          border: 2px solid #feb2b2;
          color: #c53030;
          padding: 1rem;
          border-radius: 8px;
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: #4299e1;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #3182ce;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn-secondary:hover {
          background: #cbd5e0;
        }

        .loading-spinner {
          text-align: center;
          padding: 3rem;
          color: #718096;
          font-size: 1.2rem;
        }

        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 600px) {
          .form-card {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
