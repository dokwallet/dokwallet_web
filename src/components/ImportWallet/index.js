import React, {useCallback, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import s from './ImportWallet.module.css';
import {TextField} from '@mui/material';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {
  setChainName,
  setPhrase,
  setPrivateKey,
} from 'dok-wallet-blockchain-networks/redux/extraData/extraDataSlice';
import {useDispatch} from 'react-redux';
import {validateMnemonic} from 'bip39';
import GoBackButton from '../GoBackButton';
import {fetchWordsStartingWith} from 'dok-wallet-blockchain-networks/helper';
import englishMnemonics from 'bip39/src/wordlists/english.json';
const ImportWallet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [suggestionMnemonic, setSuggestionMnemonic] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {phrase: ''},
    validationSchema: Yup.object().shape({
      phrase: Yup.string().required('Seed phrase is required'),
    }),
    onSubmit: async values => {
      const finalPhrase = values.phrase.split(/\s+/).join(' ');
      if (validateMnemonic(finalPhrase?.trim())) {
        dispatch(setPhrase(finalPhrase?.trim()));
        dispatch(setPrivateKey(null));
        dispatch(setChainName(null));
        const pathname = `/${path.split('/')[1]}`;
        const searchParamsStr = `${searchParams ? `?${searchParams}` : ''}`;
        if (pathname === '/auth') {
          router.push(`/auth/create-wallet${searchParamsStr}`);
        } else {
          router.push(`/wallets/create-wallet${searchParamsStr}`);
        }
      } else {
        formik.setFieldError('phrase', 'Invalid seed phrase');
      }
    },
  });

  const onPressImportPrivateKey = useCallback(() => {
    const pathname = `/${path.split('/')[1]}`;
    const searchParamsStr = `${searchParams ? `?${searchParams}` : ''}`;
    if (pathname === '/auth') {
      router.push(`/auth/import-wallet-by-private-key${searchParamsStr}`);
    } else {
      router.push(`/wallets/import-wallet-by-private-key${searchParamsStr}`);
    }
  }, [path, router, searchParams]);

  const onPressMnemonicWord = useCallback(
    word => {
      const phrase = formik.values.phrase;
      const wordsArray = phrase.split(/\s+/);
      wordsArray.pop();
      wordsArray.push(word);
      const finalText = wordsArray.join(' ') + ' ';
      formik.setFieldValue('phrase', finalText);
      setSuggestionMnemonic([]);
    },
    [formik],
  );

  const findMnemonicsValue = useCallback(text => {
    if (text.length >= 2) {
      setSuggestionMnemonic(fetchWordsStartingWith(englishMnemonics, text));
    } else {
      setSuggestionMnemonic([]);
    }
  }, []);

  return (
    <div className={s.container}>
      <div>
        <GoBackButton />
      </div>
      <div className={s.formInput}>
        <p className={s.title}>Import</p>
        <p className={s.title}>your Wallet</p>
        <p className={s.listTitle}>
          Enter your 12-word seed phrase bellow to restore your crypto wallet.
        </p>

        <TextField
          className={s.input}
          multiline
          rows={7}
          maxRows={12}
          autoComplete={'off'}
          spellCheck={false}
          label='Enter seed phrase'
          variant='outlined'
          maxLength={150}
          sx={{
            // color: formik.errors.phrase ? "red" : "var(--gray)",
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: formik.errors.phrase ? 'red' : 'var(--gray)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: formik.errors.phrase
                ? 'red'
                : 'var(--borderActiveColor)',
            },
            '& .MuiInputLabel-outlined': {
              color: formik.errors.phrase ? 'red' : 'var(--gray)',
            },
          }}
          name='phrase'
          onChange={event => {
            const text = event.target.value;
            const lowerCaseStr = text.toLowerCase();
            formik.setFieldValue('phrase', lowerCaseStr);
            const lastWord = lowerCaseStr.split(' ').pop();
            findMnemonicsValue(lastWord);
          }}
          onBlur={formik.handleBlur('phrase')}
          value={formik.values.phrase}
          onSubmit={formik.handleSubmit}
        />
        {formik.errors.phrase && formik.touched.phrase && (
          <p className={s.textConfirm}>{formik.errors.phrase}</p>
        )}
        <div
          className={
            suggestionMnemonic?.length
              ? s.suggestionWordContainer
              : s.hideSuggestionWordContainer
          }>
          {suggestionMnemonic.map(item => (
            <button
              key={item}
              className={s.wordButtonStyle}
              onClick={() => onPressMnemonicWord(item)}>
              <p className={s.wordButtonText}>{item}</p>
            </button>
          ))}
        </div>

        <button className={s.button} onClick={formik.handleSubmit}>
          <p className={s.buttonTitle}>Import</p>
        </button>
        <button className={s.button} onClick={onPressImportPrivateKey}>
          <p className={s.buttonTitle}>Import Wallet by private key</p>
        </button>
        <p className={s.info}>
          Your Private Key will be encrypted and stored on this device.
        </p>
      </div>
    </div>
  );
};

export default ImportWallet;
