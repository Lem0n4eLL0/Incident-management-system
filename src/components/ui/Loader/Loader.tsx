import clsx from 'clsx';
import style from './Loader.module.css';

type LoaderProps = {
  children?: React.ReactNode;
  loaderClass?: string;
  isAbsolute?: boolean;
};

export const Loader = ({ children, loaderClass, isAbsolute = false }: LoaderProps) => {
  return (
    <div
      className={clsx(style.content, {
        [style.absolute]: isAbsolute,
        [style.relative]: !isAbsolute,
      })}
    >
      <div className={loaderClass}>{children}</div>
    </div>
  );
};
