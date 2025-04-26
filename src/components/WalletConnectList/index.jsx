import React, {useRef, useContext, useState} from 'react';
import styles from './WalletConnectList.module.css';
import WalletConnectItem from 'components/WalletConnectItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--secondaryBackgroundColor)',
  borderRadius: '10px',
  overflow: 'hidden',
  minHeight: '80vh',
  '@media (min-width: 768px)': {
    width: '50%',
  },
};

const WalletConnectList = ({bottomSheetRef, visible, onClose}) => {
  return (
    <Modal
      open={visible}
      onClose={() => onClose(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.mainView}>
          <WalletConnectItem />
        </div>
      </Box>
    </Modal>
  );
};

export default WalletConnectList;
