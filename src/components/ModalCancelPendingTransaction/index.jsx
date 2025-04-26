import React from 'react';
import styles from './ModalConfirmEnableChatModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Loading from 'components/Loading';
import {currencySymbol} from 'data/currency';
import Spinner from 'components/Spinner';

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

const ModalCancelPendingTransaction = ({
  visible,
  onPressYes,
  onPressNo,
  pendingTransferData,
  currentCoin,
  localCurrency,
  isCancelTransaction,
}) => {
  const {isLoading, fiatEstimateFee, transactionFee, success} =
    pendingTransferData;
  return (
    <Modal
      open={visible}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.container}>
          <div className={styles.infoList}>
            <p className={styles.titleInfo}>{`${
              isCancelTransaction ? 'Cancel' : 'Speed Up'
            } Transaction?`}</p>
            <p className={styles.info}>
              {`Are you sure you want to ${
                isCancelTransaction ? 'cancel' : 'speed up'
              } the pending transaction? Please note that a fee may apply.`}
            </p>
            <div>
              {isLoading ? (
                <div className={styles.paddingView}>
                  <Loading size={40} height={'84px'} />
                </div>
              ) : success ? (
                <div>
                  <div className={styles.feeTitle}>{'Estimate Fees:'}</div>
                  <div
                    className={
                      styles.feeDescription
                    }>{`${transactionFee} ${currentCoin?.chain_symbol}`}</div>
                  <div className={styles.feeDescription}>
                    {currencySymbol[localCurrency] + fiatEstimateFee}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.btnList}>
            <button className={styles.learnBox} onClick={onPressNo}>
              No
            </button>

            <button className={styles.learnBox} onClick={onPressYes}>
              Yes
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalCancelPendingTransaction;
