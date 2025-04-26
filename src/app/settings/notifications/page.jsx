'use client';

// import { View, Text, TouchableOpacity } from "react-native";
// import myStyles from "./NotificationsStyles";
// import { Switch } from "react-native-paper";
// import { useSelector } from "react-redux";
// import {
//   isNotificationsReceived,
//   isNotificationsSent,
// } from "redux/settings/settingsSelectors";
// import { updateReceived, updateSent } from "redux/settings/settingsSlice";
// import { useContext } from "react";
// import { ThemeContext } from "../../../../../ThemeContext";
// import { useDispatch } from "redux/utils/useDispatch";

import {Switch} from '@mui/material';
import s from './Notifications.module.css';
import {useState} from 'react';
import GoBackButton from 'components/GoBackButton';

const Notifications = () => {
  //   const { theme } = useContext(ThemeContext);
  //   const styles = myStyles(theme);

  //   const isReceived = useSelector(isNotificationsReceived);
  //   const isSent = useSelector(isNotificationsSent);

  //   const onToggleSwitchReceive = () => dispatch(updateReceived(!isReceived));
  //   const onToggleSwitchSent = () => dispatch(updateSent(!isSent));

  //   const dispatch = useDispatch("Notifications");

  const [isReceived, setIsReceived] = useState(true);
  const onToggleSwitchReceive = () => setIsReceived(!isReceived);
  const [isSent, setIsSent] = useState(true);
  const onToggleSwitchSent = () => setIsSent(!isSent);

  return (
    <div className={s.container}>
      <GoBackButton />
      <div className={s.list}>
        <p className={s.title}>Funds</p>
        <div
          className={s.btn}
          //   style={{
          //     justifyContent: "space-between",
          //     borderBottomWidth: 0.5,
          //     borderBottomColor: "var(--gray)",
          //   }}
        >
          <div style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <ArrowDown width="25" height="25" fill={theme.font} /> */}
            <div className={s.box}>
              <p className={s.btnTitle}>Received</p>
            </div>
          </div>
          <Switch
            value={isReceived}
            onChange={onToggleSwitchReceive}
            color='warning'
          />
        </div>
        <div
          className={s.btn}
          //   className={{
          //     ...s.btn,
          //     justifyContent: "space-between",
          //   }}
        >
          <div style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <ArrowUp width="25" height="25" fill={theme.font} /> */}
            <div className={s.box}>
              <p className={s.btnTitle}>Sent</p>
            </div>
          </div>
          <Switch
            value={isSent}
            onChange={onToggleSwitchSent}
            color='warning'
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
