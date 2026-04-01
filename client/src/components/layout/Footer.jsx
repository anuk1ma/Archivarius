import { useLanguage } from "../../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-mark footer-brand">{t.brand}</div>
          <p>{t.footerText}</p>
        </div>
        <div>
          <h4>{t.contactsTitle}</h4>
          <p>{t.contactName}</p>
          <p>maratmansur58@gmail.com</p>
          <p>+77776835191</p>
          <p>{t.contactCity}</p>
        </div>
      </div>
    </footer>
  );
}
