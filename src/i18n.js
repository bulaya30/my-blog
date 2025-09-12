import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../src/locales/en/translation.json";
import fr from "../src/locales/fr/translation.json";

// check localStorage for saved language
const savedLang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: savedLang,   // use saved language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
