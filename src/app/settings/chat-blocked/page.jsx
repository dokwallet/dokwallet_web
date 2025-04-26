'use client';
import styles from './ChatBlocked.module.css';
import {getCustomizePublicAddress} from 'dok-wallet-blockchain-networks/helper';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  getConversation,
  updateConsentState,
} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {
  getConversations,
  isFetchingConversations,
} from 'dok-wallet-blockchain-networks/redux/messages/messageSelector';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';

const ChatBlocked = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(getConversations, shallowEqual);
  const isFetching = useSelector(isFetchingConversations);
  const isButtonClicked = useRef(false);

  const filterConversations = useMemo(() => {
    return conversations?.filter(conversation => {
      return conversation.consentState === 'denied';
    });
  }, [conversations]);

  const fetchConversations = useCallback(() => {
    dispatch(getConversation());
  }, [dispatch]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div>
      <PageTitle title='Blockchain Chat Blocked' />
      <div>
        {isFetching && !isButtonClicked.current ? (
          <Loading />
        ) : (
          <div className={styles.messageListWrapper}>
            {filterConversations?.length > 0 ? (
              filterConversations?.map((item, index) => (
                <div key={index} className={styles.messageListItem}>
                  <div className={styles.headerWrapper}>
                    <div className={styles.itemHeader}>
                      <h5>{getCustomizePublicAddress(item?.peerAddress)}</h5>
                    </div>
                  </div>
                  <button
                    className={styles.blockButton}
                    onClick={() => {
                      isButtonClicked.current = true;
                      dispatch(
                        updateConsentState({
                          peerAddress: item?.peerAddress,
                          topic: item?.topic,
                          address: item?.clientAddress,
                          consentState: 'allowed',
                        }),
                      );
                    }}>
                    <p className={styles.buttonTitle}>Unblock</p>
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noConversationWrapper}>
                <div>No blocked conversation yet</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBlocked;
