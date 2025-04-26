import {Roboto} from 'next/font/google';
import './globals.css';
import StateProvider from '../redux/StateProvider';
import AppRouting from 'components/AppRouting';
import ThemeProvider from 'theme/ThemeContext';
import React from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default async function RootLayout({children}) {
  let locale;
  let messages;

  try {
    locale = await getLocale();
    messages = await getMessages();
  } catch (error) {
    console.error('Error loading locale or messages:', error);
    locale = 'en';
    messages = {};
  }

  return (
    <html lang={locale}>
      <ThemeProvider>
        <body className={roboto.variable}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <StateProvider>
              <AppRouting>{children}</AppRouting>
            </StateProvider>
          </NextIntlClientProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
