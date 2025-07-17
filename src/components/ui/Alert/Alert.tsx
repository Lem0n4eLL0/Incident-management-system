import { createPortal } from 'react-dom';
import style from './Alert.module.css';
import clsx from 'clsx';
import { useEffect } from 'react';

const root = document.getElementById('react-alert') as HTMLElement;

type AlertProps = {
  children: React.ReactNode;
  className?: string;
};

export const Alert = ({ children, className }: AlertProps) => {
  return createPortal(<div className={clsx(style.alert, className)}>{children}</div>, root);
};
