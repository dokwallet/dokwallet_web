import React, {useState, useEffect, useContext} from 'react';
import styles from './ModalBuyCrypto.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// import { ThemeContext } from "../../../ThemeContext";
// import { source } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
// import { InAppBrowser } from "react-native-inappbrowser-reborn";
// import { inAppBrowserOptions } from "config/config";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'var(--secondaryBackgroundColor)',
  borderRadius: '10px',
  // overflow: "hidden",
  '@media (min-width: 768px)': {
    width: '30%',
  },
};

const ModalBuyCrypto = ({visible, hideModal, cryptoProvider}) => {
  // const { theme } = useContext(ThemeContext);
  // const styles = myStyles(theme);

  return (
    <Modal
      open={visible}
      onClose={() => hideModal(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.infoList}>
          <p className={styles.titleInfo}>
            Your Dokwallet`s address was copied to clipboard.
          </p>
          <p className={styles.infoBox}>
            <p className={styles.info}>
              Simply paste it when asked by
              {cryptoProvider?.title?.toLowerCase()}
            </p>
          </p>
          <p className={styles.info}>
            **Please double check when purchasing for the first time.
          </p>
        </div>

        <div className={styles.buttonList}>
          <button
            className={styles.button}
            onClick={async () => {
              hideModal(false);
              // const url = cryptoProvider.uri;
              // const isAvailable = await InAppBrowser.isAvailable();
              // if (isAvailable) {
              //   await InAppBrowser.open(url, inAppBrowserOptions);
              // }
            }}>
            Ok
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalBuyCrypto;
