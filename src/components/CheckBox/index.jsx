import React, {useState, useEffect, useContext} from 'react';
// import { CheckBox } from "@rneui/themed";
// import { ThemeContext } from "../../../ThemeContext";
// import myStyles from "./CryptoCheckboxStyles";
import styles from './CryptoCheckbox.module.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';

const CryptoCheckbox = ({
  setTermsCheck,
  title,
  number,
  setRiskCheck,
  setInfoCheck,
}) => {
  //   const { theme } = useContext(ThemeContext);
  //   const styles = myStyles(theme);

  const [checked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    const tempChecked = !checked;
    setChecked(tempChecked);
    if (number === '1') {
      setTermsCheck(tempChecked);
    }
    if (number === '2') {
      setRiskCheck(tempChecked);
    }
    if (number === '3') {
      setInfoCheck(tempChecked);
    }
  };

  return (
    <div className={styles.checkbox}>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={toggleCheckbox} />}
      />

      {number !== '3' ? (
        <div className={styles.textBox}>
          <p className={styles.text}>I accept the</p>
          <button className={styles.checkText}>
            <Link
              href={
                number === '1'
                  ? 'https://ozaraglobal.com/terms.php'
                  : 'https://ozaraglobal.com/policy.php'
              }
              target='_blank'
              rel='noopener noreferrer'>
              {title}
            </Link>
          </button>
        </div>
      ) : (
        <p className={styles.text}>{title}</p>
      )}
    </div>
  );
};

export default CryptoCheckbox;
