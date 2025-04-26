import DokPopover from 'components/DokPopover';
import {useRouter} from 'next/navigation';
import {useCallback, useRef} from 'react';
import s from './SelectedUTXOsPopOver.module.css';

// eslint-disable-next-line react/display-name
const SelectedUTXOsPopOver = () => {
  const router = useRouter();
  const popoverRef = useRef(null);

  const onSelectUTXOs = useCallback(() => {
    popoverRef.current?.close();
    router.push('/home/send/select-UTXOs');
  }, [router]);

  return (
    <>
      <DokPopover ref={popoverRef}>
        <button className={s.popoverItemView} onClick={onSelectUTXOs}>
          <p className={s.popoverItemText}>{'Select UTXOs'}</p>
        </button>
      </DokPopover>
    </>
  );
};

export default SelectedUTXOsPopOver;
