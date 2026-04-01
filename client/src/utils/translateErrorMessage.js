import { translations } from "../data/translations";

const messageMap = {
  "Заполните имя, email и пароль.": "errorFillAuthFields",
  "Заполните имя.": "errorFillName",
  "Введите email и пароль.": "errorFillLoginFields",
  "Пользователь с таким email уже существует.": "errorUserExists",
  "Такого пользователя не существует.": "errorUserNotFound",
  "Неверный пароль.": "errorWrongPassword",
  "Корзина пуста.": "errorEmptyCart",
  "Заполните город и адрес доставки.": "errorFillDelivery",
  "Выберите корректный способ оплаты.": "errorPaymentMethod",
  "Заполните данные карты.": "errorFillCard",
  "Произошла ошибка запроса.": "errorRequest"
};

export function translateErrorMessage(message, language) {
  const dictionary = translations[language] || translations.ru;
  const key = messageMap[message];
  return key ? dictionary[key] : message;
}
