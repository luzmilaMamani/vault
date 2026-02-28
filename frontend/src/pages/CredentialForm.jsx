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

  // Calcular fuerza de contraseña
  const getPasswordStrength = () => {
    if (!form.password) return null;
    let strength = 0;
    if (form.password.length >= 8) strength++;
    if (/[A-Z]/.test(form.password)) strength++;
    if (/[0-9]/.test(form.password)) strength++;
    if (/[^A-Za-z0-9]/.test(form.password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthText = {
    0: { text: "Muy débil", color: "#f28b82" },
    1: { text: "Débil", color: "#f28b82" },
    2: { text: "Media", color: "#f5b87e" },
    3: { text: "Fuerte", color: "#8ccf9d" },
    4: { text: "Muy fuerte", color: "#8ccf9d" },
  };

  if (loading && editMode) {
    return (
      <div className="form-container">
        <div className="form-loading">
          <div className="spinner-large"></div>
          <p>Cargando credencial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <button className="form-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="form-title">
          {editMode ? "✏️ Editar" : "➕ Crear"} credencial
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* Información básica */}
        <div className="form-section">
          <h2 className="section-title">Información básica</h2>

          <div className="form-group">
            <label className="form-label">
              Nombre del servicio
              <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.serviceName}
              onChange={(e) => setField("serviceName", e.target.value)}
              placeholder="Ej: Gmail, Netflix, GitHub..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Usuario / Email
              <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.accountUsername}
              onChange={(e) => setField("accountUsername", e.target.value)}
              placeholder="usuario@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contraseña
              {!editMode && <span className="required">*</span>}
            </label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder={
                  editMode ? "Dejar vacío para no cambiar" : "••••••••"
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar" : "Mostrar"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {form.password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="strength-bar"
                      style={{
                        backgroundColor:
                          level <= passwordStrength
                            ? strengthText[passwordStrength]?.color
                            : "var(--border-color)",
                        width: "25%",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="strength-text"
                  style={{ color: strengthText[passwordStrength]?.color }}
                >
                  {strengthText[passwordStrength]?.text}
                </span>
              </div>
            )}

            {editMode && (
              <span className="field-hint">
                Deja este campo vacío si no quieres cambiar la contraseña
              </span>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="form-section">
          <h2 className="section-title">Información adicional</h2>

          <div className="form-group">
            <label className="form-label">URL del sitio</label>
            <input
              type="url"
              className="form-input"
              value={form.url}
              onChange={(e) => setField("url", e.target.value)}
              placeholder="https://ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea
              className="form-textarea"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Información adicional, instrucciones, etc..."
              rows="4"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
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
        .form-container {
          min-height: calc(100vh - 73px);
          background: var(--bg-primary, #0a0c10);
          padding: 2rem;
        }

        .form-loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary, #9aa3b4);
        }

        .spinner-large {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--border-color, #2a2f38);
          border-radius: 50%;
          border-top-color: var(--accent-primary, #6d8df2);
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-header {
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .form-back {
          background: transparent;
          border: 1px solid var(--border-color, #2a2f38);
          color: var(--text-secondary, #9aa3b4);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          margin-bottom: 1rem;
        }

        .form-back:hover {
          border-color: var(--accent-primary, #6d8df2);
          color: var(--text-primary, #e4e6eb);
        }

        .form-title {
          color: var(--text-primary, #e4e6eb);
          font-size: 2rem;
          margin: 0;
          font-weight: 600;
        }

        .form-card {
          max-width: 800px;
          margin: 0 auto;
          background: var(--bg-card, #1a1e24);
          border: 1px solid var(--border-color, #2a2f38);
          border-radius: 12px;
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color, #2a2f38);
        }

        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-title {
          color: var(--text-primary, #e4e6eb);
          font-size: 1.25rem;
          margin: 0 0 1.5rem 0;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-secondary, #9aa3b4);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .required {
          color: var(--danger, #f28b82);
          margin-left: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-primary, #0a0c10);
          border: 1px solid var(--border-color, #2a2f38);
          border-radius: 8px;
          color: var(--text-primary, #e4e6eb);
          font-size: 1rem;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-primary, #6d8df2);
          box-shadow: 0 0 0 2px rgba(109, 141, 242, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-secondary, #9aa3b4);
          opacity: 0.5;
        }

        .password-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input {
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          color: var(--text-secondary, #9aa3b4);
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: var(--accent-primary, #6d8df2);
        }

        .password-strength {
          margin-top: 0.75rem;
        }

        .strength-bars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .strength-bar {
          height: 4px;
          border-radius: 2px;
          transition: background-color 0.3s;
        }

        .strength-text {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-primary, #0a0c10);
          border: 1px solid var(--border-color, #2a2f38);
          border-radius: 8px;
          color: var(--text-primary, #e4e6eb);
          font-size: 1rem;
          transition: all 0.2s;
          resize: vertical;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-textarea:focus {
          outline: none;
          border-color: var(--accent-primary, #6d8df2);
          box-shadow: 0 0 0 2px rgba(109, 141, 242, 0.1);
        }

        .form-textarea::placeholder {
          color: var(--text-secondary, #9aa3b4);
          opacity: 0.5;
        }

        .field-hint {
          display: block;
          margin-top: 0.5rem;
          color: var(--text-secondary, #9aa3b4);
          font-size: 0.85rem;
          font-style: italic;
        }

        .error-message {
          background: rgba(242, 139, 130, 0.1);
          border: 1px solid var(--danger, #f28b82);
          color: var(--danger, #f28b82);
          padding: 1rem;
          border-radius: 8px;
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color, #2a2f38);
        }

        .btn {
          flex: 1;
          padding: 0.875rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(
            135deg,
            var(--accent-primary, #6d8df2),
            var(--accent-secondary, #a37ef2)
          );
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid var(--border-color, #2a2f38);
          color: var(--text-secondary, #9aa3b4);
        }

        .btn-secondary:hover {
          border-color: var(--accent-primary, #6d8df2);
          color: var(--text-primary, #e4e6eb);
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

        /* Responsive */
        @media (max-width: 768px) {
          .form-container {
            padding: 1rem;
          }

          .form-card {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .form-section {
            padding-bottom: 1.5rem;
          }

          .section-title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
