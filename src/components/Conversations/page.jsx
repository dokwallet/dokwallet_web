'use client';
import {useRouter} from 'next/navigation';
import styles from './Conversations.module.css';
import {KeyboardArrowRight} from '@mui/icons-material';
import {
  getCustomizePublicAddress,
  getTimeOrDateAsPerToday,
} from 'dok-wallet-blockchain-networks/helper';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {setSelectedConversation} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {getConversations} from 'dok-wallet-blockchain-networks/redux/messages/messageSelector';

const Conversations = props => {
  const {children, value, index, isRequest, ...other} = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const conversations = useSelector(getConversations, shallowEqual);

  const filterConversations = useMemo(() => {
    return conversations?.filter(conversation => {
      return isRequest
        ? conversation.consentState === 'unknown'
        : conversation.consentState === 'allowed';
    });
  }, [conversations, isRequest]);

  const handleClickItem = useCallback(
    item => {
      dispatch(
        setSelectedConversation({
          address: item.clientAddress,
          topic: item.topic,
        }),
      );
      router.push('/chats/chat');
    },
    [dispatch, router],
  );

  return (
    <div
      className={styles.chatsContainer}
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      <div>
        <div className={styles.messageListWrapper}>
          {filterConversations?.length > 0 ? (
            filterConversations?.map((item, index) => (
              <div
                key={index}
                className={styles.messageListItem}
                onClick={() => handleClickItem(item)}>
                <div className={styles.headerWrapper}>
                  <div className={styles.itemHeader}>
                    <h5>{getCustomizePublicAddress(item?.peerAddress)}</h5>
                    <h4>
                      {item?.lastMessage?.createdAt || item?.createdAt
                        ? getTimeOrDateAsPerToday(
                            item?.lastMessage?.createdAt || item?.createdAt,
                          )
                        : ''}
                    </h4>
                  </div>
                  <h3 className={styles.lastMsgText}>
                    {item?.lastMessage?.text || 'No message yet'}
                  </h3>
                </div>
                <KeyboardArrowRight className={styles.rightArrowIcon} />
              </div>
            ))
          ) : (
            <div className={styles.noConversationWrapper}>
              <div>No conversations yet</div>
              <div className={styles.newChatSubTitle}>
                Start conversation by clicking on New Chat
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
