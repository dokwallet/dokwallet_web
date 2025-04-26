import {useMemo} from 'react';
import {
  checkValidChainForWalletImportWithPrivateKey,
  generateUniqueKeyForChain,
} from 'dok-wallet-blockchain-networks/helper';

export function useGroupCoins({
  currentWallet,
  userCoins,
  group,
  isAddingGroup,
}) {
  const isGroupCoinsAdded = useMemo(() => {
    const tempCoins = group?.coins || [];
    return tempCoins.every(coin => {
      const currentKey = generateUniqueKeyForChain(coin);
      return !!userCoins?.find(activeCoin => {
        const activeCoinKey = generateUniqueKeyForChain(activeCoin);
        return currentKey === activeCoinKey;
      });
    });
  }, [group?.coins, userCoins]);

  const isAdding = useMemo(() => {
    return isAddingGroup[group?._id];
  }, [isAddingGroup, group?._id]);

  const isDisabledItem = useMemo(() => {
    const tempCoins = group?.coins || [];
    return !tempCoins.every(coin =>
      checkValidChainForWalletImportWithPrivateKey({
        currentWallet,
        currentCoin: coin,
      }),
    );
  }, [group?.coins, currentWallet]);
  return {isGroupCoinsAdded, isAdding, isDisabledItem};
}
