import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { translateErrorMessage } from "../utils/translateErrorMessage";

export default function LoginPage() {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/profile");
    } catch (submitError) {
      setError(translateErrorMessage(submitError.message, language));
    }
  }

  return (
    <section className="section">
      <div className="container auth-wrapper">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>{t.loginTitle}</h1>
          <input
            className="field"
            placeholder={t.email}
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className="field"
            placeholder={t.password}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button className="primary-button" type="submit">
            {t.submitLogin}
          </button>
          {error && <p className="form-message">{error}</p>}
        </form>
      </div>
    </section>
  );
}
