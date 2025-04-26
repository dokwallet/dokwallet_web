import React from 'react';
import Image from 'next/image';
import styles from './ExchangeProviderItem.module.css';

const ExchangeProviderItem = ({
  item,
  selectedToAsset,
  selectedFromAsset,
  selectedExchangeChain,
  onPressItem,
}) => {
  return (
    <button
      className={styles.list}
      onClick={() => onPressItem(item)}
      style={
        selectedExchangeChain?.providerName === item?.providerName
          ? {
              borderColor: 'var(--background)',
              borderWidth: '2px',
            }
          : {}
      }>
      <div className={styles.iconBox}>
        {item?.src && (
          <Image
            src={item?.src}
            style={{borderRadius: 20}}
            height={32}
            width={32}
            alt='exchange-provider'
          />
        )}
      </div>

      <div className={styles.items}>
        <div className={styles.rowView}>
          <div className={styles.itemDescriptionTitle}>{item?.title}</div>
          <div className={styles.itemDescription}>
            {` (Min: ${item?.minAmount} ${selectedFromAsset?.symbol}) `}
          </div>
        </div>
        <div
          className={
            styles.itemTitle
          }>{`${item?.toAmount} ${selectedToAsset?.symbol}`}</div>
      </div>
    </button>
  );
};

export default ExchangeProviderItem;
