import { useEffect, useRef } from 'react';
import style from './ModalFilter.module.css';

type ModalFilterProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export function ModalFilter({ children, onClose }: ModalFilterProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outsideClickListener = (e: MouseEvent) => {
      if (modalRef && !modalRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', outsideClickListener);

    return () => document.removeEventListener('mousedown', outsideClickListener);
  }, [modalRef]);
  return (
    <>
      <div ref={modalRef} className={style.content}>
        {children}
      </div>
    </>
  );
}
