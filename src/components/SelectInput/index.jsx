import Dropdown from 'components/Dropdown';
import s from './SelectInput.module.css';

const SelectInput = ({
  listData,
  onValueChange,
  placeholder,
  value,
  renderValue,
  className = '',
}) => {
  const list = listData.map(item => ({
    id: item.value,
    option: item.option || item.label,
  }));

  return (
    <Dropdown
      className={className}
      onValueChange={event => {
        const item = event?.target?.value;
        onValueChange(item);
      }}
      listData={list}
      placeholder={placeholder}
      defaultValue={value}
      renderValue={renderValue}
    />
  );
};

export default SelectInput;
