import { translations } from "../data/translations";

const messageMap = {
  "Заполните имя, email и пароль.": "errorFillAuthFields",
  "Введите email и пароль.": "errorFillLoginFields",
  "Пользователь с таким email уже существует.": "errorUserExists",
  "Такого пользователя не существует.": "errorUserNotFound",
  "Неверный пароль.": "errorWrongPassword",
  "Корзина пуста.": "errorEmptyCart",
  "Произошла ошибка запроса.": "errorRequest"
};

export function translateErrorMessage(message, language) {
  const dictionary = translations[language] || translations.ru;
  const key = messageMap[message];
  return key ? dictionary[key] : message;
}
