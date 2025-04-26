'use client';
import styles from './ResetWallet.module.css';
import React, {useContext, useLayoutEffect, useState} from 'react';

const icons = require(`assets/images/icons`).default;
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import ModalReset from 'components/ModalReset';
import Image from 'next/image';
import {getAppAssets} from 'whitelabel/whiteLabelInfo';
import {ThemeContext} from 'theme/ThemeContext';

// import { loadingOn } from "redux/auth/authSlice";
// import { ThemeContext } from "../../../../ThemeContext";
// import { useDispatch } from "redux/utils/useDispatch";

const ResetWallet = () => {
  const router = useRouter();
  const [modal, setModal] = useState(true);
  const {themeType} = useContext(ThemeContext);
  const searchParams = useSearchParams();

  // const { theme } = useContext(ThemeContext);
  // const styles = myStyles(theme);
  // const isFromOnBoarding = route?.params?.isFromOnBoarding;
  // const dispatch = useDispatch("ResetWallet");
  // console.log("is from onboard", isFromOnBoarding);

  // useLayoutEffect(() => {
  //   console.log("is from onboard2", isFromOnBoarding);
  //   if (isFromOnBoarding) {
  //     navigation.setOptions({
  //       headerShown: false,
  //     });
  //   } else {
  //     navigation.setOptions({
  //       headerShown: true,
  //     });
  //   }
  // }, [isFromOnBoarding]);

  ///////////////////////////

  return (
    <>
      <div className={styles.container}>
        <div className={styles.infoList}>
          <p className={styles.titleInfo}>Set up</p>
          <p className={styles.titleInfo}>your Wallet </p>
          <p className={styles.info}>
            {
              'A cryptocurrency wallet is simply a virtual wallet used to send, receive and store digital assets such as Bitcoin, Ethereum, BNB and Solana, among others.'
            }
          </p>
          <p className={styles.info}>
            To set up a wallet, we will generate a seed phrase for you,
            consisting of 12 unique words. It is very important that you store
            your seed phrase in a safe place.
          </p>

          <span className={styles.learnText}>
            <Link href='reset-wallet/learn-reset' target='_blank'>
              Learn more
            </Link>
          </span>

          <div className={styles.btnList}>
            <button
              // activeOpacity={1}
              // onPress={() => {
              //   navigation.navigate("CreateWallet");
              //   // if (isFromOnBoarding) {
              //   //   navigation.navigate('VerifyInfoModal');
              //   // } else {
              //   //   setTimeout(() => {
              //   //     dispatch(loadingOn());
              //   //     navigation.push('VerifyInfoModal', {
              //   //       reset: 'CreateWallet',
              //   //     });
              //   //   }, 200);
              //   // }
              // }}
              onClick={() => {
                router.push(
                  `/auth/create-wallet${
                    searchParams ? `?${searchParams}` : ''
                  }`,
                );
              }}
              style={{
                backgroundColor: '#FF4C00',
              }}
              className={styles.btn}>
              <div className={styles.icon_plus}>{icons.plus}</div>
              <div
                className={styles.icon_create}
                style={{width: '113', height: '113'}}>
                {getAppAssets()?.[`wallet_create`]?.[themeType] ? (
                  <Image
                    src={getAppAssets()?.[`wallet_create`]?.[themeType]}
                    width={122}
                    height={124}
                    alt={'create-wallet'}
                  />
                ) : (
                  icons.reset_create
                )}
              </div>
              <div className={styles.textBox}>
                <p style={{color: 'var(--font)'}}>Create</p>
                <p style={{color: 'var(--backgroundColor)'}}>Wallet</p>
              </div>
            </button>

            <button
              // activeOpacity={1}
              // onPress={() =>
              //   navigation.navigate("ImportWallet", {
              //     isAdd: !!isFromOnBoarding,
              //   })
              // }

              onClick={() =>
                router.push(
                  `/auth/import-wallet${
                    searchParams ? `?${searchParams}` : ''
                  }`,
                )
              }
              style={{
                backgroundColor: 'var(--font)',
              }}
              className={styles.btn}>
              <div className={styles.icon_arrow}>
                <svg
                  className={styles.icon_arrow}
                  viewBox='0 0 17 17'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M15.7 8.7002L8.80005 15.7002M1.80005 8.80019L15.7 8.7002L1.80005 8.80019ZM15.7 8.7002L8.70005 1.7002L15.7 8.7002Z'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div
                className={styles.icon_create}
                style={{width: '108', height: '101'}}>
                {getAppAssets()?.[`wallet_import`]?.[themeType] ? (
                  <Image
                    src={getAppAssets()?.[`wallet_import`]?.[themeType]}
                    width={122}
                    height={124}
                    alt={'create-wallet'}
                  />
                ) : (
                  icons.reset_import
                )}
              </div>
              <div className={styles.textBox2}>
                <p
                  style={{
                    color: 'var(--background)',
                  }}>
                  Import
                </p>
                <p
                  style={{
                    color: 'var(--backgroundColor)',
                  }}>
                  Wallet
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetWallet;
