import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = ({
  size = 40,
  height = 'calc(var(--app-height) - 70px)',
  color = '#F44D03',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
      }}>
      <CircularProgress
        sx={{
          color: color,
        }}
        size={size}
      />
    </div>
  );
};

export default Loading;
