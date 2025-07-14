import clsx from 'clsx';
import style from './Select.module.css';
type SelectProps<T extends string> = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly T[];
  value?: T;
  placeholder?: string;
};

export function Select<T extends string>({
  value,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps<T>) {
  return (
    <select value={value ?? ''} className={clsx(className, style.select)} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option} value={option} className={style.option}>
          {option}
        </option>
      ))}
    </select>
  );
}
