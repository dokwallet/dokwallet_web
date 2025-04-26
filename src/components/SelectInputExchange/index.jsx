import React from 'react';
import Dropdown from 'components/Dropdown';
import s from './SelectInputExchange.module.css';
import Image from 'next/image';

const SelectInputExchange = ({
  listData,
  selectedValue,
  onValueChange,
  placeholder,
}) => {
  const list = listData.map(({value, label, options}) => ({
    id: value,
    name: label,
    option: (
      <div key={value} className={s.option}>
        {options?.icon && (
          <div className={s.icon}>
            <Image src={options?.icon} width={40} height={40} alt={'icon'} />
          </div>
        )}
        <div className={s.value}>
          <div className={s.row}>
            <p>{label}</p>
            {options?.chain_display_name && (
              <p className={s.chainDisplayName}>
                {options?.chain_display_name}
              </p>
            )}
          </div>

          {options?.symbol && <span>{options?.symbol}</span>}
        </div>
      </div>
    ),
  }));

  return (
    <Dropdown
      defaultValue={selectedValue}
      onValueChange={onValueChange}
      listData={list}
      placeholder={placeholder}
    />
  );
};

export default SelectInputExchange;
