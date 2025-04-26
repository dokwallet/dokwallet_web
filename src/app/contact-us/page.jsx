'use client';
import React, {useCallback} from 'react';
import WalletConnectItem from 'components/WalletConnectItem';
import styles from './ContactUs.module.css';
import {toast} from 'react-toastify';
import {getAppName, getContactUsEmail} from 'src/whitelabel/whiteLabelInfo';

const ContactUs = () => {
  const handleContactViaEmail = useCallback(() => {
    try {
      window.open(`mailto:${getContactUsEmail()}`);
    } catch (e) {
      console.error('error in open emails', e);
      toast.error(`Couldn't open an email client`);
    }
  }, []);

  const onPressContactViaTelegram = useCallback(() => {
    try {
      window.open('https://t.me/dokwallet');
    } catch (e) {
      console.error('error in open Telegram', e);
      toast.error(`Couldn't open a telegram`);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.contentContainerStyle}>
        <div className={styles.title}>
          Have questions or feedback? Reach out to us! Our team is here to
          assist you with any inquiries. Contact us today, and we&apos;ll be in
          touch shortly.
        </div>
        <div className={styles.btnWrapper}>
          <button className={styles.button} onClick={handleContactViaEmail}>
            <div className={styles.buttonTitle}>{'Contact via Email'}</div>
          </button>
        </div>
        {getAppName() === 'dokwallet' && (
          <>
            <div className={styles.descriptions}>{'OR'}</div>
            <div className={styles.btnWrapper}>
              <button
                className={styles.button}
                onClick={onPressContactViaTelegram}>
                <div className={styles.buttonTitle}>
                  {'Contact via Telegram'}
                </div>
              </button>
            </div>
          </>
        )}
        <div className={styles.borderView} />
        <WalletConnectItem />
      </div>
    </div>
  );
};

export default ContactUs;
