/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import PageTitle from 'src/components/PageTitle';
import styles from './Chat.module.css';
import {
  getCustomizePublicAddress,
  isContainsURL,
} from 'dok-wallet-blockchain-networks/helper';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  getMessage,
  getMoreMessages,
} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {XMTP} from 'src/utils/xmtp';
import {
  getMessageData,
  getSelectedConversations,
  isFetchingMessages,
  isFetchingMoreMessages,
} from 'dok-wallet-blockchain-networks/redux/messages/messageSelector';
import {getMessageAllowUrls} from 'dok-wallet-blockchain-networks/redux/cryptoProviders/cryptoProvidersSelectors';
import {showToast} from 'src/utils/toast';
import Loading from 'src/components/Loading';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import Messages from 'src/components/Messages';
import MessagePopOver from 'components/MessagePopover';
import {ContentTypeCustomReply} from 'src/utils/xmtpContentReplyType';
import TextareaAutosize from 'react-textarea-autosize';

const Chat = () => {
  const router = useRouter();
  const totalMsgRef = useRef(0);
  const conversation = useSelector(getSelectedConversations, shallowEqual);
  const dispatch = useDispatch();
  const messageData = useSelector(getMessageData);
  const isFetchingMsg = useSelector(isFetchingMessages);
  const isFetchingMoreMsg = useSelector(isFetchingMoreMessages);
  const messageAllowUrls = useSelector(getMessageAllowUrls);
  const messages = useMemo(() => {
    return messageData[conversation?.topic] || [];
  }, [conversation?.topic, messageData]);
  const [conversationObj, setConversationObj] = useState(null);
  const [text, setText] = useState('');
  const [isErrorInMessage, setIsErrorInMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  useEffect(() => {
    if (conversation?.topic) {
      dispatch(getMessage({topic: conversation?.topic}));
    }

    (async () => {
      const fetchConversation = await XMTP.getConversation({
        topic: conversation?.topic,
        peerAddress: conversation?.peerAddress,
        createdAt: conversation?.createdAt,
        version: conversation?.version,
      });

      const total = await XMTP.getTotalMessagesCount({
        topic: conversation?.topic,
      });

      totalMsgRef.current = total;
      setConversationObj(fetchConversation);
    })();
  }, [
    conversation?.createdAt,
    conversation?.peerAddress,
    conversation?.topic,
    conversation?.version,
    dispatch,
  ]);

  const onLoadMoreMessages = useCallback(async () => {
    const messsageLength = messages.length;
    const lastMessage = messages[messsageLength - 1];
    const lastMessageDate = dayjs(lastMessage?.createdAt)
      .add(1, 'second')
      .toDate();
    try {
      await dispatch(
        getMoreMessages({
          lastMessageDate,
          topic: conversation.topic,
          limit: 20,
          prevMessages: [lastMessage],
        }),
      );
    } catch (error) {
      console.error('Failed to load more messages', error);
      showToast({
        type: 'errorToast',
        title: 'Failed to load more messages',
      });
    }
  }, [conversation.topic, dispatch, messages]);

  const onSend = useCallback(
    async e => {
      try {
        if (!isErrorInMessage) {
          if (text.trim().length === 0) {
            return;
          }
          setIsSending(true);
          setIsErrorInMessage(false);
          let resp;
          if (replyMessage) {
            resp = await conversationObj?.send(
              {
                repliedMessage: replyMessage?.text,
                repliedMessageId: replyMessage?._id,
                message: text,
                senderAddress: conversation?.clientAddress,
              },
              {
                contentType: ContentTypeCustomReply,
              },
            );
          } else {
            resp = await conversationObj?.send(text);
          }
          setIsSending(false);
          if (resp) {
            setText('');
            setReplyMessage(null);
          } else {
            console.error('resp not get', resp);
            showToast({
              type: 'errorToast',
              title: 'Failed to sent message',
            });
          }
        }
      } catch (e) {
        console.error('Error in sending message', e);
        setIsSending(false);
        showToast({
          type: 'errorToast',
          title: 'Failed to sent message',
        });
      }
    },
    [conversationObj, isErrorInMessage, text, replyMessage],
  );

  if (!conversation || Object.keys(conversation)?.length === 0) {
    router.push('/chats');
  }

  return isFetchingMsg ? (
    <Loading />
  ) : (
    <>
      <PageTitle
        title={conversation?.peerAddress}
        extraElement={
          <div className={styles.rightDiv}>
            <MessagePopOver conversation={conversation} />
          </div>
        }
      />
      {/* Chat Area */}
      {conversation?.consentState === 'denied' ? (
        <div className={styles.centerContainer}>
          <div className={styles.blockText}>
            {
              "This user is blocked by you. So, you can't see any messages. If you want to see the messages or send the messages. Unblock the user"
            }
          </div>
        </div>
      ) : (
        <>
          <Messages
            messages={messages}
            conversation={conversation}
            totalMsg={totalMsgRef.current}
            isFetchingMoreMsg={isFetchingMoreMsg}
            isErrorInMessage={isErrorInMessage}
            onLoadMoreMessages={onLoadMoreMessages}
            setReplyMessage={setReplyMessage}
          />
          <div className={styles.msgerInputarea}>
            {replyMessage && (
              <div className={styles.replyToContainer}>
                <div className={styles.replyToContainerHeader}>
                  <div className={styles.replyToContainerHeaderText}>
                    Reply to
                  </div>
                  <div
                    style={{
                      paddingRight: 6,
                      paddingLeft: 6,
                      paddingTop: 0,
                      cursor: 'pointer',
                    }}
                    onClick={() => setReplyMessage(null)}>
                    <svg
                      width='12px'
                      height='12px'
                      viewBox='-0.5 0 25 25'
                      style={{padding: 0}}
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M3 21.32L21 3.32001'
                        stroke='#FFF'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                      <path
                        d='M3 3.32001L21 21.32'
                        stroke='#FFF'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div className={styles.replyToContainerMessageText}>
                  {replyMessage?.text}
                </div>
              </div>
            )}
            <form onSubmit={onSend} className={styles.msgerForm}>
              <TextareaAutosize
                type='text'
                className={styles.msgerInput}
                placeholder='Type your message...'
                rows={1}
                value={text}
                onSubmit={onSend}
                onChange={e => {
                  setIsErrorInMessage(
                    isContainsURL(e.target.value, messageAllowUrls),
                  );
                  setText(e.target.value);
                }}
              />
              <button
                type='submit'
                className={`${styles.msgerSendBtn} ${(isErrorInMessage || isSending) && styles.sendingBtn}`}
                disabled={isErrorInMessage || isSending}>
                {isSending ? 'Sending' : 'Send'}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
