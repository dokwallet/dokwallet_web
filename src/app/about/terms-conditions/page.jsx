'use client';

import s from './TermsConditionsPage.module.css';
import GoBackButton from 'components/GoBackButton';
import {getTermsUrl} from 'whitelabel/whiteLabelInfo';

const TermsConditionsPage = () => {
  return (
    <div className={s.container}>
      <div>
        <GoBackButton />
      </div>
      <div className={s.titleContainer}>
        <p className={s.title}>Terms of Use</p>
      </div>
      <div className={s.mainContainer}>
        <iframe src={getTermsUrl()} height={'100%'} width={'100%'} />
      </div>
    </div>
  );
};

export default TermsConditionsPage;
