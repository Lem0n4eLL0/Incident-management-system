import { ApiError } from '@custom-types/types';
import style from './ErrorPage.module.css';
type ErrorPageProps = {
  error?: ApiError;
};

const ErrorPage = ({
  error = { code: 404, message: 'Запрашиваемый ресурс не найден' },
}: ErrorPageProps) => {
  return (
    <div className={style.page}>
      <span className={style.error_code}>{error.code}</span>
      <span className={style.error_text}>{error.message}</span>
    </div>
  );
};

export { ErrorPage };
