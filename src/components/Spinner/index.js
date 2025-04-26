import React from 'react';
import PropTypes from 'prop-types';
import {CircularProgress, Modal, circularProgressClasses} from '@mui/material';
import {Box} from '@mui/system';
import styles from './Spinner.module.css';

const Spinner = ({isShownTransactionText}) => {
  return (
    <Modal className={styles.flex1} open={true}>
      <div className={styles.container}>
        <Box sx={{position: 'relative'}}>
          <CircularProgress
            variant='determinate'
            sx={{
              color: theme =>
                theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
            }}
            size={40}
            thickness={4}
            // {...props}
            value={100}
          />
          <CircularProgress
            variant='indeterminate'
            disableShrink
            sx={{
              color: 'var(--background)',
              animationDuration: '550ms',
              position: 'absolute',
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round',
              },
            }}
            size={40}
            thickness={4}
            // {...props}
          />
        </Box>
        {isShownTransactionText ? (
          <div className={styles.paddingView}>
            <div className={styles.text}>
              {
                'The transaction is submitting. It may take a few minutes. Please avoid pressing the back button or closing the app.'
              }
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

Spinner.propTypes = {
  isShownTransactionText: PropTypes.bool,
};

export default Spinner;
