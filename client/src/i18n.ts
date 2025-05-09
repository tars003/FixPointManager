import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translation using http (default public/locales/en/common.json)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: ['common', 'documents', 'rto', 'vehicles', 'calculators'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // Not needed for React as it escapes by default
    },
    
    // Language detector options
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;