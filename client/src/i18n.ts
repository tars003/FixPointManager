import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const savedLanguage = localStorage.getItem('fixpoint_language') || 'en';

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    lng: savedLanguage,
    debug: false, // Set to true for development
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'fixpoint_language',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    
    // Enable dynamic loading of translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Default namespaces used in your application
    ns: ['common', 'vehicle', 'service', 'documents', 'arena', 'emergency', 'marketplace', 'rto'],
    defaultNS: 'common',
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;