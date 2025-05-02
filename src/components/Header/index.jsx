'use client';

import Link from 'next/link';
import s from './Header.module.css';

import {getAppLogo} from 'whitelabel/whiteLabelInfo';
const icons = require(`assets/images/icons`).default;
import React, {useContext, useEffect} from 'react';
import {ThemeContext} from 'theme/ThemeContext';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import {publicRoutes} from 'utils/common';

const Header = () => {
  const {themeType} = useContext(ThemeContext);
  const path = usePathname();
  const pathname = `/${path.split('/')[1]}`;

  if (publicRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div className={s.container}>
      <Link href={pathname !== '/auth' && pathname !== '/' ? '/home' : '/'}>
        {getAppLogo()?.[themeType] ? (
          <Image
            src={getAppLogo()?.[themeType]}
            width={210}
            height={65}
            alt={'App logo'}
          />
        ) : themeType === 'light' ? (
          icons.logoWhite
        ) : (
          icons.logoDark
        )}
      </Link>
    </div>
  );
};

export default Header;
