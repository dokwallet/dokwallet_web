import React, {useCallback, useRef} from 'react';
import s from './MesagePopOver.module.css';
import {updateConsentState} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {useDispatch} from 'react-redux';
import DokPopover from 'components/DokPopover';
import {popupCenter} from 'utils/common';

// eslint-disable-next-line react/display-name
const MessagePopOver = ({conversation}) => {
  const dispatch = useDispatch();
  const popoverRef = useRef(null);

  const onPressBlockOrUnblock = useCallback(() => {
    popoverRef.current?.close();
    dispatch(
      updateConsentState({
        peerAddress: conversation?.peerAddress,
        topic: conversation?.topic,
        address: conversation?.clientAddress,
        consentState:
          conversation?.consentState === 'denied' ? 'allowed' : 'denied',
      }),
    );
  }, [
    conversation?.clientAddress,
    conversation?.consentState,
    conversation?.peerAddress,
    conversation?.topic,
    dispatch,
  ]);

  const onPressViewAddress = useCallback(() => {
    popoverRef.current?.close();
    popupCenter({
      url: `https://etherscan.io/address/${conversation?.peerAddress}`,
    });
  }, [conversation?.peerAddress]);

  return (
    <DokPopover ref={popoverRef}>
      <div className={s.overlayContainer}>
        <button className={s.popoverItemView} onClick={onPressBlockOrUnblock}>
          <p className={s.popoverItemText}>
            {conversation?.consentState === 'denied' ? 'Unblock' : 'Block'}
          </p>
        </button>
        <button className={s.popoverItemView} onClick={onPressViewAddress}>
          <p className={s.popoverItemText}>{'View in Explorer'}</p>
        </button>
      </div>
    </DokPopover>
  );
};

export default MessagePopOver;
