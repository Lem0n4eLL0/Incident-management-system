import formStyle from '@style/form.module.css';
import staticStyle from '@style/common.module.css';
import clsx from 'clsx';

type FieldErorrProps = {
  children: React.ReactNode;
  className?: string;
};

export const FieldErorr = ({ children, className }: FieldErorrProps) => {
  return (
    <span className={clsx(className, staticStyle.error, formStyle.input_error)}>{children}</span>
  );
};
