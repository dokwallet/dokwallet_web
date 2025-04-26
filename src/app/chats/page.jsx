'use client';
import {useRouter} from 'next/navigation';
import styles from './Chats.module.css';
import PageTitle from 'src/components/PageTitle';
import {useDispatch} from 'react-redux';
import React, {useCallback, useEffect, useState} from 'react';
import {getConversation} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {Tab, Tabs, Box} from '@mui/material';
import Conversations from 'components/Conversations/page';
import MessageInfoPopover from 'components/MessageInfoPopover';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Chats = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);

  const fetchConversations = useCallback(() => {
    dispatch(getConversation());
  }, [dispatch]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleChangeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <PageTitle
        title='Messages'
        extraElement={
          <div className={styles.extraElementContainer}>
            <button
              className={styles.button}
              onClick={() => router.push('/chats/new-chat')}>
              New Chat
            </button>
            <MessageInfoPopover />
          </div>
        }
      />
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={tabIndex}
          textColor={'inherit'}
          onChange={handleChangeTabIndex}
          aria-label='basic tabs example'
          slotProps={{
            indicator: {
              style: {
                backgroundColor: 'var(--background)',
              },
            },
          }}>
          <Tab
            label='Messages'
            {...a11yProps(0)}
            sx={{
              '&.Mui-selected': {
                color: 'var(--background)',
              },
            }}
          />
          <Tab
            label='Requests'
            {...a11yProps(1)}
            sx={{
              '&.Mui-selected': {
                color: 'var(--background)',
              },
            }}
          />
        </Tabs>
      </Box>
      <Conversations value={tabIndex} index={0} />
      <Conversations value={tabIndex} index={1} isRequest={true} />
    </>
  );
};

export default Chats;
