'use client';
import { useLanguage } from '../../../../../context/LanguageContext';
import enTranslations from '../../../../../locales/en.json';
import arTranslations from '../../../../../locales/ar.json';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split('.');
    let value = language === 'en' ? enTranslations : arTranslations;

    keys.forEach(k => {
      value = value?.[k];
    });

    return value || key;
  };

  return { t };
};
