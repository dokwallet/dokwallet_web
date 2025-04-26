const icons = require(`assets/images/icons`).default;
import {useRouter} from 'next/navigation';
import s from './GoBackButton.module.css';

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button type='button' onClick={() => router.back()} className={s.btn}>
      {icons.goBack}
    </button>
  );
};

export default GoBackButton;
