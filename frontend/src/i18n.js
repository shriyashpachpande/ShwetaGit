import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation JSONs
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json'; 
import taTranslation from './locales/ta/translation.json';
import guTranslation from './locales/gu/translation.json';
import teTranslation from './locales/te/translation.json';
import knTranslation from './locales/kn/translation.json';
import bnTranslation from './locales/bn/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',   // default language
    debug: false,
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation }, 
      ta: { translation: taTranslation },
      gu: { translation: guTranslation },
      te: { translation: teTranslation },
      kn: { translation: knTranslation },
      bn: { translation: bnTranslation }
    }
  });

export default i18n;