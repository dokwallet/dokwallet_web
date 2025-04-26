'use client';
import dayjs from 'dayjs';
import Loading from '../Loading';
import styles from './Messages.module.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useCallback, useRef, useState} from 'react';
import ModalInfo from '../ModalInfo';
import {Button, Checkbox} from '@mui/material';
import ModalCustomForwardMessage from '../ModalCustomForwardMessage';

const ITEM_HEIGHT = 48;

const Messages = ({
  messages,
  conversation,
  totalMsg,
  isFetchingMoreMsg,
  isErrorInMessage,
  onLoadMoreMessages,
  setReplyMessage,
}) => {
  const chatAreaRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState({});
  const [forwardMode, setForwardMode] = useState(false);
  const [copyMode, setCopyMode] = useState(false);
  const [openModalCustomForwardMessage, setOpenModalCustomForwardMessage] =
    useState(false);

  const handleCopy = async () => {
    const selectedMessagesValues = Object.values(selectedMessages);
    const sortedMessages = selectedMessagesValues.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
    let copyString = '';
    const sortedMessageLength = sortedMessages.length;
    for (let i = 0; i < sortedMessageLength; i++) {
      const message = sortedMessages[i];
      const previousMessage = sortedMessages[i - 1];
      const currentUserId = message?.user?._id;
      const prevUserid = previousMessage?.user?._id;
      const currentMessage = message?.text;
      if (
        (i === 0 && sortedMessageLength > 1) ||
        (previousMessage && currentUserId !== prevUserid)
      ) {
        copyString += `${currentUserId}:\n`;
      }
      copyString += `${currentMessage}\n\n`;
    }
    try {
      await navigator.clipboard.writeText(copyString);
      setSelectedMessages({});
      setCopyMode(false);
    } catch (e) {
      console.warn('error in copy', e);
    }
  };

  const handleForward = () => {
    setForwardMode(true);
  };

  const handleReply = index => {
    setReplyMessage(messages[index]);
  };

  const scrollToMessage = async (messageId, allowLoop = true) => {
    if (chatAreaRef.current) {
      const messageElement = chatAreaRef.current.querySelector(
        `[data-message-id="${messageId}"]`,
      );
      if (messageElement) {
        chatAreaRef.current.scrollTop =
          messageElement.offsetTop - chatAreaRef.current.offsetTop;
        messageElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
        setTimeout(
          () => {
            messageElement.style.backgroundColor = '';
          },
          allowLoop ? 300 : 600,
        );
      } else {
        if (allowLoop) {
          await onLoadMoreMessages();
          scrollToMessage(messageId, false);
        } else {
          setIsModalVisible(true);
          console.log('message not found');
        }
      }
    }
  };

  const renderMessage = msg => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = msg.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            className={styles.urlText}
            href={part}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => {
              try {
                const qsObj = parseUrlQS(part);
                if (validatePaymentUrl(part, qsObj)) {
                  const currentDate = new Date().toISOString();
                  dispatch(setPaymentData({...qsObj, date: currentDate}));
                }
              } catch (e) {
                console.warn('error in getInitialUrlLink', e);
              }
            }}>
            {part}
          </a>
        );
      } else {
        return part;
      }
    });
  };

  const renderDate = (item, nextIndex) => {
    const currentDate = dayjs(item?.createdAt).format('DD-MM-YYYY');
    const nextDate = messages[nextIndex]?.createdAt
      ? dayjs(messages[nextIndex]?.createdAt).format('DD-MM-YYYY')
      : null;
    if (currentDate !== nextDate) {
      return dayjs(item?.createdAt).format('MMM DD, YYYY');
    }
  };
  const handleSetSelectedMessage = useCallback(
    item => isSelected => {
      if (isSelected) {
        setSelectedMessages(prev => ({
          ...prev,
          [item._id]: item,
        }));
      } else {
        setSelectedMessages(prev => {
          const newSelectedMessages = {...prev};
          delete newSelectedMessages[item._id];
          return newSelectedMessages;
        });
      }
    },
    [setSelectedMessages],
  );

  return (
    <div className={styles.chatContainer}>
      {forwardMode && (
        <div className={styles.forwardContainer}>
          {Object.keys(selectedMessages).length > 0 ? (
            <div>Forward {Object.keys(selectedMessages).length} messages</div>
          ) : (
            <div>Select messages to forward</div>
          )}
          <div style={{display: 'flex', gap: 10}}>
            {Object.keys(selectedMessages).length > 0 && (
              <Button
                variant='outlined'
                onClick={() => setOpenModalCustomForwardMessage(true)}>
                Forward
              </Button>
            )}
            <Button
              variant='text'
              onClick={() => {
                setSelectedMessages({});
                setForwardMode(false);
              }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {copyMode && (
        <div className={styles.forwardContainer}>
          {Object.keys(selectedMessages).length > 0 ? (
            <div>Copy {Object.keys(selectedMessages).length} messages</div>
          ) : (
            <div>Select messages to copy</div>
          )}
          <div style={{display: 'flex', gap: 10}}>
            {Object.keys(selectedMessages).length > 0 && (
              <Button variant='outlined' onClick={handleCopy}>
                Copy
              </Button>
            )}
            <Button
              variant='text'
              onClick={() => {
                setSelectedMessages({});
                setCopyMode(false);
              }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className={styles.chatAreaContainer} ref={chatAreaRef}>
        {/* Chat Area */}
        {messages?.length > 0 &&
          [...messages]?.map((item, index) => (
            <MessageBubble
              key={item._id}
              item={item}
              index={index}
              handleReply={handleReply}
              handleCopy={() => setCopyMode(true)}
              handleForward={handleForward}
              date={renderDate(item, index + 1)}
              message={renderMessage(item.text)}
              conversation={conversation}
              scrollToMessage={scrollToMessage}
              forwardMode={forwardMode}
              copyMode={copyMode}
              selectedMessage={selectedMessages[item?._id]}
              setSelectedMessage={handleSetSelectedMessage(item)}
            />
          ))}
        {totalMsg !== 0 && totalMsg !== messages.length && (
          <div className={styles.loadingContainer}>
            {!isFetchingMoreMsg ? (
              <button
                className={styles.loadMoreBtn}
                onClick={onLoadMoreMessages}>
                <div className={styles.loadingText}>Load more</div>
              </button>
            ) : (
              <div className={styles.activeLoaderContainer}>
                <Loading size={24} height='auto' /> Loading...
              </div>
            )}
          </div>
        )}
      </div>
      {isErrorInMessage && (
        <div className={styles.messageErrorContainer}>
          <div className={styles.errorText}>
            {'Unknown link(s) are not allow to send'}
          </div>
        </div>
      )}
      <ModalInfo
        visible={isModalVisible}
        handleClose={() => setIsModalVisible(false)}
        title='Message too old'
        message='The message you are trying to access is too old and cannot be displayed directly.'
      />
      {openModalCustomForwardMessage && (
        <ModalCustomForwardMessage
          open={openModalCustomForwardMessage}
          onClose={() => {
            setSelectedMessages({});
            setForwardMode(false);
            setOpenModalCustomForwardMessage(false);
          }}
          selectedMessages={selectedMessages}
        />
      )}
    </div>
  );
};

const MessageBubble = ({
  item,
  index,
  handleReply,
  handleCopy,
  handleForward,
  date,
  message,
  conversation,
  scrollToMessage,
  forwardMode,
  copyMode,
  selectedMessage,
  setSelectedMessage,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSender = conversation?.clientAddress === item?.user?._id;

  return (
    <div data-message-id={item?._id} key={index}>
      <div className={styles.dateSeparatorText}>{date}</div>
      <div
        key={index}
        className={`${styles.msg} ${isSender ? styles.rightMsg : styles.leftMsg}`}
        // style={{backgroundColor: '#fff', borderTop: '1px solid #e0e0e0'}}
      >
        <div className={styles.msgBubble}>
          {item?.reference && (
            <div
              // className={styles.replyContainerMessage}
              onClick={() => {
                scrollToMessage(item?.reference);
                // console.log('msgElement', msgElement);
              }}>
              {item?.repliedMessage}
            </div>
          )}
          <div id={`msg-${index}`} className={styles.msgText}>
            {message}
          </div>
          <div className={styles.msgInfo}>
            <div className={styles.msgInfoTime}>
              {dayjs(item?.createdAt).format('HH:mm A')}
            </div>
          </div>
          <div className={styles.msgContextMenu}>
            <IconButton
              aria-label='more'
              id='long-button'
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='true'
              onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='long-menu'
              anchorEl={anchorEl}
              open={open}
              className={styles.menu}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                },
                list: {
                  'aria-labelledby': 'long-button',
                },
              }}>
              <MenuItem
                onClick={() => {
                  handleCopy();
                  handleClose();
                }}
                sx={{
                  color: 'var(--font)',
                }}>
                Copy
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleForward();
                  handleClose();
                }}
                sx={{
                  color: 'var(--font)',
                }}>
                Forward
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleReply(index);
                  handleClose();
                }}
                sx={{
                  color: 'var(--font)',
                }}>
                Reply
              </MenuItem>
            </Menu>
          </div>
        </div>
        {(forwardMode || copyMode) && (
          <Checkbox
            checked={selectedMessage}
            onChange={e => setSelectedMessage(e.target.checked)}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
