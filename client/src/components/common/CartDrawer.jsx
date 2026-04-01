import { useMemo, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import BookCover from "./BookCover";
import { localizeBook } from "../../utils/localizeBook";
import { translateErrorMessage } from "../../utils/translateErrorMessage";

const initialCheckoutForm = {
  city: "",
  address: "",
  paymentMethod: "cash_on_delivery",
  cardNumber: "",
  cardHolder: "",
  cardExpiry: "",
  cardCvv: ""
};

function getValidationText(language) {
  if (language === "en") {
    return {
      invalid: "Please correct the highlighted fields before placing the order.",
      city:
        "City must contain only letters, spaces, or hyphens. Example: Astana",
      address: "Address must be at least 8 characters long.",
      cardNumber: "Card number must match the format 1234 5678 9012 3456.",
      cardHolder: "Cardholder name must contain only letters and spaces.",
      cardExpiry: "Expiry date must match the format MM/YY and be valid.",
      cardCvv: "CVV must contain 3 or 4 digits."
    };
  }

  return {
    invalid: "Исправьте выделенные поля перед оформлением заказа.",
    city: "Город должен содержать только буквы, пробелы или дефис. Пример: Астана",
    address: "Адрес должен содержать минимум 8 символов.",
    cardNumber: "Номер карты должен быть в формате 1234 5678 9012 3456.",
    cardHolder: "Имя владельца должно содержать только буквы и пробелы.",
    cardExpiry: "Срок действия должен быть в формате MM/YY и быть актуальным.",
    cardCvv: "CVV должен содержать 3 или 4 цифры."
  };
}

function normalizeCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16);
}

function formatCardNumber(value) {
  const normalized = normalizeCardNumber(value);
  return normalized.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value) {
  const normalized = value.replace(/\D/g, "").slice(0, 4);
  if (normalized.length <= 2) return normalized;
  return `${normalized.slice(0, 2)}/${normalized.slice(2)}`;
}

function isValidExpiry(value) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return false;
  const [monthText, yearText] = value.split("/");
  const month = Number(monthText);
  const year = Number(`20${yearText}`);
  const now = new Date();
  const expiry = new Date(year, month);
  return expiry > now;
}

export default function CartDrawer() {
  const { items, total, isCartOpen, setIsCartOpen, removeItem, checkout } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(initialCheckoutForm);

  const showCardFields = useMemo(() => form.paymentMethod === "card", [form.paymentMethod]);

  function updateField(key, value) {
    let nextValue = value;

    if (key === "cardNumber") nextValue = formatCardNumber(value);
    if (key === "cardExpiry") nextValue = formatExpiry(value);
    if (key === "cardCvv") nextValue = value.replace(/\D/g, "").slice(0, 4);

    setForm((current) => ({ ...current, [key]: nextValue }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    setMessage("");
  }

  function validateForm() {
    const labels = getValidationText(language);
    const errors = {};
    const cityPattern = /^[A-Za-zА-Яа-яЁёІіҢңҒғҚқҮүҰұҺһӨөӘә\s-]{2,}$/;
    const holderPattern = /^[A-Za-zА-Яа-яЁёІіҢңҒғҚқҮүҰұҺһӨөӘә\s]{3,}$/;

    if (!cityPattern.test(form.city.trim())) errors.city = labels.city;
    if (form.address.trim().length < 8) errors.address = labels.address;

    if (form.paymentMethod === "card") {
      if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.cardNumber.trim())) errors.cardNumber = labels.cardNumber;
      if (!holderPattern.test(form.cardHolder.trim())) errors.cardHolder = labels.cardHolder;
      if (!isValidExpiry(form.cardExpiry.trim())) errors.cardExpiry = labels.cardExpiry;
      if (!/^\d{3,4}$/.test(form.cardCvv.trim())) errors.cardCvv = labels.cardCvv;
    }

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, invalidMessage: labels.invalid };
  }

  async function handleCheckout() {
    const validation = validateForm();
    if (!validation.isValid) {
      setMessage(validation.invalidMessage);
      return;
    }

    try {
      await checkout(form);
      setMessage(t.orderSuccess);
      setForm(initialCheckoutForm);
      setFieldErrors({});
    } catch (error) {
      setMessage(translateErrorMessage(error.message, language));
    }
  }

  return (
    <aside className={`cart-drawer ${isCartOpen ? "is-open" : ""}`}>
      <div className="cart-drawer__header">
        <h3>{t.cartTitle}</h3>
        <button type="button" onClick={() => setIsCartOpen(false)}>
          x
        </button>
      </div>

      {!isAuthenticated ? (
        <p className="muted">{t.cartLoginHint}</p>
      ) : items.length === 0 ? (
        <p className="muted">{t.cartEmpty}</p>
      ) : (
        <div className="cart-list">
          {items.map((item) => {
            const localized = localizeBook(item, language);
            return (
              <article key={item.book_id} className="cart-item">
                <BookCover book={localized} compact />
                <div>
                  <h4>{localized.title}</h4>
                  <p>{localized.author}</p>
                  <p>{Number(item.price_kzt).toLocaleString()} KZT</p>
                </div>
                <button type="button" onClick={() => removeItem(item.book_id)}>
                  x
                </button>
              </article>
            );
          })}

          <div className="checkout-form">
            <h4>{t.checkoutTitle}</h4>
            <p className="muted">{t.checkoutHint}</p>

            <div className="checkout-field">
              <input
                className={`field ${fieldErrors.city ? "field--error" : ""}`}
                placeholder={t.city}
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
              />
              {fieldErrors.city && <p className="field-error">{fieldErrors.city}</p>}
            </div>

            <div className="checkout-field">
              <input
                className={`field ${fieldErrors.address ? "field--error" : ""}`}
                placeholder={t.address}
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
              />
              {fieldErrors.address && <p className="field-error">{fieldErrors.address}</p>}
            </div>

            <label className="field-group">
              <span>{t.paymentMethod}</span>
              <select
                className="field"
                value={form.paymentMethod}
                onChange={(event) => updateField("paymentMethod", event.target.value)}
              >
                <option value="cash_on_delivery">{t.paymentCash}</option>
                <option value="card">{t.paymentCard}</option>
              </select>
            </label>

            {showCardFields && (
              <div className="checkout-card-grid">
                <div className="checkout-field">
                  <input
                    className={`field ${fieldErrors.cardNumber ? "field--error" : ""}`}
                    placeholder={t.cardNumber}
                    value={form.cardNumber}
                    onChange={(event) => updateField("cardNumber", event.target.value)}
                  />
                  {fieldErrors.cardNumber && <p className="field-error">{fieldErrors.cardNumber}</p>}
                </div>

                <div className="checkout-field">
                  <input
                    className={`field ${fieldErrors.cardHolder ? "field--error" : ""}`}
                    placeholder={t.cardHolder}
                    value={form.cardHolder}
                    onChange={(event) => updateField("cardHolder", event.target.value)}
                  />
                  {fieldErrors.cardHolder && <p className="field-error">{fieldErrors.cardHolder}</p>}
                </div>

                <div className="checkout-field">
                  <input
                    className={`field ${fieldErrors.cardExpiry ? "field--error" : ""}`}
                    placeholder={t.cardExpiry}
                    value={form.cardExpiry}
                    onChange={(event) => updateField("cardExpiry", event.target.value)}
                  />
                  {fieldErrors.cardExpiry && <p className="field-error">{fieldErrors.cardExpiry}</p>}
                </div>

                <div className="checkout-field">
                  <input
                    className={`field ${fieldErrors.cardCvv ? "field--error" : ""}`}
                    placeholder={t.cardCvv}
                    value={form.cardCvv}
                    onChange={(event) => updateField("cardCvv", event.target.value)}
                  />
                  {fieldErrors.cardCvv && <p className="field-error">{fieldErrors.cardCvv}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="cart-drawer__footer">
        <strong>{total.toLocaleString()} KZT</strong>
        <button type="button" className="primary-button" onClick={handleCheckout}>
          {t.cartCheckout}
        </button>
        {message && <p className="form-message form-message--warning">{message}</p>}
      </div>
    </aside>
  );
}
