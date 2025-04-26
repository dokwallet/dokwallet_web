import React from 'react';
import {IconButton, Tab, Tabs as _Tabs} from '@mui/material';

const CustomTabScrollButton = ({disabled, onClick}) => {
  return (
    !disabled && <IconButton disabled={disabled} onClick={onClick}></IconButton>
  );
};

const Tabs = ({
  tabList = [],
  selectedTab = 0,
  onTabChange = () => {},
  sx = {},
  tabsClassName = '',
  tabClassName = '',
  tabFontSize = 16,
  ...props
}) => {
  return (
    <_Tabs
      className={`${tabsClassName}`}
      variant='scrollable'
      scrollButtons='auto'
      allowScrollButtonsMobile
      value={selectedTab}
      onChange={onTabChange}
      sx={{
        ...sx,
        '& .MuiTab-root': {
          textTransform: 'none',
          fontSize: `${tabFontSize}px`,
          color: 'var(--font)',
          minHeight: '48px',
          padding: '12px 24px',
        },
        '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
          color: '#ffffff',
          fontWeight: 'bold',
          backgroundColor: 'var(--background)',
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}
      {...props}
      slots={{
        scrollButton: CustomTabScrollButton,
      }}>
      {tabList?.map((tab, index) => (
        <Tab key={index} className={`${tabClassName}`} label={tab} />
      ))}
    </_Tabs>
  );
};

export default Tabs;
