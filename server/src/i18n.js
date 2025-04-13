import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'bg'],
    backend: {
      loadPath: join(__dirname, 'locales', '{{lng}}', 'translation.json'),
    },
    detection: {
      order: ['cookie', 'querystring', 'header'],
      caches: ['cookie'],
      lookupQuerystring: 'lang',
      lookupCookie: 'myLang',
    },
  });

export default i18next;
