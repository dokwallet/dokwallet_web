'use client';
import Link from 'next/link';
import styles from './LearnReset.module.css';

// import {ThemeContext} from '../../../../../ThemeContext';
// import {InAppBrowser} from 'react-native-inappbrowser-reborn';
// import {inAppBrowserOptions} from 'dok-wallet-blockchain-networks/config/config';

const LearnReset = () => {
  //   const {theme} = useContext(ThemeContext);
  //   const styles = myStyles(theme);

  return (
    <div className={styles.container}>
      <div className={styles.infoList}>
        <p className={styles.titleInfo}>Seed Phrase</p>
        <p className={styles.info}>
          A seed phrase, seed recovery phrase or backup seed phrase is a list of
          words which stores all the information needed to recover your digital
          assets.
        </p>
        <p className={styles.info}>
          Wallet software wiil typically generate a seed phrase and instruct the
          user to write it down on paper.
        </p>
        <p className={styles.info}>
          If the user&apos;s computer breaks or their hard drive becomes
          corrupted, they can download the same wallet software again and use
          the paper backup to get their digital assets back.
        </p>
        <p className={styles.span}>
          Anybody else who discovers the phrase can steal the coins, so it must
          be kept safe like jewels cash.
        </p>

        <span className={styles.learnText}>
          <Link href='https://en.bitcoin.it/wiki/Seed_phrase' target='_blank'>
            https://en.bitcoin.it/wiki/Seed_phrase
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LearnReset;
