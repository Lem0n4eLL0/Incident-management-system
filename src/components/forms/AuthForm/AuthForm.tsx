import { useFormValidation } from '@hooks/useFormValidation';
import style from './AuthForm.module.css';
import formStyle from '@style/form.module.css';
import staticStyle from '@style/common.module.css';

import { ApiLoginRequest } from '@custom-types/types';
import { LOGIN_REQUEST_VALIDATORS } from '@constants/validators';
import { Input } from '@ui/Input';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from '@services/store';
import { Navigate } from 'react-router-dom';
import { loginUser, selectErrorsAuth, selectIsAuthenticated } from '@services/authSlice';

const EMPTY_LOGIN_REQUEST: ApiLoginRequest = {
  login: '',
  password: '',
};

export const AuthForm = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) =>
    selectIsAuthenticated.unwrapped(state.authReducer)
  );
  const { authUserError } = useSelector((state) => selectErrorsAuth.unwrapped(state.authReducer));

  const [authData, setAuthData] = useState<ApiLoginRequest>(EMPTY_LOGIN_REQUEST);
  const { errors, isAllValid, validateField, validateAll, setErrors } =
    useFormValidation<ApiLoginRequest>(LOGIN_REQUEST_VALIDATORS);

  const [serverError, setServerError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isFormValid = useMemo(() => {
    return isAllValid(authData);
  }, [authData]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (authUserError?.message) {
      setServerError(authUserError.message);
      setErrors({
        login: ' ',
        password: ' ',
      });
      if (inputRef.current) inputRef.current.focus();
    } else {
      setServerError(null);
      setErrors({});
    }
  }, [authUserError, setErrors]);

  const inputHandler = (field: keyof ApiLoginRequest) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (serverError) {
      setServerError('');
      setErrors({});
    }
    setAuthData((prev) => ({ ...prev, [field]: value }));
    validateField({ field, value });
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!validateAll(authData)) return;
    dispatch(loginUser(authData));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className={style.form} ref={formRef} onSubmit={submitHandler}>
      <div className={style.options}>
        <Input
          type="text"
          inputRef={inputRef}
          error={<span className={staticStyle.error}>{errors.login}</span>}
          inputTitle={<span className={formStyle.field_title}>Логин</span>}
          value={authData.login}
          className={clsx(formStyle.input, errors.login && formStyle.input_not_valid)}
          lableClassName={style.lable}
          onChange={inputHandler('login')}
        />
        <Input
          type="password"
          inputRef={inputRef}
          error={<span className={staticStyle.error}>{errors.password}</span>}
          inputTitle={<span className={formStyle.field_title}>Пароль</span>}
          value={authData.password}
          className={clsx(formStyle.input, errors.password && formStyle.input_not_valid)}
          lableClassName={style.lable}
          onChange={inputHandler('password')}
        />
      </div>
      <div className={style.controls}>
        <span className={clsx(staticStyle.error, style.form_response_error)}>{serverError}</span>
        <button
          type="submit"
          className={clsx(
            style.auth_button,
            formStyle.confirm_button,
            (!isFormValid || serverError) && formStyle.disabled
          )}
          disabled={!isFormValid || !!serverError}
        >
          Вход
        </button>
      </div>
    </form>
  );
};
