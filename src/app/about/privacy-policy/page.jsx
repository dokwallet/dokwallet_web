'use client';
import s from './PrivacyPolicyPage.module.css';
import GoBackButton from 'components/GoBackButton';
import {getPrivacyUrl} from 'whitelabel/whiteLabelInfo';

const PrivacyPolicyPage = () => {
  return (
    <div className={s.container}>
      <div>
        <GoBackButton />
      </div>
      <div className={s.titleContainer}>
        <p className={s.title}>Privacy Policy</p>
      </div>
      <div className={s.mainContainer}>
        <iframe src={getPrivacyUrl()} height={'100%'} width={'100%'} />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
