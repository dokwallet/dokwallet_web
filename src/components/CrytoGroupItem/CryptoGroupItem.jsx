import React, {memo, useCallback, useMemo} from 'react';
import styles from './CryptoGroupItem.module.css';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import {useGroupCoins} from '../../hooks/useGroupCoins';
import CoinIcons from '../CoinsIcons';

const CryptoGroupItem = ({
  currentWallet,
  item,
  index,
  userCoins,
  onPressItem,
  onPressAddItem,
  isAddingGroup,
}) => {
  const icons = useMemo(() => {
    return item?.coins?.map(subItem => subItem?.icon);
  }, [item?.coins]);

  const {isDisabledItem, isGroupCoinsAdded, isAdding} = useGroupCoins({
    currentWallet,
    group: item,
    isAddingGroup,
    userCoins,
  });

  const onLocalPress = useCallback(() => {
    if (onPressItem) {
      onPressItem(item, isGroupCoinsAdded);
    }
  }, [isGroupCoinsAdded, item, onPressItem]);

  const onLocalAddPress = useCallback(
    e => {
      e.stopPropagation();
      if (onPressAddItem) {
        onPressAddItem(item, isGroupCoinsAdded);
      }
    },
    [isGroupCoinsAdded, item, onPressAddItem],
  );

  return (
    <div
      className={`${styles.section} ${isDisabledItem ? styles.disableSection : ''}`}
      onClick={isDisabledItem ? undefined : onLocalPress}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item?.name}</h3>
          <CoinIcons icons={icons} />
        </div>
        <p className={`${styles.description} ${styles.mobileDescription}`}>
          {item?.description}
        </p>
      </div>
      <Button
        onClick={onLocalAddPress}
        disabled={isDisabledItem || isAdding}
        className={`${styles.addButton} ${isDisabledItem ? styles.disabledButton : ''}`}
        data-state={
          isAdding ? 'adding' : isGroupCoinsAdded ? 'added' : 'default'
        }
        startIcon={isGroupCoinsAdded ? <CheckIcon /> : <AddIcon />}>
        {isAdding ? 'Adding...' : isGroupCoinsAdded ? 'Added' : 'Add'}
      </Button>
    </div>
  );
};

export default memo(CryptoGroupItem);
