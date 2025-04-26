import Dropdown from 'components/Dropdown';
import s from './DokCountryPicker.module.css';

const DokCountryPicker = ({listData, onValueChange, placeholder, value}) => {
  const list = listData.map(item => ({
    id: item,
    option: item.label,
  }));

  return (
    <Dropdown
      listData={list}
      onValueChange={onValueChange}
      placeholder={placeholder}
      defaultValue={value}
    />
  );
};

export default DokCountryPicker;
