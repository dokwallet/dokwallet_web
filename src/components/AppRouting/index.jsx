'use client';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import s from './AppRouting.module.css';
import {usePathname, useSearchParams} from 'next/navigation';
import ReactGA from 'react-ga4';
import Header from '../Header';
import Sidebar from '../Sidebar';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {getUserPassword} from 'dok-wallet-blockchain-networks/redux/auth/authSelectors';
import {useRouter} from 'next/navigation';
import {
  checkNewsAvailable,
  fetchCurrencies,
} from 'dok-wallet-blockchain-networks/redux/currency/currencySlice';
import {ToastContainer} from 'react-toastify';
import {ThemeContext} from 'theme/ThemeContext';
import {isReduxStoreLoaded} from 'dok-wallet-blockchain-networks/redux/walletConnect/walletConnectSelectors';
import {selectWalletConnectSessions} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {initWalletConnect} from 'dok-wallet-blockchain-networks/service/walletconnect';
import {
  clearWalletConnectStorageCache,
  createAIDIfNotExists,
} from 'utils/localStorageData';
import Loading from '../Loading';
import {getWhiteLabelInfo} from 'dok-wallet-blockchain-networks/service/dokApi';
import {
  getWalletConnectDetails,
  setWhiteLabelInfo,
} from 'whitelabel/whiteLabelInfo';
import {fetchSupportedBuyCryptoCurrency} from 'dok-wallet-blockchain-networks/redux/cryptoProviders/cryptoProviderSlice';
import {
  compareRpcUrls,
  fetchRPCUrl,
} from 'dok-wallet-blockchain-networks/rpcUrls/rpcUrls';
import {
  getDisableMessage,
  getGoogleAnalyticsKey,
} from 'dok-wallet-blockchain-networks/redux/cryptoProviders/cryptoProvidersSelectors';
import DisabledView from 'components/DisabledView';
import {MainNavigation} from 'utils/navigation';
import {getFeesInfo} from 'dok-wallet-blockchain-networks/feesInfo/feesInfo';
import {
  createIfNotExistsMasterClientId,
  resetCoinsToDefaultAddressForPrivacyMode,
  resetIsAdding50MoreAddresses,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import {isLocaleSet, setUserLocale} from 'src/utils/updateLocale';
import {masterClickHost, publicRoutes} from 'utils/common';

function AppRouting({children}) {
  const password = useSelector(getUserPassword);
  const routing = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {themeType} = useContext(ThemeContext);
  const isReduxStoreLoad = useSelector(isReduxStoreLoaded);
  const walletConnectSessions = useSelector(
    selectWalletConnectSessions,
    shallowEqual,
  );
  const [rountingDone, setRoutingDone] = useState(false);
  const [isWhiteLabelInfoFetching, setIsWhiteLabelInfoFetching] =
    useState(true);
  const disableMessage = useSelector(getDisableMessage);
  const googleAnalyticsKey = useSelector(getGoogleAnalyticsKey);
  const googleSiteVerification = useSelector(getGoogleSiteVerification);

  useEffect(() => {
    if (googleAnalyticsKey) {
      ReactGA.initialize(googleAnalyticsKey);
    }
  }, [googleAnalyticsKey]);

  useEffect(() => {
    MainNavigation.setCurrentRouteName(pathname);
  }, [pathname]);

  const fetchFeesInfo = useCallback(() => {
    getFeesInfo().then(_ => {});
  }, []);

  useEffect(() => {
    const setUpWindowHeight = () => {
      const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
      };
      window.addEventListener('resize', appHeight);
      appHeight();
    };
    if (typeof window !== 'undefined') {
      setUpWindowHeight();
    } else {
      setTimeout(() => {
        setUpWindowHeight();
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (isReduxStoreLoad && !isWhiteLabelInfoFetching) {
      dispatch(resetIsAdding50MoreAddresses());
      dispatch(createIfNotExistsMasterClientId());
      let searchString = searchParams?.toString();
      if (
        !pathname?.includes('/auth') &&
        pathname !== '/' &&
        !publicRoutes.includes(pathname)
      ) {
        let redirectRoute = pathname;
        searchString = searchString
          ? `${searchString}&redirectRoute=${redirectRoute}`
          : `redirectRoute=${redirectRoute}`;
      }
      for (const key of searchParams.keys()) {
        if (key?.toLowerCase() === 'aid') {
          createAIDIfNotExists(searchParams.get(key));
        }
      }
      dispatch(resetCoinsToDefaultAddressForPrivacyMode());
      dispatch(fetchSupportedBuyCryptoCurrency({fromDevice: 'web'}));
      dispatch(checkNewsAvailable({key: 'web'}));
      fetchRPCUrl().then(resp => {
        setTimeout(() => {
          compareRpcUrls();
        }, 1000);
      });
      dispatch(fetchCurrencies({}));
      setInterval(
        () => {
          compareRpcUrls();
        },
        1000 * 60 * 10,
      );
      fetchFeesInfo();
      setInterval(
        () => {
          fetchFeesInfo();
        },
        1000 * 60 * 60 * 8,
      );
      const walletConnectData = getWalletConnectDetails();
      if (!Object.keys(walletConnectSessions).length) {
        clearWalletConnectStorageCache().then(() => {
          initWalletConnect(walletConnectData).then();
        });
      } else {
        initWalletConnect(walletConnectData).then();
      }
      let hostname = '';
      if (typeof window !== 'undefined') {
        hostname = window?.location?.hostname;
      }
      if (
        publicRoutes.includes(pathname) &&
        masterClickHost.includes(hostname)
      ) {
        setRoutingDone(true);
      } else {
        if (!password) {
          if (pathname !== '/auth/registration') {
            routing.replace(searchString ? `/?${searchString}` : '/');
          }
        } else {
          routing.replace(
            searchString ? `/auth/login?${searchString}` : `/auth/login`,
          );
        }
        setTimeout(() => {
          setRoutingDone(true);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReduxStoreLoad, isWhiteLabelInfoFetching]);

  useEffect(() => {
    getWhiteLabelInfo()
      .then(async resp => {
        setIsWhiteLabelInfoFetching(false);
        if (resp?.data) {
          setWhiteLabelInfo(resp?.data);
          const localeSetCheck = await isLocaleSet();
          if (!localeSetCheck) {
            setUserLocale(resp?.data?.defaultLocale || 'en');
          }
        }
      })
      .catch(e => {
        console.error('Error in fetching white label info');
        setIsWhiteLabelInfoFetching(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {typeof googleSiteVerification !== 'string' &&
          !!googleSiteVerification && (
            <meta
              name='google-site-verification'
              content={googleSiteVerification}
            />
          )}
        {rountingDone && !disableMessage ? (
          <div className={s.container}>
            <div className={s.navbarWrapper}>{<Header />}</div>
            <div className={s.mainWrapper}>
              <div className={s.side}>
                <aside className={s.sidebarWrapper}>{<Sidebar />}</aside>
              </div>
              <div className={s.main}>{children}</div>
            </div>
          </div>
        ) : disableMessage ? (
          <DisabledView />
        ) : (
          <div className={s.mainContainer}>
            <Loading />
          </div>
        )}
      </div>
      <ToastContainer
        position='bottom-right'
        draggable
        pauseOnHover
        theme={themeType === 'light' ? 'light' : 'dark'}
      />
    </>
  );
}

export default AppRouting;
