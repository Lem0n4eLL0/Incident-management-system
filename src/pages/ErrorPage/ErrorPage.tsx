import style from './ErrorPage.module.css';
type ErrorPageProps = {
  code?: number;
  text?: string;
};

const ErrorPage = ({ code = 404, text = 'Запрашиваемый ресурс не найден' }: ErrorPageProps) => {
  return (
    <div className={style.page}>
      <span className={style.error_code}>{code}</span>
      <span className={style.error_text}>{text}</span>
    </div>
  );
};

export { ErrorPage };
