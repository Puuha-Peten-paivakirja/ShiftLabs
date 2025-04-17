import i18next from 'i18next'
import { initReactI18next, Translation } from 'react-i18next'
import en from './translations/en.json'
import fi from './translations/fi.json'

const resources = {
  en: {
    translation: en
  },
  fi: {
    translation: fi
  }
}

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false
  },
})

export default i18next
