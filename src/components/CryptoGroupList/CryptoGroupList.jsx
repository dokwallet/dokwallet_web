import React, {useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectCurrentWallet,
  selectUserCoins,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {isAddingGroup} from 'dok-wallet-blockchain-networks/redux/currency/currencySelectors';
import {addCoinGroup} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import CryptoGroupItem from '../CrytoGroupItem/CryptoGroupItem';
import CoinGroupInfoModal from '../CoinGroupInfo/index';

const CryptoGroupList = ({list, onEndReached, contentContainerStyle}) => {
  const userCoins = useSelector(selectUserCoins);
  const currentWallet = useSelector(selectCurrentWallet);
  const isAddGroup = useSelector(isAddingGroup);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const dispatch = useDispatch();

  const onPressItem = useCallback(item => {
    setSelectedGroupId(item?._id);
    setIsInfoModalOpen(true);
  }, []);

  const onDismiss = useCallback(() => {
    setIsInfoModalOpen(false);
  }, []);

  const onPressAddItem = useCallback(
    item => {
      dispatch(addCoinGroup(item));
    },
    [dispatch],
  );

  return (
    <>
      <div style={contentContainerStyle}>
        {list.map((item, index) => (
          <CryptoGroupItem
            key={item?._id}
            item={item}
            index={index}
            currentWallet={currentWallet}
            userCoins={userCoins}
            onPressItem={onPressItem}
            onPressAddItem={onPressAddItem}
            isAddingGroup={isAddGroup}
          />
        ))}
      </div>
      <CoinGroupInfoModal
        visible={isInfoModalOpen}
        onDismiss={onDismiss}
        groups={list}
        selectedGroupId={selectedGroupId}
        isAddingGroup={isAddGroup}
        onPressAddItem={onPressAddItem}
        currentWallet={currentWallet}
        userCoins={userCoins}
      />
    </>
  );
};

export default CryptoGroupList;
