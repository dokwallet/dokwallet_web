import React, {useCallback, useRef, useState} from 'react';
import s from './SendPopOver.module.css';
import ModalCustomDerivation from 'components/ModalCustomDerivation';
import ModalConfirmTransaction from 'components/ModalConfirmTransaction';
import {useRouter} from 'next/navigation';
import DokPopover from 'components/DokPopover';

// eslint-disable-next-line react/display-name
const SendPopOver = () => {
  const [showCustomDerivationModal, setShowCustomDerivationModal] =
    useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const popoverRef = useRef(null);

  const onSuccessOfPasswordModal = useCallback(() => {
    setShowConfirmModal(false);
    router.push('/home/send/custom-derivation');
  }, [router]);

  return (
    <>
      <DokPopover ref={popoverRef}>
        <button
          className={s.popoverItemView}
          onClick={() => {
            popoverRef.current?.close();
            setShowCustomDerivationModal(true);
          }}>
          <p className={s.popoverItemText}>{'Custom Derivation'}</p>
        </button>
      </DokPopover>
      <ModalCustomDerivation
        visible={showCustomDerivationModal}
        hideModal={isPressYes => {
          setShowCustomDerivationModal(false);
          if (isPressYes) {
            setShowConfirmModal(true);
          }
        }}
      />
      <ModalConfirmTransaction
        hideModal={() => {
          setShowConfirmModal(false);
        }}
        visible={showConfirmModal}
        onSuccess={onSuccessOfPasswordModal}
      />
    </>
  );
};

export default SendPopOver;
