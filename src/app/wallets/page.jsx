'use client';

import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  getCurrentWalletIndex,
  selectAllWallets,
  selectCurrentWallet,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSelector';
import {
  rearrangeWallet,
  refreshCoins,
  setCurrentWalletIndex,
  setWalletPosition,
} from 'dok-wallet-blockchain-networks/redux/wallets/walletsSlice';
import Image from 'next/image';
import s from './Wallets.module.css';
import {useRouter} from 'next/navigation';
import ModalCreateWallet from 'components/ModalCreateWallet';
import {resetPaymentUrl} from 'dok-wallet-blockchain-networks/redux/settings/settingsSlice';
import {getPngIcons} from 'assets/images/icons/pngIcon';
import {ThemeContext} from 'theme/ThemeContext';
import icons from 'src/assets/images/icons';
import {moveItem} from 'dok-wallet-blockchain-networks/helper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {closestCenter, DndContext} from '@dnd-kit/core';
import {restrictToParentElement} from '@dnd-kit/modifiers';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import SortableItem from 'components/Sortable/sortable';
import {getAppIcon} from 'whitelabel/whiteLabelInfo';

function getStyle(style) {
  if (style.transform) {
    const axisLockY =
      'translate(0px' +
      style.transform.slice(
        style.transform.indexOf(','),
        style.transform.length,
      );
    return {
      ...style,
      transform: axisLockY,
    };
  }
  return style;
}

const disabledStyle = {
  filter: 'opacity(0.5) drop-shadow(0 0 0 gray)',
  cursor: 'not-allowed',
};

const Wallets = () => {
  const currentWalletName = useSelector(selectCurrentWallet)?.walletName;
  const allWallets = useSelector(selectAllWallets);
  const currentWalletIndex = useSelector(getCurrentWalletIndex);
  const allWalletsLength = useMemo(() => {
    return allWallets.length;
  }, [allWallets]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalVisible, setmodalVisible] = useState(false);
  const {themeType} = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchWallets, setSearchWallets] = useState([]);
  const PngIcons = getPngIcons(themeType);

  const handleSearch = useCallback(
    e => {
      const text = e?.target?.value;
      setSearchQuery(text);
      if (text) {
        const newList = allWallets?.filter(item => {
          return item?.walletName?.toLowerCase()?.includes(text?.toLowerCase());
        });
        setSearchWallets(newList);
      } else {
        setSearchWallets([]);
      }
    },
    [allWallets],
  );

  const onPressMove = useCallback(
    (index, isMoveUp) => {
      dispatch(setWalletPosition({index, isMoveUp}));
    },
    [dispatch],
  );

  const onDragEnd = event => {
    const {active, over} = event;
    if (!over || active.id === over.id) {
      return;
    }

    const from = active?.data?.current.sortable?.index;
    const to = over?.data?.current.sortable?.index;

    // Reorder the list
    const reorderedItems = moveItem(allWallets, from, to);

    // Storing the udated list order
    const isMoveDown = to > from;
    dispatch(
      rearrangeWallet({
        allWallets: reorderedItems,
        currentWalletIndex:
          from === currentWalletIndex
            ? to
            : isMoveDown &&
                to >= currentWalletIndex &&
                from < currentWalletIndex
              ? currentWalletIndex - 1
              : !isMoveDown &&
                  to <= currentWalletIndex &&
                  from > currentWalletIndex
                ? currentWalletIndex + 1
                : undefined,
      }),
    );
  };

  const walletList = searchQuery ? searchWallets : allWallets;
  const uniqueIds = useMemo(() => {
    return walletList.map(item => item?.id);
  }, [walletList]);
  return (
    <div className={s.container}>
      <button className={s.button} onClick={() => setmodalVisible(true)}>
        <p className={s.buttonTitle}>Create new Wallet</p>
      </button>
      <TextField
        placeholder='Search'
        variant='outlined'
        id='search-bar'
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'var(--gray)',
            },
          '& .MuiOutlinedInput-root': {
            border: '1px solid var(--gray)',
            borderRadius: '10px',
            marginBottom: '10px',
            fontSize: '18px',
            marginTop: '20px',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <IconButton type='submit' aria-label='search'>
                <SearchIcon
                  sx={{
                    color: 'gray',
                    marginRight: '10px',
                  }}
                />
              </IconButton>
            ),
            endAdornment: searchQuery && (
              <IconButton
                onClick={() => handleSearch({target: {value: ''}})}
                size='small'
                sx={{
                  color: 'gray',
                }}>
                <ClearIcon />
              </IconButton>
            ),
          },
        }}
      />
      <div className={s.walletSection}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          modifiers={[restrictToParentElement]}>
          <SortableContext
            items={uniqueIds}
            strategy={verticalListSortingStrategy}>
            <ul>
              {walletList.map((item, index) => {
                const isSelectedWallet = item.walletName === currentWalletName;
                return (
                  <SortableItem key={item.id} id={item.id}>
                    {dragHandleProps => (
                      <li className={s.walletBox} key={`li_${item.id}`}>
                        <div className={s.dragContainer}>
                          {!searchQuery && (
                            <span
                              {...dragHandleProps}
                              style={{cursor: 'grab', marginRight: 10}}>
                              {icons.dragVertical}
                            </span>
                          )}
                          <button
                            className={s.walletList}
                            onClick={() => {
                              dispatch(refreshCoins());
                              dispatch(resetPaymentUrl());
                              if (searchQuery) {
                                const foundIndex = allWallets.findIndex(
                                  subItem =>
                                    subItem.walletName === item.walletName,
                                );
                                if (foundIndex !== -1) {
                                  dispatch(setCurrentWalletIndex(foundIndex));
                                }
                              } else {
                                dispatch(setCurrentWalletIndex(index));
                              }
                              router.push('/home');
                            }}>
                            <div className={s.avatarWrapper}>
                              <Image
                                className={s.avatarAvatar}
                                alt='avatar'
                                width={54}
                                height={54}
                                src={getAppIcon()}
                              />

                              {item?.walletName === currentWalletName && (
                                <span className={s.badge}>&#10004;</span>
                              )}
                            </div>

                            <div className={s.textContainer}>
                              <p
                                className={s.mainText}
                                style={
                                  isSelectedWallet
                                    ? {
                                        color: 'var(--background)',
                                        fontWeight: 'bold',
                                      }
                                    : {}
                                }>
                                {item?.walletName}
                              </p>
                              <p
                                className={s.secondaryText}
                                style={
                                  isSelectedWallet
                                    ? {
                                        color: 'var(--font)',
                                        fontWeight: 'bold',
                                      }
                                    : {}
                                }>
                                {item?.isImportWalletWithPrivateKey
                                  ? `${item?.coins?.[0]?.chain_display_name || ''} Wallet`
                                  : 'Multi - Coin Wallet'}
                              </p>
                            </div>
                          </button>
                        </div>
                        <div className={s.rightButtonContainer}>
                          {allWalletsLength > 1 && !searchQuery && (
                            <>
                              <button
                                disabled={index === 0}
                                className={s.boxBtn}
                                onClick={() => {
                                  onPressMove(index, true);
                                }}>
                                <Image
                                  style={index === 0 && disabledStyle}
                                  src={PngIcons.UpArrow}
                                  alt={'Up arrow'}
                                  width={24}
                                  height={24}
                                />
                              </button>
                              <button
                                disabled={index === allWalletsLength - 1}
                                className={s.boxBtn}
                                onClick={() => {
                                  onPressMove(index, false);
                                }}>
                                <Image
                                  src={PngIcons.DownArrow}
                                  alt={'Down arrow'}
                                  width={24}
                                  height={24}
                                  style={
                                    index === allWalletsLength - 1 &&
                                    disabledStyle
                                  }
                                />
                              </button>
                            </>
                          )}

                          <button
                            className={s.boxBtn}
                            onClick={() => {
                              const walletName = item?.walletName;
                              const walletIndex = index;
                              router.push(
                                `/wallets/create-wallet?walletName=${walletName}&walletIndex=${walletIndex}`,
                              );
                            }}>
                            <Image
                              src={PngIcons.MenuVertical}
                              alt={'Menu vertical'}
                              width={24}
                              height={24}
                            />
                          </button>
                        </div>
                      </li>
                    )}
                  </SortableItem>
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
      <ModalCreateWallet
        visible={modalVisible}
        hideModal={() => setmodalVisible(false)}
      />
    </div>
  );
};

export default Wallets;
