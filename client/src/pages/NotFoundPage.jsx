import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container page-state">
        <h1>{t.notFoundTitle}</h1>
        <p>{t.notFoundText}</p>
        <Link className="primary-button" to="/">
          {t.backToHome}
        </Link>
      </div>
    </section>
  );
}
