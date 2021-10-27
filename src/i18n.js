import { createI18n } from 'vue-i18n';

import en from '@/assets/i18n/en.json';
import zh from '@/assets/i18n/zh.json';

let browserLanguage = window.navigator.language;

// 先塞入瀏覽器預設語言在 i18n
if (browserLanguage.toLowerCase() === 'zh-tw') {
  browserLanguage = 'zh';
} else if (browserLanguage.toLowerCase() === 'en-us') {
  browserLanguage = 'en';
} else {
  browserLanguage = 'en';
}

const messages = {
  en,
  zh,
};

const i18n = createI18n({
  locale: browserLanguage,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
