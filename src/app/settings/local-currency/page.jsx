'use client';
import {useEffect, useRef} from 'react';

import {localCurrencyList} from 'data/currency';
import {useSelector, useDispatch} from 'react-redux';
import {getLocalCurrency} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';
import {setLocalCurrency} from 'dok-wallet-blockchain-networks/redux/settings/settingsSlice';

import {refreshCoins} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';

import s from './LocalCurrency.module.css';
import GoBackButton from 'components/GoBackButton';

const LocalCurrency = () => {
  const localCurrency = useSelector(getLocalCurrency);
  const dispatch = useDispatch();
  const isButtonClick = useRef(false);

  useEffect(() => {
    if (localCurrency && isButtonClick.current) {
      isButtonClick.current = false;
      dispatch(refreshCoins());
    }
  }, [dispatch, localCurrency]);

  return (
    <div className={s.container}>
      <GoBackButton />
      <div className={s.btnWrapper}>
        {localCurrencyList?.map((item, index) => (
          <button
            className={s.list}
            key={index}
            onClick={() => {
              isButtonClick.current = true;
              dispatch(setLocalCurrency(item.id));
            }}>
            <div
              className={
                localCurrency === item.id ? s.iconBox : s.iconBoxChecked
              }>
              {item.icon}
            </div>

            <div className={s.items}>
              <p className={s.title}>{item.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocalCurrency;
