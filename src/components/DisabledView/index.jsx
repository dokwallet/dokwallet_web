import * as React from 'react';
import {useSelector} from 'react-redux';
import {getDisableMessage} from 'dok-wallet-blockchain-networks/redux/cryptoProviders/cryptoProvidersSelectors';
import styles from './DisabledView.module.css';
import {useCallback} from 'react';
import {getAppName, getContactUsEmail} from 'whitelabel/whiteLabelInfo';

const DisabledView = () => {
  const message = useSelector(getDisableMessage);

  const onPressContactViaEmail = useCallback(async () => {
    try {
      window.open(`mailto:${getContactUsEmail()}`);
    } catch (e) {
      console.error('error in open emails', e);
    }
  }, []);

  const onPressContactViaTelegram = useCallback(async () => {
    try {
      window.open('https://t.me/dokwallet');
    } catch (e) {
      console.error('error in open Telegram', e);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <p className={styles.messageText}>{message}</p>
      </div>
      <div className={styles.bottomView}>
        <p className={styles.contactText}>
          For more information. Please contact us on via{' '}
          <button
            className={styles.buttonContactText}
            onClick={onPressContactViaEmail}
            onKeyUp={onPressContactViaEmail}
            tabIndex={0}>
            {'Email'}
          </button>{' '}
          {getAppName() === 'dokwallet' && (
            <>
              <span className={styles.contactText}>or </span>
              <button
                className={styles.buttonContactText}
                onClick={onPressContactViaTelegram}
                onKeyUp={onPressContactViaTelegram}
                tabIndex={1}>
                {'Telegram'}
              </button>
            </>
          )}{' '}
          for additional support.
        </p>
      </div>
    </div>
  );
};

export default DisabledView;
