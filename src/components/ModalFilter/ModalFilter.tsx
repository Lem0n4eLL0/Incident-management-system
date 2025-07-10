import ReactDOM from 'react-dom';
import style from './ModalFilter.module.css';
import { FilterFunc } from '@utils/Filter';
import { useEffect, useState } from 'react';
import { FilterController } from '@hooks/useFilter';

const modalRoot = document.getElementById('react-modals') as HTMLElement;

type ModalFilterProps<T, K extends keyof T> = {
  controller: FilterController<T>;
  column: K;
  filterFunc: FilterFunc<T, K>;
  children: (props: {
    value?: T[K] | undefined;
    onChange: (value: T[K] | undefined) => void;
  }) => React.ReactNode;
};

export function ModalFilter<T, K extends keyof T>({
  controller,
  column,
  filterFunc,
  children,
}: ModalFilterProps<T, K>) {
  const [value, setValue] = useState<T[K] | undefined>();

  useEffect(() => {
    controller.setFilter(column, (item) => filterFunc(item, value));
  }, [value]);

  return <div className={style.content}>{children({ value, onChange: setValue })}</div>;
}
