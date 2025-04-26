import {Box, Modal} from '@mui/material';
import s from './ModalCreateWallet.module.css';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {
  setChainName,
  setPhrase,
  setPrivateKey,
} from 'dok-wallet-blockchain-networks/redux/extraData/extraDataSlice';
import {useDispatch} from 'react-redux';

const ModalCreateWallet = ({visible, hideModal}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: "95%",
    bgcolor: 'var(--secondaryBackgroundColor)',
    borderRadius: '10px',
    '@media (max-width: 769px)': {
      width: '95%',
    },
    overflow: 'hidden',
  };
  return (
    <Modal
      open={visible}
      onClose={() => hideModal(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <div className={s.mainView}>
          <button
            className={s.itemView}
            onClick={() => {
              hideModal(false);
              dispatch(setPhrase(null));
              dispatch(setPrivateKey(null));
              dispatch(setChainName(null));
              router.push('/wallets/create-wallet');
            }}>
            <Image
              src={'/images/icons/plus-icon.png'}
              className={s.plusIcon}
              width={20}
              height={20}
              alt='icon'
            />
            <div>
              <p className={s.title}>{"I don't have a wallet"}</p>
              <p className={s.description}>
                {'Create a new multi-chain wallet'}
              </p>
            </div>
          </button>
          <button
            className={s.itemView}
            onClick={() => {
              hideModal(false);
              hideModal(false);
              router.push('/wallets/import-wallet');
            }}>
            <Image
              src={'/images/icons/download.png'}
              className={s.downloadIcon}
              width={20}
              height={20}
              alt='icon'
            />
            <div>
              <p className={s.title}>{'I already have a wallet'}</p>
              <p className={s.description}>{'Import a wallet'}</p>
            </div>
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalCreateWallet;
