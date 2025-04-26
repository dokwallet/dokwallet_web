import React from 'react';
import styles from './NewsModal.module.css';
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
  '@media (min-width: 768px)': {
    width: '50%',
  },
};

const NewsModal = ({onClose, message, visible}) => {
  return (
    <Modal
      open={visible}
      onClose={() => onClose(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.container}>
          <div className={styles.title}>{'Important News!'}</div>
          <div className={styles.description}>{message}</div>
        </div>
      </Box>
    </Modal>
  );
};
export default NewsModal;
