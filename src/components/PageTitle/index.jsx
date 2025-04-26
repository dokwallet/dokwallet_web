import GoBackButton from 'components/GoBackButton';
import styles from './PageTitle.module.css';

const PageTitle = ({title = '', extraElement = null}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.goBack}>
        <GoBackButton />
      </div>
      <h3 className={styles.pageTitle}>{title}</h3>
      {extraElement ? extraElement : <div />}
    </div>
  );
};

export default PageTitle;
