import { ForwardedRef, InputHTMLAttributes } from 'react';
import staticStyle from '@style/common.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef?: ForwardedRef<HTMLInputElement>;
  error?: React.ReactNode;
  value?: string;
  inputTitle?: React.ReactNode;
  lableClassName?: string;
}

export const Input = ({
  inputRef,
  error = '',
  value = '',
  inputTitle,
  className,
  lableClassName,
  ...props
}: InputProps) => {
  return (
    <label className={lableClassName}>
      {inputTitle}
      <input className={className} ref={inputRef} {...props} value={value}></input>
      {error}
    </label>
  );
};
