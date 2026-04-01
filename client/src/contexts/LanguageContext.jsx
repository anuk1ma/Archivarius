import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(localStorage.getItem("language") || "ru");

  const value = useMemo(
    () => ({
      language,
      setLanguage(nextLanguage) {
        localStorage.setItem("language", nextLanguage);
        setLanguageState(nextLanguage);
      },
      t: translations[language]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
