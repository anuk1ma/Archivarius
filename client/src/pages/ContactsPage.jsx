import { useLanguage } from "../contexts/LanguageContext";

export default function ContactsPage() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container contacts-card">
        <p className="eyebrow">{t.brand}</p>
        <h1>{t.contactsTitle}</h1>
        <p>{t.contactName}</p>
        <p>maratmansur58@gmail.com</p>
        <p>+77776835191</p>
        <p>{t.contactCity}</p>
      </div>
    </section>
  );
}
