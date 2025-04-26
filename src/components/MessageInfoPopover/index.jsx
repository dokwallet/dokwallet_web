import React, {useRef, useState} from 'react';
import s from './MesageInfoPopOver.module.css';
import DokPopover from 'components/DokPopover';
import ModalInfo from 'components/ModalInfo';
import {TABS_INFO} from 'dok-wallet-blockchain-networks/helper';

const MessageInfoPopOver = () => {
  const popoverRef = useRef('');
  const selectedInfoRef = useRef();
  const [modalInfoPopupVisible, setModalInfoPopupVisible] = useState(false);

  return (
    <>
      <DokPopover ref={popoverRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
          <button
            className={s.popoverItemView}
            onClick={() => {
              selectedInfoRef.current = 'MESSAGES';
              setModalInfoPopupVisible(true);
            }}>
            <p className={s.popoverItemText}>{'What is Messages?'}</p>
          </button>
          <button
            className={s.popoverItemView}
            onClick={() => {
              selectedInfoRef.current = 'REQUESTS';
              setModalInfoPopupVisible(true);
            }}>
            <p className={s.popoverItemText}>{'What is Requests?'}</p>
          </button>
        </div>
      </DokPopover>
      <ModalInfo
        visible={modalInfoPopupVisible}
        handleClose={() => {
          setModalInfoPopupVisible(false);
        }}
        title={TABS_INFO[selectedInfoRef?.current]?.title}
        message={TABS_INFO[selectedInfoRef?.current]?.message}
      />
    </>
  );
};

export default MessageInfoPopOver;
