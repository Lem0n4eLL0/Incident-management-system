import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import style from './Modal.module.css';
import { ReactComponent as CrossIcon } from '../../../assets/cross.svg';
import clsx from 'clsx';
type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  isCloseButton?: boolean;
  contentClass?: string;
};

const modalRoot = document.getElementById('react-modals');

export const Modal = (props: ModalProps) => {
  const { children, contentClass, onClose, isCloseButton = true } = props;

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className={style.modal}>
      <div className={clsx(style.modal_content, contentClass)}>
        {isCloseButton && (
          <button className={style.close_button} onClick={onClose}>
            <CrossIcon />
          </button>
        )}
        {children}
      </div>
      <div className={style.modal_overlay}></div>
    </div>,
    modalRoot!
  );
};
