'use client';
import React from 'react';
import {currencySymbol} from 'data/currency';
import Icons from '../../assets/images/icons';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentCoin} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {getLocalCurrency} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';
import {toast} from 'react-toastify';
import Image from 'next/image';
import {setRouteStateData} from 'dok-wallet-blockchain-networks/redux/extraData/extraDataSlice';
import styles from './StakingItem.module.css';

const StakingItem = ({item, isWithdraw, estimateEpochTimestamp}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentCoin = useSelector(selectCurrentCoin);
  const localCurrency = useSelector(getLocalCurrency);

  return (
    <div
      style={{pointerEvents: !isWithdraw ? 'none' : 'auto'}}
      onClick={() => {
        if (item?.status?.toLowerCase() === 'deactivating') {
          toast.error(
            'Already deactivating: Please wait until epoch end then you can withdraw.',
          );
        } else if (item?.status) {
          const payload = {
            withdrawStaking: {
              selectedStake: item,
              ...(item?.status === 'inactive'
                ? {isWithdrawStaking: true}
                : {isDeactivateStaking: true}),
            },
          };
          dispatch(setRouteStateData(payload));
          router.push('/home/withdraw-staking');
        }
      }}>
      <div
        className={styles.rowView}
        style={
          !isWithdraw
            ? {border: '0.5px solid var(--gray)', borderRadius: 4}
            : {}
        }>
        <div className={styles.subRowView} style={{marginRight: 0}}>
          <div className={styles.subRowView}>
            {item?.validatorInfo?.image && (
              <Image
                src={item?.validatorInfo?.image}
                className={styles.imageStyle}
                alt=''
                width={40}
                height={40}
              />
            )}
            <div className={styles.flex1}>
              <div className={styles.titleItem}>
                {item?.validatorInfo?.name}
              </div>
              <div
                className={styles.statusText}
                style={
                  item?.status?.includes('ing') ? {color: 'var(--gray)'} : {}
                }>
                {item?.status}
              </div>
            </div>
          </div>
          <div className={styles.rightRowView}>
            <div>
              <div
                className={
                  styles.balanceStyle
                }>{`${item?.amount} ${currentCoin?.symbol}`}</div>
              <div
                className={
                  styles.fiatStyle
                }>{`${currencySymbol[localCurrency]}${item?.fiatAmount}`}</div>
            </div>
            {!!isWithdraw && (
              <span className={styles.arrow}>{Icons.arrRight}</span>
            )}
          </div>
        </div>
        {(item?.status?.toLowerCase() === 'activating' ||
          item?.status?.toLowerCase() === 'deactivating') &&
          !!isWithdraw &&
          !!estimateEpochTimestamp && (
            <div className={styles.remaningTime}>
              {`Estimate remaining ${estimateEpochTimestamp}`}
            </div>
          )}
      </div>
    </div>
  );
};

export default StakingItem;
