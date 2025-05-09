import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations from public/locales/{language}/{namespace}.json
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en', // Default language if detection fails
    debug: process.env.NODE_ENV === 'development', // Debug in development mode only
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'fixpoint_language',
      caches: ['localStorage'],
    },
    
    // Available languages (used for language switcher)
    supportedLngs: ['en', 'hi', 'ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml'],
    
    // Backend options
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Default namespace
    defaultNS: 'common',
  });

export default i18n;