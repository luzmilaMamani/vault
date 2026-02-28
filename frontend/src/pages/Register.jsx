import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!email || !password || !confirmPassword) {
      return setError("Completa todos los campos");
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return setError("Email con formato inválido");
    }

    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    setLoading(true);
    try {
      await register({ email, password });
      // Redirigir al login con mensaje de éxito
      navigate("/login", {
        state: { message: "Registro exitoso. Ahora puedes iniciar sesión." },
      });
    } catch (err) {
      setError(err.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  }

  // Calcular fuerza de la contraseña
  const getPasswordStrength = () => {
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const passwordStrength = getPasswordStrength();

  const strengthText = {
    0: { text: "Muy débil", color: "#fc8181" },
    1: { text: "Débil", color: "#fc8181" },
    2: { text: "Media", color: "#fbbf24" },
    3: { text: "Fuerte", color: "#48bb78" },
    4: { text: "Muy fuerte", color: "#48bb78" },
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">✨</div>
          <h1 className="register-title">Crear cuenta</h1>
          <p className="register-subtitle">
            Comienza a gestionar tus contraseñas de forma segura
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📧</span>
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {password && (
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
                            : "#e2e8f0",
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
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">✓</span>
              Confirmar contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-input password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {password && confirmPassword && (
              <div className="password-match">
                {password === confirmPassword ? (
                  <span className="match-success">
                    ✓ Las contraseñas coinciden
                  </span>
                ) : (
                  <span className="match-error">
                    ✗ Las contraseñas no coinciden
                  </span>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </button>

          <div className="register-footer">
            <p className="login-link">
              ¿Ya tienes una cuenta?
              <Link to="/login" className="login-link-text">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="terms">
            <p className="terms-text">
              Al registrarte, aceptas nuestros
              <a href="#" className="terms-link">
                {" "}
                Términos de servicio
              </a>{" "}
              y
              <a href="#" className="terms-link">
                {" "}
                Política de privacidad
              </a>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #48bb78 0%, #2c7a4d 100%);
          padding: 1rem;
        }

        .register-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 440px;
          padding: 2.5rem;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .register-title {
          font-size: 2rem;
          color: #2d3748;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .register-subtitle {
          color: #718096;
          margin: 0;
          font-size: 0.95rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a5568;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .label-icon {
          font-size: 1.1rem;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s;
          background: #f8fafc;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #48bb78;
          background: white;
          box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
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

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          color: #718096;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #2d3748;
        }

        .password-strength {
          margin-top: 0.5rem;
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
          font-size: 0.8rem;
          font-weight: 500;
        }

        .password-match {
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .match-success {
          color: #48bb78;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .match-error {
          color: #fc8181;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .error-message {
          background: #fff5f5;
          border: 2px solid #fc8181;
          color: #c53030;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .register-button {
          background: linear-gradient(135deg, #48bb78 0%, #2c7a4d 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(72, 187, 120, 0.4);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-button::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition:
            width 0.6s,
            height 0.6s;
        }

        .register-button:hover::before {
          width: 300px;
          height: 300px;
        }

        .button-spinner {
          display: inline-block;
          width: 1.2rem;
          height: 1.2rem;
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

        .register-footer {
          margin-top: 0.5rem;
          text-align: center;
        }

        .login-link {
          color: #4a5568;
          font-size: 0.95rem;
        }

        .login-link-text {
          color: #48bb78;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.2s;
        }

        .login-link-text:hover {
          color: #2c7a4d;
          text-decoration: underline;
        }

        .terms {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .terms-text {
          color: #718096;
          font-size: 0.8rem;
          text-align: center;
          margin: 0;
        }

        .terms-link {
          color: #48bb78;
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .register-card {
            padding: 1.5rem;
          }

          .register-title {
            font-size: 1.75rem;
          }

          .logo {
            font-size: 3rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .register-card {
            background: #1a202c;
          }

          .register-title {
            color: #f7fafc;
          }

          .register-subtitle {
            color: #a0aec0;
          }

          .form-label {
            color: #cbd5e0;
          }

          .form-input {
            background: #2d3748;
            border-color: #4a5568;
            color: #f7fafc;
          }

          .form-input:focus {
            background: #2d3748;
          }

          .form-input::placeholder {
            color: #718096;
          }

          .login-link {
            color: #cbd5e0;
          }

          .terms-text {
            color: #a0aec0;
          }

          .terms {
            border-top-color: #4a5568;
          }
        }
      `}</style>
    </div>
  );
}
