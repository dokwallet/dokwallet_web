import s from './Dropdown.module.css';

import {Select as BaseSelect, FormControl, MenuItem} from '@mui/material';

const NewIcon = props => (
  <svg
    {...props}
    viewBox='0 0 1024 1024'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'>
    <path d='M366.293333 702.293333l195.626667-195.626666-195.626667-195.626667L426.666667 250.666667l256 256-256 256z' />
  </svg>
);

const Dropdown = ({
  listData,
  onValueChange,
  placeholder,
  defaultValue,
  renderValue,
  className,
}) => {
  return (
    <FormControl className={s.select}>
      <BaseSelect
        className={className}
        sx={{
          boxShadow: 'none',
          '.MuiOutlinedInput-notchedOutline': {border: 0},
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              border: 0,
            },
          '& .MuiSelect-icon': {
            fill: 'gray',
            width: 24,
            transform: 'rotate(90deg)',
          },
        }}
        {...(renderValue ? {renderValue} : {})}
        value={defaultValue || placeholder}
        defaultValue={defaultValue || placeholder}
        IconComponent={NewIcon}
        onChange={onValueChange}>
        {!defaultValue && (
          <MenuItem
            disabled
            value={placeholder}
            sx={{
              backgroundColor: 'var(--lightBackground)',
              color: 'var(--font)',
            }}>
            <p>{placeholder}</p>
          </MenuItem>
        )}
        {listData.map((item, i) => (
          <MenuItem
            key={i}
            value={item.id}
            sx={{
              backgroundColor: 'var(--lightBackground)',
              color: 'var(--font)',

              '&.Mui-selected': {
                backgroundColor: 'var(--backgroundColor)',
              },
            }}>
            {item.option}
          </MenuItem>
        ))}
      </BaseSelect>
    </FormControl>
  );
};

export default Dropdown;
