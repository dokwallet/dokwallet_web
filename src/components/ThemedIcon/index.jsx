import React from 'react';

const ThemedIcon = ({icon, theme, font}) => {
  const getIconWithFill = icon => {
    if (font !== 2) {
      if (theme.backgroundColor !== '#000000') {
        return React.cloneElement(icon, {fill: '#FFFFFF'});
      } else if (theme.backgroundColor === '#000000') {
        return React.cloneElement(icon, {fill: '#000000'});
      }
    } else {
      if (theme.backgroundColor !== '#000000') {
        return React.cloneElement(icon, {fill: '#FFFFFF'});
      } else if (theme.backgroundColor === '#000000') {
        return React.cloneElement(icon, {fill: '#FFFFFF'});
      }
    }
    return icon;
  };

  const iconWithFill = getIconWithFill(icon);

  return <>{iconWithFill}</>;
};

export default ThemedIcon;
