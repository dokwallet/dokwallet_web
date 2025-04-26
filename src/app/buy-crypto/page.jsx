'use client';
import Image from 'next/image';
import styles from './BuyCrypto.module.css';
import cards from 'data/cards';
import {useRouter} from 'next/navigation';
import {getAppAssets, getShownOTC} from 'whitelabel/whiteLabelInfo';
import {useContext} from 'react';
import {ThemeContext} from 'theme/ThemeContext';
import {useSelector} from 'react-redux';
import {
  getCryptoProviders,
  getCryptoProvidersOTC,
} from 'dok-wallet-blockchain-networks/redux/cryptoProviders/cryptoProvidersSelectors';
import {currencySymbol} from 'data/currency';
import {getLocalCurrency} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';

const BuyCrypto = () => {
  const router = useRouter();
  const {themeType} = useContext(ThemeContext);
  const providers = useSelector(getCryptoProviders);
  const shownOTC = useSelector(getCryptoProvidersOTC);
  const localCurrency = useSelector(getLocalCurrency);

  return (
    <div className={styles.container}>
      {cards.map((card, index) => {
        if (
          (index === 0 && providers.length >= 1) ||
          (index === 1 && shownOTC)
        ) {
          return (
            <button
              key={index}
              className={styles.cardBox}
              onClick={() => {
                if (index === 0) {
                  router.push('/buy-crypto/crypto-providers');
                } else {
                  router.push('/buy-crypto/otc');
                }
              }}>
              <div className={styles.cardItemContainer}>
                <Image
                  src={
                    getAppAssets()?.[`buy_card_${index + 1}`]?.[themeType] ||
                    card.src
                  }
                  alt={`Card ${index}`}
                  className={styles.cardItem}
                  width={160}
                  height={90}
                />
                <div className={styles.textContainer}>
                  <p className={styles.cardTitle}>
                    {index === 0
                      ? `Credit Card\nBank Transfer\nAlternative Payment Method`
                      : 'OTC'}
                  </p>
                  {index === 1 && (
                    <p className={styles.cardDescription}>
                      {`(Must be over ${currencySymbol[localCurrency]}10000)`}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        }
        return null;
      })}
    </div>
  );
};

export default BuyCrypto;
