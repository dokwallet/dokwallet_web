import {Box, Button, Checkbox, Modal} from '@mui/material';
import {getCustomizePublicAddress} from 'dok-wallet-blockchain-networks/helper';
import {getConversations} from 'dok-wallet-blockchain-networks/redux/messages/messageSelector';
import {forwardMessages} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {shallowEqual, useSelector} from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'var(--secondaryBackgroundColor)',
  borderRadius: '10px',
  padding: '16px',
  overflow: 'hidden',
  '@media (min-width: 500px)': {
    width: '60%',
  },
  '@media (min-width: 768px)': {
    width: '40%',
  },
};

const ModalCustomForwardMessage = ({open, onClose, selectedMessages}) => {
  const conversations = useSelector(getConversations, shallowEqual);
  const [selectedConversations, setSelectedConversations] = useState({});
  const dispatch = useDispatch();
  const filterConversations = useMemo(() => {
    return conversations?.filter(conversation => {
      return conversation.consentState === 'allowed';
    });
  }, [conversations]);

  const handleSelectConversation = conversation => {
    const conversationId = conversation?.topic;
    const isSelected = !!selectedConversations[conversationId];
    const previousSelectedConversations = {...selectedConversations};
    if (isSelected) {
      delete previousSelectedConversations[conversationId];
    } else {
      previousSelectedConversations[conversationId] = conversation;
    }
    setSelectedConversations(previousSelectedConversations);
  };

  const handleForward = () => {
    dispatch(
      forwardMessages({
        messages: Object.values(selectedMessages).map(message => message.text),
        conversations: Object.values(selectedConversations),
      }),
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <h3>Forward To</h3>
        <div
          style={{
            marginTop: 12,
          }}>
          {filterConversations?.map(conversation => (
            <div
              key={conversation?.topic}
              style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <Checkbox
                checked={selectedConversations[conversation?.topic]}
                onChange={() => handleSelectConversation(conversation)}
              />
              <p>{getCustomizePublicAddress(conversation?.peerAddress)}</p>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'end',
            gap: 12,
          }}>
          <Button
            variant='outlined'
            color='primary'
            disabled={Object.keys(selectedConversations).length === 0}
            onClick={handleForward}>
            Forward
          </Button>
          <Button variant='text' color='primary' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalCustomForwardMessage;
