import { createI18n } from 'vue-i18n';
import en from '@/assets/i18n/en.json';
import zh from '@/assets/i18n/zh.json';

const hashPath = window.location.hash;
let locale = 'en';

if (hashPath.includes('en-US')) {
  locale = 'en';
} else if (hashPath.includes('zh-TW')) {
  locale = 'zh';
} else if (sessionStorage.getItem('locale')) {
  locale = sessionStorage.getItem('locale');
} else {
  locale = 'en';
}

const messages = {
  en,
  zh,
};

const i18n = createI18n({
  locale,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
