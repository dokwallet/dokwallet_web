'use client';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentCoin} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import Transactions from 'components/Transactions';
import ModalSortTransactions from 'components/ModalSortTransactions';
const copyIcon = require(`assets/images/icons`).default;
import {getLocalCurrency} from 'dok-wallet-blockchain-networks/redux/settings/settingsSelectors';
import s from './Transactions.module.css';
import {refreshCurrentCoin} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import Loading from 'components/Loading';
import PageTitle from 'components/PageTitle';
import {popupCenter} from 'utils/common';
import {
  getAddressDetailsUrl,
  isPendingTransactionSupportedChain,
} from 'dok-wallet-blockchain-networks/helper';
import {useRouter} from 'next/navigation';

const TransactionsList = () => {
  const dispatch = useDispatch();
  const localCurrency = useSelector(getLocalCurrency);
  const currentCoin = useSelector(selectCurrentCoin);
  const allTransactions = currentCoin?.transactions;

  const [modalVisible, setmodalVisible] = useState(false);
  const [filter, setFilter] = useState('None');
  const [sort, setSort] = useState('Date Descending');
  const [renderList, setRenderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const coinId =
    currentCoin?.address + currentCoin?.name + currentCoin?.chain_name;

  const isSupportUpdateTransaction = useMemo(() => {
    return (
      isPendingTransactionSupportedChain(currentCoin?.chain_name) &&
      currentCoin?.type === 'coin'
    );
  }, [currentCoin?.chain_name, currentCoin?.type]);

  const onPressUpdateTransaction = useCallback(() => {
    router.push('/home/transactions/update-transaction');
  }, [router]);

  useEffect(() => {
    if (currentCoin?.address) {
      dispatch(refreshCurrentCoin({fetchTransaction: true}))
        .unwrap()
        .then(() => {
          setIsLoading(false);
        })
        .catch(e => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinId, dispatch]);

  useEffect(() => {
    setRenderList(allTransactions);
  }, [currentCoin, allTransactions]);

  const onPressViewAll = useCallback(() => {
    const chain_name = currentCoin?.chain_name;
    const type = currentCoin?.type;
    const address = currentCoin?.address;
    if (chain_name && type && address) {
      const url = getAddressDetailsUrl(chain_name, type, address);
      if (url) {
        popupCenter({
          url,
        });
      }
    }
  }, [currentCoin?.address, currentCoin?.chain_name, currentCoin?.type]);

  const onPressApply = useCallback(
    (sortValue, filterValue) => {
      const mineAddress = currentCoin?.address;
      setSort(sortValue);
      setFilter(filterValue);
      const allTempTransactions = Array.isArray(allTransactions)
        ? [...allTransactions]
        : [];
      const parseTransaction = JSON.parse(JSON.stringify(allTempTransactions));

      const filterTempTransactions = parseTransaction.filter(mainTran => {
        if (filterValue === 'None') {
          return true;
        } else if (filterValue === 'Received') {
          return mineAddress?.toUpperCase() === mainTran?.to?.toUpperCase();
        } else if (filterValue === 'Send') {
          return mineAddress?.toUpperCase() === mainTran?.from?.toUpperCase();
        } else if (filterValue === 'Pending') {
          return mainTran.status?.toUpperCase() !== 'SUCCESS';
        }
      });
      const sortedData = filterTempTransactions?.sort(function (a, b) {
        if (sortValue === 'Date Descending') {
          return new Date(b.date) - new Date(a.date);
        } else if (sortValue === 'Date Ascending') {
          return new Date(a.date) - new Date(b.date);
        } else if (sortValue === 'Amount Ascending') {
          return Number(a.amount) - Number(b.amount);
        } else if (sortValue === 'Amount Descending') {
          return Number(b.amount) - Number(a.amount);
        }
      });
      setRenderList(sortedData);
    },
    [currentCoin?.address, allTransactions],
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <PageTitle title='Transaction History' />
          <div className={s.viewAllTransactionContainer}>
            <div>
              <div className={s.rowView}>
                <p className={s.titleTrans}>Transactions</p>
                {isSupportUpdateTransaction && (
                  <button
                    className={s.viewButton}
                    onClick={onPressUpdateTransaction}>
                    <p className={s.viewButtonText}>{'Update transaction'}</p>
                  </button>
                )}
              </div>
              <div className={s.rowView}>
                <p className={s.address}>Your last 20 transactions</p>
                <button className={s.viewButton} onClick={onPressViewAll}>
                  <p className={s.viewButtonText}>{'View all'}</p>
                </button>
              </div>
            </div>
            <div className={s.borderBox}>
              <div className={s.sortList}>
                <div>
                  <p className={s.sortTitle}>Sort by:</p>
                  <p className={s.titleItem}>{sort}</p>

                  {filter !== 'None' && (
                    <div>
                      <p className={s.sortTitle}>Filter by:</p>
                      <p className={s.titleItem}>{filter}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => setmodalVisible(true)}>
                  <div style={{fill: 'var(--font)'}}>{copyIcon.filter}</div>
                </button>
              </div>
            </div>
            <Transactions
              renderList={renderList}
              currentCoin={currentCoin}
              localCurrency={localCurrency}
            />
            <ModalSortTransactions
              visible={modalVisible}
              hideModal={() => setmodalVisible(false)}
              onPressAppy={onPressApply}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TransactionsList;
