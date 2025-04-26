'use client';
import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getLockTimeDisplay} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';
import {updateLockTime} from 'dok-wallet-blockchain-networks/redux/settings/settingsSlice';
import DokRadioButton from 'components/DokRadioButton';
import {AUTO_LOCK} from 'dok-wallet-blockchain-networks/helper';
import s from './AutoLock.module.css';
import GoBackButton from 'components/GoBackButton';

const AutoLock = () => {
  const lockTimeDisplay = useSelector(getLockTimeDisplay);
  const dispatch = useDispatch();

  const onChangeLockTime = useCallback(
    selectedLabel => {
      const foundValue =
        AUTO_LOCK.find(item => item.label === selectedLabel)?.value || 0;
      dispatch(updateLockTime(foundValue));
    },
    [dispatch],
  );

  return (
    <div className={s.container}>
      <GoBackButton />
      <DokRadioButton
        title={'Select a auto lock'}
        options={AUTO_LOCK}
        checked={lockTimeDisplay}
        setChecked={onChangeLockTime}
      />
    </div>
  );
};

export default AutoLock;
