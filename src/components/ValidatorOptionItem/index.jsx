import React from 'react';
import Image from 'next/image';
import styles from './ValidatorOptionItem.module.css';

const ValidatorOptionItem = ({item, currentCoin}) => {
  return (
    <div className={styles.list}>
      <div className={styles.iconBox}>
        {item?.image && (
          <Image
            src={item?.image}
            style={{borderRadius: 20}}
            height={40}
            width={40}
            alt='validator-logo'
          />
        )}
      </div>

      <div className={styles.items}>
        <div className={styles.titleAmount} numberOfLines={1}>
          {item?.name}
        </div>
        <div
          className={styles.rowView}
          style={{marginTop: !item?.name ? 0 : '6px'}}>
          {item?.apy_estimate && (
            <div className={styles.text}>{item?.apy_estimate + '% APY'}</div>
          )}
          <div className={styles.text} numberOfLines={1}>
            {`STAKE ${Math.round(item?.activated_stake)} ${
              currentCoin?.symbol
            }`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorOptionItem;
