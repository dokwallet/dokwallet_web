import {Box, CircularProgress} from '@mui/material';
import styles from './ModalLoad.module.css';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '12px',
  bgcolor: 'var(--secondaryBackgroundColor)',
  borderRadius: '10px',
  overflow: 'hidden',
};

const ModalLoad = ({open, title = 'Loading...'}) => {
  return (
    <Modal
      open={open}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={styles.container}>
          <CircularProgress />
          <p className={styles.titleInfo}>{title}</p>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalLoad;
