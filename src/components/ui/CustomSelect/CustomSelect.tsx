import style from './CustomSelect.module.css';
import clsx from 'clsx';
type CustomSelectProps<T extends string> = {
  value?: T;
  options: readonly T[];
  onChange: (item: T | undefined) => void;
  onClose?: () => void;
};

export function CustomSelect<T extends string>(props: CustomSelectProps<T>) {
  const { value, options, onChange, onClose } = props;

  const currentHandler = (item: T | undefined) => {
    onChange(item);
    onClose && onClose();
  };

  return (
    <div className={style.content}>
      <div
        onClick={() => currentHandler(undefined)}
        className={clsx(value === undefined && style.current, style.item, style.item_all)}
      >
        {'- Все -'}
      </div>
      {options.map((item) => (
        <div
          key={item}
          onClick={() => currentHandler(item)}
          className={clsx(value === item && style.current, style.item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
