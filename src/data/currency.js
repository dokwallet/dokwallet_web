const icons = require(`assets/images/icons`).default;

export const currencySymbol = {
  USD: '$',
  EUR: '€',
};

export const dollar = icons.dollar;
export const euro = icons.euro;
export const localCurrencyList = [
  {
    icon: dollar,
    label: 'United States Dollar',
    id: 'USD',
  },
  {
    icon: euro,
    label: 'Euro',
    id: 'EUR',
  },
];

const Other = require(`assets/images/sidebarIcons/LogoSingle.svg`).default;
const OtherDark = require(
  `assets/images/sidebarIcons/LogoSingleDark.svg`,
).default;

export const otherDark = OtherDark;
export const other = Other;

export const currencyIcon = {
  USD: dollar,
  EUR: euro,
};
