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
      invalid: "Some fields are filled incorrectly.",
      city: "Enter the delivery city.",
      address: "Enter the delivery address.",
      cardNumber: "Enter a valid card number.",
      cardHolder: "Enter the cardholder name.",
      cardExpiry: "Enter expiry in MM/YY format.",
      cardCvv: "Enter a valid CVV."
    };
  }

  return {
    invalid: "Некоторые поля заполнены неверно.",
    city: "Введите город доставки.",
    address: "Введите адрес доставки.",
    cardNumber: "Введите корректный номер карты.",
    cardHolder: "Введите имя владельца карты.",
    cardExpiry: "Введите срок действия в формате MM/YY.",
    cardCvv: "Введите корректный CVV."
  };
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
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    setMessage("");
  }

  function validateForm() {
    const labels = getValidationText(language);
    const errors = {};

    if (!form.city.trim()) errors.city = labels.city;
    if (!form.address.trim()) errors.address = labels.address;

    if (form.paymentMethod === "card") {
      const normalizedCard = form.cardNumber.replace(/\s+/g, "");
      if (!/^\d{16}$/.test(normalizedCard)) errors.cardNumber = labels.cardNumber;
      if (!form.cardHolder.trim() || form.cardHolder.trim().length < 3) errors.cardHolder = labels.cardHolder;
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry.trim())) errors.cardExpiry = labels.cardExpiry;
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
