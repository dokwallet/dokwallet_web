import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from './WalletConnectRequestModal.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const WalletConnect = require(`assets/images/WalletConnect.png`).default;
import Image from 'next/image';
import {getSdkError} from '@walletconnect/utils';
import {useDispatch, useSelector} from 'react-redux';
import {getWalletConnect} from 'dok-wallet-blockchain-networks/service/walletconnect';
import {
  setWalletConnectConnection,
  setWalletConnectRequestModal,
} from 'dok-wallet-blockchain-networks/redux/walletConnect/walletConnectSlice';
import {selectWalletConnectRequestData} from 'dok-wallet-blockchain-networks/redux/walletConnect/walletConnectSelectors';
import {
  setWalletConnectWalletData,
  setWalletConnect,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import {config} from 'dok-wallet-blockchain-networks/config/config';
import {
  selectAllCoins,
  selectCurrentWallet,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
///////////////////////////////////////
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
////////////////////////////////////

const WalletConnectRequestModal = props => {
  const requestData = useSelector(selectWalletConnectRequestData);
  const allCoins = useSelector(selectAllCoins);
  const currentWallet = useSelector(selectCurrentWallet);
  const [chainData, setChainData] = useState([]);
  const [isValidChain, setIsValidChain] = useState(false);
  const dispatch = useDispatch();
  const image = requestData?.icons[0] || null;
  const title = requestData?.name || '';
  const url = requestData?.url || '';
  const id = requestData?.id || '';
  const sessionId = requestData?.sessionId || '';
  const requiredNamespaces = requestData?.requiredNamespaces || {};
  const optionalNamespaces = requestData?.optionalNamespaces || {};
  const relays = requestData?.relays || {};

  useEffect(() => {
    if (requestData?.requiredNamespaces && allCoins.length) {
      const requireNamespace = requestData?.requiredNamespaces;
      const optionalNamespacesLocal = requestData?.optionalNamespaces;
      // const appImage = requestData?.icons[0] || null;
      // const appTitle = requestData?.name || '';
      // const appUrl = requestData?.url || '';
      const requiredNamespaceValue = Object.values(requireNamespace);
      const optionalNamespacesValue = Object.values(optionalNamespacesLocal);
      let allChain = [];
      requiredNamespaceValue.forEach(
        item => (allChain = allChain.concat(item.chains)),
      );
      let chainDetails = [];
      let isValidChainLocal = true;
      allChain.forEach(item => {
        if (config.WALLET_CONNECT_SUPPORTED_CHAIN[item]) {
          chainDetails.push({
            key: item,
            ...config.WALLET_CONNECT_SUPPORTED_CHAIN[item],
          });
        } else {
          isValidChainLocal = false;
        }
      });
      let optionalChain = [];
      optionalNamespacesValue.forEach(
        item => (optionalChain = optionalChain.concat(item.chains)),
      );
      optionalChain.forEach(item => {
        if (config.WALLET_CONNECT_SUPPORTED_CHAIN[item]) {
          chainDetails.push({
            key: item,
            ...config.WALLET_CONNECT_SUPPORTED_CHAIN[item],
          });
        }
      });
      let finalData = [];
      chainDetails.forEach(chain => {
        if (
          !finalData.find(
            item =>
              item.symbol === chain.symbol &&
              item.chain_name === chain.chain_name,
          )
        ) {
          const foundCoin = allCoins.find(
            item =>
              item.symbol === chain.symbol &&
              item.chain_name === chain.chain_name,
          );
          if (foundCoin) {
            finalData.push({...chain, ...foundCoin});
          }
        }
      });
      setChainData(finalData);
      setIsValidChain(isValidChainLocal);
    }
  }, [requestData, allCoins]);

  const onPressApprove = async () => {
    try {
      props?.onClose?.();
      const connector = getWalletConnect();
      if (connector) {
        let namespaces = {};
        const requiredNamespacesKeys = Object.keys(requiredNamespaces);
        const optionalNamespacesKeys = Object.keys(optionalNamespaces);
        const allKeys = [
          ...new Set([...requiredNamespacesKeys, ...optionalNamespacesKeys]),
        ];
        allKeys.forEach(key => {
          let accounts = [];
          requiredNamespaces[key]?.chains?.map(chain => {
            const foundCoin = chainData?.find(item => item.key === chain);
            if (foundCoin?.address) {
              accounts.push(`${chain}:${foundCoin?.address}`);
            }
          });
          optionalNamespaces[key]?.chains?.map(chain => {
            const foundCoin = chainData?.find(item => item.key === chain);
            if (foundCoin?.address) {
              accounts.push(`${chain}:${foundCoin?.address}`);
            }
          });

          accounts = [...new Set(accounts)];
          const requiredMethods = Array.isArray(
            requiredNamespaces[key]?.methods,
          )
            ? requiredNamespaces[key]?.methods
            : [];
          const optionalMethods = Array.isArray(
            optionalNamespaces[key]?.methods,
          )
            ? optionalNamespaces[key]?.methods
            : [];
          const allMethods = [
            ...new Set([...requiredMethods, ...optionalMethods]),
          ];
          const requiredEvents = Array.isArray(requiredNamespaces[key]?.events)
            ? requiredNamespaces[key]?.events
            : [];
          const optionalEvents = Array.isArray(optionalNamespaces[key]?.events)
            ? optionalNamespaces[key]?.events
            : [];
          const allEvents = [
            ...new Set([...requiredEvents, ...optionalEvents]),
          ];
          namespaces[key] = {
            accounts,
            methods: allMethods,
            events: allEvents,
          };
        });
        const session = await connector.approveSession({
          id,
          namespaces,
          relayProtocol: relays[0].protocol,
        });

        dispatch(
          setWalletConnect({
            [sessionId]: session,
          }),
        );
        dispatch(setWalletConnectConnection(true));

        sessionId &&
          dispatch(setWalletConnectWalletData({[sessionId]: chainData}));
      }
    } catch (e) {
      console.error('Error in approve request', e);
    }
  };

  const onPressReject = useCallback(() => {
    props?.onClose?.();
    const connector = getWalletConnect();
    if (connector) {
      connector.rejectSession({
        id,
        reason: getSdkError('USER_REJECTED_CHAINS'),
      });
    }
  }, [id, props]);

  const renderItem = (item, index) => {
    return (
      <div className={styles.itemView} key={item.key + index}>
        <div className={styles.iconBox}>
          <Image src={item?.icon} height={39} width={39} alt={'icon'} />
        </div>
        <div className={styles.box}>
          <p className={styles.itemTitle}>
            {`${item?.chain_display_name} (${currentWallet.walletName})`}
          </p>
          <p className={styles.url}>{item?.address}</p>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={props.visible}
      onClose={() => props.onClose(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.container}>
          <Image
            src={WalletConnect}
            alt='connect'
            className={styles.mainImageStyle}
          />

          <div className={styles.borderView} />

          <div className={styles.mainView}>
            {image && (
              <Image
                src={image}
                className={styles.imageStyle}
                alt={'image'}
                width={60}
                height={80}
                priority
              />
            )}
            <div className={styles.box}>
              <p className={styles.title}>{title}</p>
              <p className={styles.url}>{url}</p>
            </div>
          </div>

          <div className={styles.borderView} />
          <p className={styles.chainTitle}>{'Chains'}</p>
          {chainData.map((item, index) => renderItem(item, index))}
          <div className={styles.bottomView}>
            {!isValidChain && (
              <p className={styles.errorText}>
                {
                  'You can only accept requests originating from ETH, BNB, SOL, MATIC and/or TRX.'
                }
              </p>
            )}
            <div className={styles.rowView}>
              <button className={styles.button} onClick={onPressReject}>
                {'Reject'}
              </button>
              <button
                disabled={!isValidChain}
                style={{
                  backgroundColor: !isValidChain
                    ? 'var(--gray)'
                    : 'var(--background)',
                }}
                className={styles.button}
                onClick={onPressApprove}>
                {'Accept'}
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default WalletConnectRequestModal;
