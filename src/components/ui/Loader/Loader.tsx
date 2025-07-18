import style from './Loader.module.css';

type LoaderProps = {
  children?: React.ReactNode;
  loaderClass?: string;
};
export const Loader = ({ children, loaderClass }: LoaderProps) => {
  return (
    <div className={style.content}>
      <div className={loaderClass}>{children}</div>
    </div>
  );
};
