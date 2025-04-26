import React, {useContext} from 'react';
import Image from 'next/image';
import {ThemeContext} from 'theme/ThemeContext';

const maxDisplay = 5;
const size = 28;

const CoinIcons = ({icons}) => {
  const {theme} = useContext(ThemeContext);

  const styles = getStyles(theme);

  return (
    <div style={styles.iconContainer}>
      {icons.map((item, index) => {
        const end = 10 * index;
        if (index < maxDisplay || icons.length === maxDisplay + 1) {
          return (
            <div
              style={{
                ...styles.iconWrapper,
                right: `${end}px`,
              }}
              key={`crypto_icon_${item}_${index}`}>
              {item ? (
                <Image
                  src={item}
                  alt={`icon-${index}`}
                  width={size}
                  height={size}
                  style={styles.iconImg}
                />
              ) : null}
            </div>
          );
        } else if (index === maxDisplay) {
          return (
            <div
              style={{
                ...styles.iconWrapper,
                right: `${end}px`,
              }}
              key={`crypto_icon_${item}_${index}`}>
              <div style={styles.countImageView}>
                <span
                  style={
                    styles.counterText
                  }>{`+${icons.length - maxDisplay}`}</span>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

const getStyles = theme => ({
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '8px',
  },
  iconWrapper: {
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
  },
  iconImg: {
    borderRadius: '50%',
    border: '1px solid white',
    overflow: 'hidden',
  },
  countImageView: {
    width: `${size}px`,
    height: `${size}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: 'var(--background)',
  },
  counterText: {
    fontSize: '12px',
    color: 'white',
    textAlign: 'center',
  },
});

export default CoinIcons;
