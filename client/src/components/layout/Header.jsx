import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { items, setIsCartOpen } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function openCart() {
    setIsMobileMenuOpen(false);
    setIsCartOpen(true);
  }

  function handleLogout() {
    setIsMobileMenuOpen(false);
    logout();
  }

  return (
    <header className="site-header">
      <div className="container nav-row">
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>

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
          <button className="cart-button" type="button" onClick={openCart}>
            {t.cartButton} ({items.length})
          </button>
          {isAuthenticated ? (
            <div className="user-box">
              <Link className="user-box__link" to="/profile">
                {user?.name}
              </Link>
              <button type="button" onClick={handleLogout}>
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

      <div
        className={`mobile-nav-overlay ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside className={`mobile-nav-drawer ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-nav-drawer__header">
          <span className="brand-mark">Archivarius</span>
          <button type="button" className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)}>
            ×
          </button>
        </div>

        <nav className="mobile-nav-links">
          <NavLink to="/">{t.navHome}</NavLink>
          <NavLink to="/catalog">{t.navCatalog}</NavLink>
          <NavLink to="/contacts">{t.navContacts}</NavLink>
          {isAdmin && <NavLink to="/admin">{t.navAdmin}</NavLink>}
        </nav>

        <div className="mobile-nav-controls">
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
          <button className="cart-button" type="button" onClick={openCart}>
            {t.cartButton} ({items.length})
          </button>
        </div>

        {isAuthenticated ? (
          <div className="mobile-nav-account">
            <Link className="user-box__link" to="/profile">
              {user?.name}
            </Link>
            <button type="button" onClick={handleLogout}>
              {t.navLogout}
            </button>
          </div>
        ) : (
          <div className="mobile-nav-account">
            <NavLink to="/login">{t.navLogin}</NavLink>
            <NavLink to="/register">{t.navRegister}</NavLink>
          </div>
        )}
      </aside>
    </header>
  );
}
