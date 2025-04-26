'use client';

import s from './ActiveLink.module.css';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

function ActiveLink({children, href, setModal, setPage}) {
  const path = usePathname();
  const pathname = `/${path.split('/')[1]}`;

  const style = {
    color: pathname === href ? 'var(--background)' : 'var(--gray)',
    fill: pathname === href ? 'var(--background)' : 'var(--gray)',
  };

  const handleClick = event => {
    if (event.target.innerText === 'Reset Wallet') {
      setPage('Reset Wallet');
      setModal(true);
      event.preventDefault();
    } else if (event.target.innerText === 'Logout') {
      setPage('LogOut');
      setModal(true);
      event.preventDefault();
    }
  };

  return (
    <Link href={href} className={s.item} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}

export default ActiveLink;
