import { AuthForm } from '@components/forms/AuthForm';
import style from './AuthPage.module.css';

export const AuthPage = () => {
  return (
    <div className={style.content_wrapper}>
      <div className={style.content}>
        <h1 className={style.title}>Войдите в аккаунт</h1>
        <div className={style.form_wrapper}>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};
