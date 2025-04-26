import React, {useCallback} from 'react';
// import { Dimensions, button, div } from "react-native";
// import { Modal, p } from "react-native-paper";
// import { ThemeConp } from "../../../ThemeConp";
// import myStyles from "./ModalDeleteStyles";
// import { isIpad } from "service/dimensions";

// import {getLoading} from 'dok-wallet-blockchain-networks/redux/auth/authSelectors';

import s from './ModalDelete.module.css';
import {Box, Modal} from '@mui/material';

const ModalDelete = ({visible, onPressYes, onPressNo, walletName}) => {
  const handlerYes = useCallback(() => {
    onPressYes && onPressYes();
  }, [onPressYes]);

  const handlerNo = useCallback(() => {
    onPressNo && onPressNo();
  }, [onPressNo]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    bgcolor: 'var(--secondaryBackgroundColor)',
    '@media (min-width: 768px)': {
      width: '50%',
    },
    borderRadius: '10px',
    overflow: 'hidden',
  };

  return (
    <Modal
      open={visible}
      onClose={() => handlerNo()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={s.infoList}>
          <p className={s.titleInfo}>{`Delete Wallet: ${walletName}`}</p>
          <p className={s.info}>
            Please make sure you have a copy of 12-word seed phrase. You will
            need it in order to restore your wallet. Without it you will NOT be
            able to restore your wallet and you will lose access to your funds.
          </p>
          <p className={s.info}>Are you sure you want to proceed?</p>
        </div>
        <div className={s.btnList}>
          <div className={s.learnBorder}>
            <button className={s.learnBox} onClick={() => handlerNo()}>
              <p className={s.learnText}>No</p>
            </button>
          </div>

          <button className={s.learnBox} onClick={() => handlerYes()}>
            <p className={s.learnText}>Yes</p>
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalDelete;
