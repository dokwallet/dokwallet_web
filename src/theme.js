'use client';
import {createTheme} from '@mui/material/styles';

export const createDynamicTheme = (primaryColor = '#F44D03') => {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor, // ✅ Use actual color value, not CSS variable
      },
      secondary: {
        main: primaryColor,
      },
    },
  });
};
