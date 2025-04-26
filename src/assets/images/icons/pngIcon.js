import MenuVertical from 'assets/images/icons/menu-vertical.png';
import MenuVerticalDark from 'assets/images/icons/menu-vertical-dark.png';
import DownArrow from 'assets/images/icons/down-arrow.png';
import DownArrowDark from 'assets/images/icons/down-arrow-dark.png';
import UpArrow from 'assets/images/icons/up-arrow.png';
import UpArrowDark from 'assets/images/icons/up-arrow-dark.png';

export const getPngIcons = themeType => {
  return {
    MenuVertical: themeType === 'light' ? MenuVertical : MenuVerticalDark,
    DownArrow: themeType === 'light' ? DownArrow : DownArrowDark,
    UpArrow: themeType === 'light' ? UpArrow : UpArrowDark,
  };
};
