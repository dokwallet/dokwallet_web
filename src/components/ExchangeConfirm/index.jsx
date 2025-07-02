'use client';

import React, {useCallback, useState} from 'react';
import s from './ExchangeConfirm.module.css';
import {useSelector, useDispatch} from 'react-redux';
import {getLocalCurrency} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';
import {sendFunds} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import {
  getTransferData,
  getTransferDataSubmitting,
} from 'dok-wallet-blockchain-networks/redux/currentTransfer/currentTransferSelector';
import {
  delay,
  getCustomizePublicAddress,
  isBalanceNotAvailable,
} from 'dok-wallet-blockchain-networks/helper';
import ModalConfirmTransaction from 'components/ModalConfirmTransaction';
import {currencySymbol} from 'data/currency';
import {
  getBalanceForNativeCoin,
  getCurrentWalletPhrase,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {getExchange} from 'dok-wallet-blockchain-networks/redux/exchange/exchangeSelectors';
import Loading from 'components/Loading';
import BigNumber from 'bignumber.js';
import GoBackButton from '../GoBackButton';

const icons = require(`assets/images/icons`).default;
import {useRouter} from 'next/navigation';

const ExchangeConfirm = () => {
  const localCurrency = useSelector(getLocalCurrency);
  const transferData = useSelector(getTransferData);
  const isSubmitting = useSelector(getTransferDataSubmitting);
  const balance = useSelector(getBalanceForNativeCoin);
  const phrase = useSelector(getCurrentWalletPhrase);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dispatch = useDispatch();
  const {
    selectedFromAsset,
    selectedFromWallet,
    selectedToAsset,
    amountFrom,
    amountTo,
    isLoading,
    success,
  } = useSelector(getExchange);
  const router = useRouter();

  const onSuccess = useCallback(async () => {
    setShowConfirmModal(false);
    await delay(300);
    await dispatch(
      sendFunds({
        to: transferData?.toAddress,
        amount: amountFrom,
        currentCoin: transferData?.currentCoin,
        currentWallet: selectedFromWallet,
        phrase,
        isExchange: true,
        router,
      }),
    );
  }, [
    dispatch,
    transferData?.toAddress,
    transferData?.currentCoin,
    amountFrom,
    selectedFromWallet,
    phrase,
    router,
  ]);

  const handleSubmitForm = () => {
    setShowConfirmModal(true);
  };

  const isDisabled = isBalanceNotAvailable(
    balance,
    transferData?.transactionFee,
    selectedFromAsset?.type === 'coin' ? amountFrom : null,
  );

  const currencyRate = selectedFromAsset?.currencyRate || '0';
  const amount = amountFrom || '0';
  const currentRateBN = new BigNumber(currencyRate);
  const amountBN = new BigNumber(amount);
  const priceValue = currentRateBN.multipliedBy(amountBN);
  const fiatEstimateFee = transferData?.fiatEstimateFee || '0';
  const fiatEstimateFeeBN = new BigNumber(fiatEstimateFee);
  const totalValue = priceValue.plus(fiatEstimateFeeBN).toFixed(2);

  return (
    <div>
      <div className={s.goBack}>
        <GoBackButton />
      </div>
      {isLoading || isSubmitting ? (
        <Loading />
      ) : !success ? (
        <div className={s.containerCenterView}>
          <p className={s.title}>{'Something went wrong please try again'}</p>
        </div>
      ) : (
        <div className={s.safeAreaView}>
          <div className={s.container}>
            <div className={s.formInput}>
              <div className={s.box}>
                <div className={s.itemView}>
                  <p className={s.title}>{'Asset'}</p>
                  <p
                    className={
                      s.boxBalance
                    }>{`${selectedFromAsset?.name} (${selectedFromAsset?.symbol})`}</p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'From'}</p>
                  <p className={s.boxBalance}>{`${getCustomizePublicAddress(
                    selectedFromAsset?.address,
                  )}`}</p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'Chain'}</p>
                  <p
                    className={
                      s.boxBalance
                    }>{`${selectedFromAsset?.chain_display_name}`}</p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'Pay Amount'}</p>
                  <p
                    className={
                      s.boxBalance
                    }>{`${amountFrom} ${selectedFromAsset?.symbol}`}</p>
                </div>
              </div>
              <div className={s.iconView}>{icons.sCurved}</div>
              <div className={s.box}>
                <div className={s.itemView}>
                  <p className={s.title}>{'Asset'}</p>
                  <p
                    className={
                      s.boxBalance
                    }>{`${selectedToAsset?.name} (${selectedToAsset?.symbol})`}</p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'To'}</p>
                  <p className={s.boxBalance}>{`${getCustomizePublicAddress(
                    selectedToAsset?.address,
                  )}`}</p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'Chain'}</p>
                  <p
                    className={
                      s.boxBalance
                    }>{`${selectedToAsset?.chain_display_name}`}</p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'Receive Amount'}</p>
                  <p
                    className={
                      s.boxBalance
                    }>{`${amountTo} ${selectedToAsset?.symbol}`}</p>
                </div>
              </div>
              <div className={s.box}>
                <div className={s.itemView}>
                  <p className={s.title}>{'Network Fee'}</p>
                  <p className={s.boxBalance}>
                    {`${transferData?.transactionFee || '0'} ${
                      selectedFromAsset?.chain_symbol
                    }`}
                  </p>
                </div>
                <div className={s.itemView}>
                  <p className={s.title}>{'Max Total'}</p>
                  <p className={s.boxBalance}>{`${
                    currencySymbol[localCurrency]
                  }${totalValue || 0}`}</p>
                </div>
              </div>
            </div>
            {isDisabled && (
              <p
                className={
                  s.errorText
                }>{`You don't have enought balance for make transaction you require ${transferData?.transactionFee} ${transferData?.currentCoin?.chain_symbol} to complete the transaction `}</p>
            )}
            <button
              disabled={isDisabled}
              className={s.button}
              style={{
                backgroundColor: isDisabled ? '#708090' : 'var(--background)',
              }}
              onClick={handleSubmitForm}>
              <p className={s.buttonTitle}>Send</p>
            </button>
          </div>
        </div>
      )}
      <ModalConfirmTransaction
        hideModal={() => {
          setShowConfirmModal(false);
        }}
        visible={showConfirmModal}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default ExchangeConfirm;
