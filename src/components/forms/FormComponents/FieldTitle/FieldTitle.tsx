import formStyle from '@style/form.module.css';
import clsx from 'clsx';

type FieldTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export const FieldTitle = ({ children, className }: FieldTitleProps) => {
  return <span className={clsx(className, formStyle.field_title)}>{children}</span>;
};
