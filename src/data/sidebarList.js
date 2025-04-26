const icons = require(`assets/images/sidebarIcons`).default;

const sidebarList = [
  {
    href: '/home',
    item: t => (
      <>
        {icons.home} <span>{t('home')}</span>
      </>
    ),
  },
  {
    href: '/buy-crypto',
    item: t => (
      <>
        {icons.buy}
        <span>{t('buyCrypto')}</span>
      </>
    ),
  },
  {
    href: '/swap',
    item: t => (
      <>
        {icons.exchange}
        <span>{t('swap')}</span>
      </>
    ),
  },
  {
    href: '/sell-crypto',
    item: t => (
      <>
        {icons.buy}
        <span>{t('sellCrypto')}</span>
      </>
    ),
  },
  {
    href: '/wallets',
    item: t => (
      <>
        {icons.wallet}
        <span>{t('wallets')}</span>
      </>
    ),
  },
  {
    href: '/wallet-connect',
    item: t => (
      <>
        {icons.walletConnect}
        <span>{t('walletConnect')}</span>
      </>
    ),
  },
  {
    href: '/about',
    item: t => (
      <>
        {icons.about}
        <span>{t('about')}</span>
      </>
    ),
  },
  {
    href: '/contact-us',
    item: t => (
      <>
        {icons.contactUs}
        <span>{t('contactUs')}</span>
      </>
    ),
  },
  {
    href: '/settings',
    item: t => (
      <>
        {icons.settings}
        <span>{t('settings')}</span>
      </>
    ),
  },
  {
    href: '/receive-payment-url',
    item: t => (
      <>
        {icons.url}
        <span>{t('receivePaymentUrl')}</span>
      </>
    ),
  },
  {
    href: '/reset-wallet',
    item: t => (
      <>
        {icons.walletReset}
        <span>{t('resetWallet')}</span>
      </>
    ),
  },
  {
    href: '/logout',
    item: t => (
      <>
        {icons.logout}
        <span>{t('logout')}</span>
      </>
    ),
  },
];

export default sidebarList;
