import { useDispatch, useSelector } from '@services/store';
import style from './ProfilePage.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';
import {
  selectErrorsUser,
  selectStatusUser,
  selectUser,
  updateUserFetchUser,
} from '@services/userSlice';
import { ReactComponent as PenIcon } from '@assets/pen.svg';
import clsx from 'clsx';
import { ChangeEvent, FormEventHandler, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ApiError, User, UserDTO } from '@custom-types/types';
import { mapUserToDto, mapUserFromDto } from '@custom-types/mapperDTO';
import { EMPTY_USER } from '@constants/constants';
import { Input } from '@components/ui/Input';
import { useFormValidation } from '@hooks/useFormValidation';
import { USER_VALIDATOR } from '@constants/validators';
import { Loader } from '@components/ui/Loader';
import { updateUserUsers } from '@services/usersSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const REDACTOR_MODE_OFF = { isOn: false, field: null };

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { updateUserError } = useSelector((state) => selectErrorsUser.unwrapped(state.userReducer));
  const { isUpdateUserPending } = useSelector((state) =>
    selectStatusUser.unwrapped(state.userReducer)
  );
  const [formData, setFormData] = useState<UserDTO>(mapUserToDto(user ?? EMPTY_USER));

  const [isRedactorMode, setIsRedactorMode] = useState<{
    isOn: boolean;
    field: keyof UserDTO | null;
  }>(REDACTOR_MODE_OFF);

  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const { errors, isAllValid, validateField, validateAll, setErrors } =
    useFormValidation(USER_VALIDATOR);

  const [serverError, setServerError] = useState<ApiError | undefined>(undefined);
  useEffect(() => {
    phoneInputRef.current?.focus(); // не работает
    emailInputRef.current?.focus();
  }, []);

  // useEffect(() => {
  //   if (updateUserError) {
  //     setServerError(updateUserError);
  //   } else {
  //     setServerError(undefined);
  //   }
  // }, [updateUserError, setServerError]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave(isRedactorMode.field!);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        (phoneInputRef.current && !phoneInputRef.current.contains(e.target as Node)) ||
        (emailInputRef.current && !emailInputRef.current.contains(e.target as Node))
      ) {
        handleSave(isRedactorMode.field!);
      }
    };

    const handleClose = (field: keyof UserDTO) => (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRedactorMode(REDACTOR_MODE_OFF);
        setFormData((prev) => ({ ...prev, [field]: mapUserToDto(user!)?.[field] }));
        setErrors({});
        setServerError(undefined);
      }
    };

    if (isRedactorMode.isOn) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleClose(isRedactorMode.field!));
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClose(isRedactorMode.field!));
    };
  }, [isRedactorMode, formData.telephone, formData.email]);

  const handleSave = async (field: keyof UserDTO) => {
    const isValid = validateAll(formData);
    if (!isValid) return;
    if (JSON.stringify(formData) === JSON.stringify(mapUserToDto(user!))) {
      setIsRedactorMode(REDACTOR_MODE_OFF);
      return;
    }

    try {
      const resultAction = await dispatch(updateUserFetchUser(formData));
      const updatedUser = unwrapResult(resultAction);

      setIsRedactorMode(REDACTOR_MODE_OFF);
      setServerError(undefined);
      dispatch(updateUserUsers(mapUserFromDto(updatedUser)));
    } catch (err: any) {
      setServerError(err?.message ?? 'Произошла ошибка');
    }
  };

  const inputHandler = (field: keyof UserDTO) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (serverError) {
      setServerError(undefined);
      setErrors({});
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField({ field, value });
  };

  return (
    <div className={style.content}>
      <section className={style.profile}>
        <div className={style.header_field}>
          <span className={style.name}>{user?.fullName}</span>
          <span
            className={clsx(style.role, {
              [staticStyle.role_employee]: user?.role === 'сотрудник',
              [staticStyle.role_manager]: user?.role === 'руководитель',
              [staticStyle.role_admin]: user?.role === 'администратор',
            })}
          >
            {user?.role}
          </span>
        </div>
        <div className={style.field}>
          <span className={style.title}>Подразделение: </span>
          {user?.unit}
        </div>
        <div className={style.field}>
          <span className={style.title}>Должность: </span>
          {user?.position}
        </div>
        <div className={style.field}>
          <span className={style.title}>Телефон: </span>
          <div className={style.change_value}>
            {isRedactorMode.field === 'telephone' ? (
              <>
                <Input
                  inputRef={phoneInputRef}
                  type="phone"
                  value={formData.telephone}
                  error={
                    <span className={clsx(staticStyle.error, style.input_error)}>
                      {serverError?.message ?? errors.telephone}
                    </span>
                  }
                  onChange={inputHandler('telephone')}
                  lableClassName={style.lable_change_input}
                  className={clsx(
                    style.change_input,
                    (serverError || errors.telephone) && style.change_input_not_valid,
                    isUpdateUserPending && style.change_input_proccess
                  )}
                  disabled={isUpdateUserPending}
                />
                {isUpdateUserPending && (
                  <Loader loaderClass={clsx(style.loader, staticStyle.loader)} />
                )}
              </>
            ) : (
              <>
                <span className={style.value}>{user?.telephone}</span>
                <button
                  type="button"
                  className={clsx(style.change_button, isUpdateUserPending && style.disable)}
                  onClick={() => setIsRedactorMode({ isOn: true, field: 'telephone' })}
                  disabled={isUpdateUserPending}
                >
                  <PenIcon />
                </button>
              </>
            )}
          </div>
        </div>
        <div className={style.field}>
          <span className={style.title}>Почта: </span>
          <div className={style.change_value}>
            {isRedactorMode.field === 'email' ? (
              <>
                <Input
                  inputRef={emailInputRef}
                  type="email"
                  value={formData.email}
                  error={
                    <span className={clsx(staticStyle.error, style.input_error)}>
                      {serverError?.message ?? errors.email}
                    </span>
                  }
                  onChange={inputHandler('email')}
                  lableClassName={style.lable_change_input}
                  className={clsx(
                    style.change_input,
                    (serverError || errors.email) && style.change_input_not_valid,
                    isUpdateUserPending && style.change_input_proccess
                  )}
                  disabled={isUpdateUserPending}
                />
                {isUpdateUserPending && (
                  <Loader loaderClass={clsx(style.loader, staticStyle.loader)} />
                )}
              </>
            ) : (
              <>
                <span className={style.value}>{user?.email}</span>
                <button
                  type="button"
                  className={clsx(style.change_button, isUpdateUserPending && style.disable)}
                  onClick={() => setIsRedactorMode({ isOn: true, field: 'email' })}
                  disabled={isUpdateUserPending}
                >
                  <PenIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
