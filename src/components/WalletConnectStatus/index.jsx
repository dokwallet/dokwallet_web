import React, {useEffect, useMemo, useState} from 'react';
import styles from './WalletConnectStatus.module.css';
import WalletConnectList from 'components/WalletConnectList';
import {shallowEqual, useSelector} from 'react-redux';
import {
  selectAllWalletConnectSessions,
  selectWalletConnectSessions,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {subscribeWalletConnect} from 'dok-wallet-blockchain-networks/service/walletconnect';
import {getWalletConnectDetails} from 'whitelabel/whiteLabelInfo';

/////////////////////////////////////////////

const WalletConnectStatus = () => {
  const sessions = useSelector(selectWalletConnectSessions, shallowEqual);
  const allSessions = useSelector(selectAllWalletConnectSessions, shallowEqual);
  const allSessionKeys = useMemo(() => {
    return Object.keys(sessions);
  }, [sessions]);
  const [modalOpen, setModalClose] = useState(false);

  useEffect(() => {
    subscribeWalletConnect(allSessions, getWalletConnectDetails()).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return allSessionKeys.length ? (
    <>
      <button
        className={styles.mainView}
        onClick={() => {
          setModalClose(true);
        }}>
        {`${allSessionKeys.length} App${
          allSessionKeys.length > 1 ? 's' : ''
        } connected`}
      </button>
      <WalletConnectList visible={modalOpen} onClose={setModalClose} />
    </>
  ) : null;
};

export default WalletConnectStatus;
