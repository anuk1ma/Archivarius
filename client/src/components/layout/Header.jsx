import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { items, setIsCartOpen } = useCart();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link to="/" className="brand-mark">
          {t.brand}
        </Link>
        <nav className="main-nav">
          <NavLink to="/">{t.navHome}</NavLink>
          <NavLink to="/catalog">{t.navCatalog}</NavLink>
          <NavLink to="/contacts">{t.navContacts}</NavLink>
          {isAdmin && <NavLink to="/admin">{t.navAdmin}</NavLink>}
        </nav>
        <div className="nav-actions">
          <div className="lang-switcher">
            <button
              type="button"
              className={language === "ru" ? "is-active" : ""}
              onClick={() => setLanguage("ru")}
            >
              RU
            </button>
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
          <button className="cart-button" type="button" onClick={() => setIsCartOpen(true)}>
            Cart ({items.length})
          </button>
          {isAuthenticated ? (
            <div className="user-box">
              <Link className="user-box__link" to="/profile">
                {user?.name}
              </Link>
              <button type="button" onClick={logout}>
                {t.navLogout}
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login">{t.navLogin}</NavLink>
              <NavLink to="/register">{t.navRegister}</NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
