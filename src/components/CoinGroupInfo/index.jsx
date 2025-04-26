import React, {useCallback} from 'react';
import {Modal, Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import Image from 'next/image';
import styles from './CoinGroupInfo.module.css';
import {useGroupCoins} from 'src/hooks/useGroupCoins';
import CoinIcons from 'src/components/CoinsIcons';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--secondaryBackgroundColor)',
  borderRadius: '10px',
  overflow: 'hidden',
  minHeight: '75vh',
  maxHeight: '75vh',
  '@media (min-width: 768px)': {
    width: '50%',
    minHeight: '75vh',
    maxHeight: '75vh',
  },
};

const CoinGroupInfoModal = ({
  visible,
  onDismiss,
  groups,
  selectedGroupId,
  isAddingGroup,
  onPressAddItem,
  currentWallet,
  userCoins,
}) => {
  const selectedGroup = groups.find(group => group._id === selectedGroupId);

  const {isDisabledItem, isGroupCoinsAdded, isAdding} = useGroupCoins({
    currentWallet,
    group: selectedGroup,
    isAddingGroup,
    userCoins,
  });

  const onLocalAddPress = useCallback(
    e => {
      e.stopPropagation();
      if (onPressAddItem) {
        onPressAddItem(selectedGroup, isGroupCoinsAdded);
      }
    },
    [isGroupCoinsAdded, selectedGroup, onPressAddItem],
  );

  if (!selectedGroup) return null;

  const icons = selectedGroup?.coins?.map(coin => coin.icon);

  return (
    <Modal
      open={visible}
      onClose={onDismiss}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      slotProps={{
        backdrop: {
          style: {backgroundColor: 'transparent'},
        },
      }}>
      <Box sx={style}>
        <div className={styles.modalDiv}>
          <div className={styles.contentBox}>
            <div className={styles.scrollModalDiv}>
              <div className={styles.header}>
                <h3 className={styles.title}>{selectedGroup.name}</h3>
                <div className={styles.headerActions}>
                  <CoinIcons icons={icons} />
                  <button className={styles.btnClose} onClick={onDismiss}>
                    ×
                  </button>
                </div>
              </div>
              <p className={styles.description}>{selectedGroup.description}</p>
              <h3 className={styles.subTitle}>Coins</h3>
              {selectedGroup.coins.map((coin, index) => (
                <div key={coin._id || index} className={styles.coinItem}>
                  <div className={styles.coinIconWrapper}>
                    <Image
                      src={coin.icon}
                      alt={coin.name}
                      width={30}
                      height={30}
                      className={styles.coinIcon}
                    />
                  </div>
                  <div className={styles.coinInfo}>
                    <div className={styles.coinHeader}>
                      <div className={styles.coinTitleGroup}>
                        <span className={styles.coinSymbol}>{coin.symbol}</span>
                        <span className={styles.chainName}>
                          {coin.chain_display_name}
                        </span>
                      </div>
                    </div>
                    <span className={styles.coinName}>{coin.name}</span>
                  </div>
                </div>
              ))}
              <Button
                onClick={onLocalAddPress}
                disabled={isGroupCoinsAdded || isDisabledItem || isAdding}
                className={`${styles.addButton} ${isDisabledItem ? styles.disabledButton : ''}`}
                color={isGroupCoinsAdded ? 'success' : 'primary'}
                data-state={
                  isAdding ? 'adding' : isGroupCoinsAdded ? 'added' : 'default'
                }
                startIcon={isGroupCoinsAdded ? <CheckIcon /> : <AddIcon />}
                fullWidth
                variant='contained'>
                {isAdding ? 'Adding...' : isGroupCoinsAdded ? 'Added' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CoinGroupInfoModal;
