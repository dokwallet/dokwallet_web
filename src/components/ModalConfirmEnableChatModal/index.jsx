import React from 'react';
import styles from './ModalConfirmEnableChatModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'var(--secondaryBackgroundColor)',
  borderRadius: '10px',
  overflow: 'hidden',
  '@media (min-width: 500px)': {
    width: '60%',
  },
  '@media (min-width: 768px)': {
    width: '40%',
  },
};

const ModalConfirmEnableChatModal = ({visible, hideModal}) => {
  const handlerNo = () => {
    hideModal();
  };

  const handlerYes = () => {
    hideModal(true);
  };

  return (
    <Modal
      open={visible}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.container}>
          <div className={styles.infoList}>
            <p className={styles.titleInfo}>{'Attention!'}</p>
            <p className={styles.info}>
              {'Please be aware that hackers, fraudsters, and spammers can send you external links which, if clicked, can drain your wallet.\n' +
                'Only use this chat if you are confident in your ability to manage these risks. The chat service is provided by xmtp.org, and Dok Wallet is not responsible for it and cannot assist you if something goes wrong.\n' +
                'Dok Wallet cannot compensate for any loss of assets. Use the chat only if you understand and accept these risks, and acknowledge that Dok Wallet has no responsibility whatsoever.\n Are you sure you want to continue?\n'}
            </p>
          </div>
          <div className={styles.btnList}>
            <button className={styles.learnBox} onClick={() => handlerNo()}>
              No
            </button>

            <button className={styles.learnBox} onClick={() => handlerYes()}>
              Yes
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalConfirmEnableChatModal;
