import clsx from 'clsx';
import style from './UpdateUserForm.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';

import { ApiError, FullUserDTO, UpdateUserDTO } from '@custom-types/types';
import { useFormValidation } from '@hooks/useFormValidation';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CreateUserDTO, Role, USER_ROLES } from '@custom-types/types';
import { UPDATE_USER_VALIDATOR } from '@constants/validators';
import { useDispatch, useSelector } from '@services/store';

import { Input } from '@components/ui/Input';
import { FieldErorr } from '../FormComponents/FieldErorr';
import { FieldTitle } from '../FormComponents/FieldTitle';
import { Select } from '@components/ui/Select';

import { selectErrorsUsers, selectStatusUsers, updateUserFetchUsers } from '@services/usersSlice';

type UpdateUserFormProps = {
  user: FullUserDTO;
  onClose: () => void;
};

export const UpdateUserForm = ({ user, onClose }: UpdateUserFormProps) => {
  const dispatch = useDispatch();
  const { isUpdateUserPending } = useSelector((state) =>
    selectStatusUsers.unwrapped(state.usersReducer)
  );
  const { updateUserError } = useSelector((state) =>
    selectErrorsUsers.unwrapped(state.usersReducer)
  );

  const [serverError, setServerError] = useState<ApiError | undefined>(undefined);
  const [formData, setFormData] = useState<UpdateUserDTO>(user);
  const validator = useFormValidation<UpdateUserDTO>(UPDATE_USER_VALIDATOR);

  const inputRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    return validator.isAllValid(formData);
  }, [formData]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (updateUserError) {
      setServerError(updateUserError);
    }
  }, [updateUserError]);

  const changeHandler = useCallback(
    (field: keyof CreateUserDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validator.validateField({ field, value });
        setServerError(undefined);
      },
    [validator.validateField, setServerError]
  );

  const onCloseHandler = useCallback(() => {
    setServerError(undefined);
    onClose();
  }, [setServerError, onClose]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!validator.validateAll(formData)) return;
    console.log(formData);
    setServerError(undefined);
    dispatch(updateUserFetchUsers(formData));
  };

  return (
    <div className={style.content}>
      <form className={style.form} onSubmit={submitHandler}>
        <div className={style.options}>
          <Input
            className={clsx(
              validator.errors.full_name && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            inputRef={inputRef}
            lableClassName={style.lable_input}
            type="text"
            name="name"
            value={formData.full_name}
            onChange={changeHandler('full_name')}
            error={<FieldErorr>{validator.errors.full_name}</FieldErorr>}
            inputTitle={<span className={formStyle.field_title}>ФИО</span>}
            disabled={isUpdateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.unit && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="unti"
            value={formData.unit}
            onChange={changeHandler('unit')}
            error={<FieldErorr>{validator.errors.unit}</FieldErorr>}
            inputTitle={<FieldTitle>Подразделение</FieldTitle>}
            disabled={isUpdateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.position && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="position"
            value={formData.position}
            onChange={changeHandler('position')}
            error={<FieldErorr>{validator.errors.position}</FieldErorr>}
            inputTitle={<FieldTitle>Должность</FieldTitle>}
            disabled={isUpdateUserPending}
          ></Input>
          <label className={style.label_select}>
            <span className={formStyle.field_title}>Роль</span>
            <Select<Role>
              onChange={changeHandler('role')}
              options={USER_ROLES}
              value={formData.role as Role}
              placeholder="- Выберите -"
              className={clsx(
                formStyle.select,
                validator.errors.role && formStyle.input_not_valid,
                isUpdateUserPending && formStyle.select_disable
              )}
              disabled={isUpdateUserPending}
            />
            <span className={staticStyle.error}>{validator.errors.role}</span>
          </label>
          <Input
            className={clsx(
              validator.errors.telephone && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={changeHandler('telephone')}
            error={<FieldErorr>{validator.errors.telephone}</FieldErorr>}
            inputTitle={<FieldTitle>Телефон</FieldTitle>}
            disabled={isUpdateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.email && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="email"
            value={formData.email}
            onChange={changeHandler('email')}
            error={<FieldErorr>{validator.errors.email}</FieldErorr>}
            inputTitle={<FieldTitle>Почта</FieldTitle>}
            disabled={isUpdateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.login && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="login"
            value={formData.login}
            onChange={changeHandler('login')}
            error={<FieldErorr>{validator.errors.login}</FieldErorr>}
            inputTitle={<FieldTitle>Логин</FieldTitle>}
            disabled={isUpdateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.password && formStyle.input_not_valid,
              isUpdateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="password"
            value={formData.password}
            onChange={changeHandler('password')}
            error={<FieldErorr>{validator.errors.password}</FieldErorr>}
            inputTitle={<FieldTitle>Пароль</FieldTitle>}
            disabled={isUpdateUserPending}
          ></Input>
        </div>
        <span className={staticStyle.error}>{serverError?.message}</span>
        <div className={style.controls}>
          <button
            type="submit"
            className={clsx(
              formStyle.confirm_button,
              (!isFormValid || isUpdateUserPending) && formStyle.disabled
            )}
            disabled={!isFormValid || isUpdateUserPending}
          >
            {isUpdateUserPending ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className={clsx(formStyle.close_button, isUpdateUserPending && formStyle.disabled)}
            onClick={onCloseHandler}
            disabled={isUpdateUserPending}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
