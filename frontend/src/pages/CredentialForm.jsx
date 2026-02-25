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

  return (
    <div className="container">
      <h2>{editMode ? "Editar" : "Crear"} credencial</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Servicio (serviceName)
          <input
            value={form.serviceName}
            onChange={(e) => setField("serviceName", e.target.value)}
          />
        </label>
        <label>
          Usuario/Email
          <input
            value={form.accountUsername}
            onChange={(e) => setField("accountUsername", e.target.value)}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
          />
        </label>
        <label>
          URL (opcional)
          <input
            value={form.url}
            onChange={(e) => setField("url", e.target.value)}
          />
        </label>
        <label>
          Notas (opcional)
          <textarea
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <div className="form-actions">
          <button className="btn primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
