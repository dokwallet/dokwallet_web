// import React, { useState, useEffect, useContext } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { CheckBox } from "@rneui/themed";
// import { ThemeContext } from "../../ThemeContext";
import {Checkbox} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import s from './DokRadioButton.module.css';

const DokRadioButton = ({title, options, setChecked, checked}) => {
  //   const { theme } = useContext(ThemeContext);
  //   const styles = myStyles(theme);

  return (
    <div className={s.section}>
      <p className={s.title}>{title}</p>

      {options?.map((item, index) => (
        <div
          className={s.itembox}
          key={index}
          onClick={() => {
            setChecked && setChecked(item.label);
          }}>
          <Checkbox
            checked={checked === item.label}
            onChange={() => {
              setChecked && setChecked(item.label);
            }}
            inputProps={{'aria-label': 'controlled'}}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<RadioButtonCheckedIcon />}
            // color=""
          />
          <p className={s.item}>{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DokRadioButton;
