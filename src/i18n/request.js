import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from 'src/utils/updateLocale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

async function loadMessages(locale) {
  try {
    return (await import(`../locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    return (await import(`../locales/en.json`)).default;
  }
}
