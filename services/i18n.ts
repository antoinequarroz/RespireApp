import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import de from '@/locales/de.json';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

const i18n = new I18n({ en, fr, de });

i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

export function configureI18n(locale?: string) {
  const deviceLocale = getLocales()[0]?.languageCode ?? 'fr';
  i18n.locale = locale ?? deviceLocale;
}

configureI18n();

export { i18n };
