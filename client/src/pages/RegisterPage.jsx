import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { translateErrorMessage } from "../utils/translateErrorMessage";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", avatarUrl: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/profile");
    } catch (submitError) {
      setError(translateErrorMessage(submitError.message, language));
    }
  }

  return (
    <section className="section">
      <div className="container auth-wrapper">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>{t.registerTitle}</h1>
          <input
            className="field"
            placeholder={t.name}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
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
          <input
            className="field"
            placeholder={t.avatarUrl}
            value={form.avatarUrl}
            onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
          />
          <button className="primary-button" type="submit">
            {t.submitRegister}
          </button>
          {error && <p className="form-message">{error}</p>}
        </form>
      </div>
    </section>
  );
}
