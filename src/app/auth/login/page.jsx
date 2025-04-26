'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import {Formik} from 'formik';
import styles from './LoginScreen.module.css';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import {validationSchemaLogin} from 'utils/validationSchema';
import ModalReset from 'components/ModalReset';
import {useRouter, useSearchParams} from 'next/navigation';
import {VerifyInfoModal} from 'components/VerifyInfo';
// import {
//   logInSuccess,
//   fingerprintAuthSuccess,
//   loadingOff,
//   loadingOn,
// } from 'dok-wallet-blockchain-networks/redux/auth/authSlice';
//
// import {validationSchemaLogin} from 'utils/validationSchema';
// import {isFingerprint} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';
// import FingerprintScanner from 'react-native-fingerprint-scanner';
// import {IS_IOS, useFloatingHeight} from 'dok-wallet-blockchain-networks/service/dimensions';
// import {ThemeContext} from '../../../../ThemeContext';
// import myStyles from './LoginScreenStyles';
import {
  loadingOff,
  logInSuccess,
  logOutSuccess,
} from 'dok-wallet-blockchain-networks/redux/auth/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getUserPassword} from 'dok-wallet-blockchain-networks/redux/auth/authSelectors';
import {selectAllWallets} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {refreshCoins} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import {getAppSubTitle} from 'whitelabel/whiteLabelInfo';
// import RNScreenshotPrevent from 'react-native-screenshot-prevent';

const LoginScreen = () => {
  const [hide, setHide] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [wrong, setWrong] = useState(false);
  const router = useRouter();
  const buttonRef = useRef();

  //   const {theme} = useContext(ThemeContext);
  //   const styles = myStyles(theme);

  const dispatch = useDispatch();
  //   const [wrong, setWrong] = useState(false);
  const storePassword = useSelector(getUserPassword);
  //   const fingerprint = useSelector(isFingerprint);
  //   const isFinger = useSelector(getFingerprintAuth);
  //   const floatingBtnHeight = useFloatingHeight();
  const allWallets = useSelector(selectAllWallets);
  const searchParams = useSearchParams();

  //   useEffect(() => {
  //     RNScreenshotPrevent.enabled(true);
  //     if (IS_IOS && !__DEV__) {
  //       RNScreenshotPrevent.enableSecurediv();
  //     }
  //     return () => {

  //     };
  //   }, []);

  //   useEffect(() => {
  //     dispatch(loadingOff());
  //     setTimeout(() => {
  //       handleFingerprintAuth();
  //     }, 200);
  //   }, [dispatch, handleFingerprintAuth]);

  //   useEffect(() => {
  //     if (!isFinger) {
  //       handleFingerprintAuth();
  //     }
  //   }, [isFinger, handleFingerprintAuth]);

  const hasWallet = useCallback(() => {
    return allWallets?.length !== 0;
  }, [allWallets]);

  //   const handleFingerprintAuth = useCallback(async () => {
  //     if (fingerprint) {
  //       try {
  //         const isAuth = await FingerprintScanner.authenticate({
  //           description: 'Unlock Dok Wallet with your fingerprint',
  //         });

  //         dispatch(fingerprintAuthSuccess(isAuth));
  //         if (hasWallet()) {
  //           console.log('hasWallet: in login', hasWallet());
  //           dispatch(loadingOn());
  //           setTimeout(() => {
  //             navigation.reset({
  //               index: 0,
  //               routes: [{name: 'Sidebar'}],
  //             });
  //             dispatch(loadingOff());
  //           }, 200);
  //         } else {
  //           dispatch(loadingOn());
  //           navigation.reset({
  //             index: 0,
  //             routes: [{name: 'ResetWallet', params: {isFromOnBoarding: true}}],
  //           });
  //         }
  //       } catch (error) {
  //         if (error.name === 'SystemCancel') {
  //           console.log('Authentication was canceled by the system');
  //         } else {
  //           console.log('Error checking fingerprint settings:', error);
  //         }
  //       } finally {
  //         FingerprintScanner.release();
  //       }
  //     }
  //   }, [dispatch, fingerprint, navigation, hasWallet]);

  //   const handleSubmit = values => {
  //     Keyboard.dismiss();
  //     if (storePassword === values.password) {
  //       console.log('Login successful');
  //       dispatch(fingerprintAuthSuccess(true));
  //       dispatch(logInSuccess(values.password));
  //       if (hasWallet()) {
  //         console.log('hasWallet: in login', hasWallet());
  //         dispatch(loadingOff());
  //         navigation.reset({
  //           index: 0,
  //           routes: [{name: 'Sidebar'}],
  //         });
  //       } else {
  //         navigation.reset({
  //           index: 0,
  //           routes: [{name: 'ResetWallet', params: {isFromOnBoarding: true}}],
  //         });
  //       }
  //     } else {
  //       console.log('Wrong password');
  //       setWrong(true);
  //       dispatch(loadingOff());
  //     }
  //   };
  /////////////////////////
  const handleReset = useCallback(() => {
    setShowResetModal(true);
  }, []);

  const onClickLogin = useCallback(
    values => {
      if (storePassword === values.password) {
        dispatch(logInSuccess(values.password));
        if (hasWallet()) {
          const redirectRoute = searchParams?.get('redirectRoute');
          let searchParamsString = '';
          for (const key of searchParams.keys()) {
            if (key !== 'redirectRoute') {
              searchParamsString += `${key}=${searchParams.get(key)}&`;
            }
          }
          router.replace(
            redirectRoute
              ? `${redirectRoute}${
                  searchParamsString ? '?' + searchParamsString : ''
                }`
              : `/home${searchParamsString ? '?' + searchParamsString : ''}`,
          );
          dispatch(refreshCoins());
        } else {
          router.replace('/auth/reset-wallet');
        }
      } else {
        setWrong(true);
        dispatch(loadingOff());
      }
    },
    [dispatch, hasWallet, router, searchParams, storePassword],
  );

  const onKeyDown = useCallback(e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      buttonRef.current?.focus?.();
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <p className={styles.brand}>{getAppSubTitle()}</p>
        <p className={styles.title}>Sign in</p>
        <Formik
          initialValues={{password: ''}}
          validationSchema={validationSchemaLogin}
          onSubmit={onClickLogin}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <form className={styles.formInput} onSubmit={handleSubmit}>
              <FormControl sx={{m: 1, width: '25ch'}} variant='outlined'>
                <InputLabel
                  sx={{
                    color:
                      errors.password && touched.password
                        ? 'red'
                        : 'var(--borderActiveColor)',
                  }}
                  focused={false}>
                  Password
                </InputLabel>
                <OutlinedInput
                  autoFocus={true}
                  id='password'
                  onKeyDown={onKeyDown}
                  type={!hide ? 'text' : 'password'}
                  name='password'
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setHide(!hide)}
                        edge='end'
                        sx={{
                          '&  .MuiSvgIcon-root': {
                            color: 'var(--borderActiveColor) ',
                          },
                        }}>
                        {!hide ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor:
                        errors.password && touched.password
                          ? 'red'
                          : 'var(--sidebarIcon)',
                    },

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor:
                        errors.password && touched.password
                          ? 'red'
                          : 'var(--borderActiveColor)',
                    },

                    '& .MuiInputLabel-outlined': {
                      color:
                        errors.password && touched.password
                          ? 'red'
                          : 'var(--sidebarIcon)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--sidebarIcon) !important',
                    },
                  }}
                />
              </FormControl>

              {errors.password && touched.password ? (
                <p className={styles.textConfirm}>{errors.password}</p>
              ) : null}
              {wrong === true && (
                <p className={styles.textWarning}>
                  * You have entered an invalid password
                </p>
              )}

              <button className={styles.button} type='submit' ref={buttonRef}>
                Sign in
              </button>
            </form>
          )}
        </Formik>
        <div className={styles.reset}>
          <p className={styles.resetTitle}>Forgot you password?</p>
          <button
            className={styles.resetText}
            onClick={handleReset}
            type='submit'>
            Reset your wallet by using you seed phrase
          </button>
        </div>
      </div>

      <ModalReset
        visible={showResetModal}
        hideModal={setShowResetModal}
        page={'Forgot'}
      />
    </>
  );
};

export default LoginScreen;
