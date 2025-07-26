import style from './AddUserForm.module.css';
import formStyle from '@style/form.module.css';
import staticStyle from '@style/common.module.css';
import clsx from 'clsx';
import { useFormValidation } from '@hooks/useFormValidation';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CreateUserDTO, Role, USER_ROLES } from '@custom-types/types';
import { EMPTY_CREATE_USERDTO } from '@constants/constants';
import { CREATE_USER_VALIDATOR } from '@constants/validators';
import { useDispatch, useSelector } from '@services/store';
import { createUser, selectErrorsUsers, selectStatusUsers } from '@services/usersSlice';
import { Input } from '@components/ui/Input';
import { FieldErorr } from '../FormComponents/FieldErorr';
import { FieldTitle } from '../FormComponents/FieldTitle';
import { Select } from '@components/ui/Select';

type AddUserFormProps = {
  onClose: () => void;
};

export const AddUserForm = ({ onClose }: AddUserFormProps) => {
  const dispatch = useDispatch();
  const { isCreateUserPending } = useSelector((state) =>
    selectStatusUsers.unwrapped(state.usersReducer)
  );
  const { createUserError } = useSelector((state) =>
    selectErrorsUsers.unwrapped(state.usersReducer)
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserDTO>(EMPTY_CREATE_USERDTO);
  const validator = useFormValidation<CreateUserDTO>(CREATE_USER_VALIDATOR);

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
    if (isCreateUserPending) {
      return;
    } else if (createUserError?.message) setServerError(createUserError.message);
  }, [isCreateUserPending, setServerError]);

  const changeHandler = useCallback(
    (field: keyof CreateUserDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validator.validateField({ field, value });
        setServerError('');
      },
    [validator.validateField, setServerError]
  );

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!validator.validateAll(formData)) {
      return;
    }
    dispatch(createUser(formData));
  };

  return (
    <div className={style.content}>
      <h2 className={staticStyle.modal_title}>Создание пользователя</h2>
      <form className={style.form} onSubmit={submitHandler}>
        <div className={style.options}>
          <Input
            className={clsx(
              validator.errors.full_name && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
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
            disabled={isCreateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.unit && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="unti"
            value={formData.unit}
            onChange={changeHandler('unit')}
            error={<FieldErorr>{validator.errors.unit}</FieldErorr>}
            inputTitle={<FieldTitle>Подразделение</FieldTitle>}
            disabled={isCreateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.position && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="position"
            value={formData.position}
            onChange={changeHandler('position')}
            error={<FieldErorr>{validator.errors.position}</FieldErorr>}
            inputTitle={<FieldTitle>Должность</FieldTitle>}
            disabled={isCreateUserPending}
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
                isCreateUserPending && formStyle.select_disable
              )}
              disabled={isCreateUserPending}
            />
            <span className={staticStyle.error}>{validator.errors.role}</span>
          </label>
          <Input
            className={clsx(
              validator.errors.telephone && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={changeHandler('telephone')}
            error={<FieldErorr>{validator.errors.telephone}</FieldErorr>}
            inputTitle={<FieldTitle>Телефон</FieldTitle>}
            disabled={isCreateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.email && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="email"
            value={formData.email}
            onChange={changeHandler('email')}
            error={<FieldErorr>{validator.errors.email}</FieldErorr>}
            inputTitle={<FieldTitle>Почта</FieldTitle>}
            disabled={isCreateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.login && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="login"
            value={formData.login}
            onChange={changeHandler('login')}
            error={<FieldErorr>{validator.errors.login}</FieldErorr>}
            inputTitle={<FieldTitle>Логин</FieldTitle>}
            disabled={isCreateUserPending}
          ></Input>
          <Input
            className={clsx(
              validator.errors.password && formStyle.input_not_valid,
              isCreateUserPending && formStyle.input_disable,
              formStyle.input
            )}
            lableClassName={style.lable_input}
            type="text"
            name="password"
            value={formData.password}
            onChange={changeHandler('password')}
            error={<FieldErorr>{validator.errors.password}</FieldErorr>}
            inputTitle={<FieldTitle>Пароль</FieldTitle>}
            disabled={isCreateUserPending}
          ></Input>
        </div>
        <span className={staticStyle.error}>{serverError}</span>
        <div className={style.controls}>
          <button
            type="submit"
            className={clsx(
              formStyle.confirm_button,
              (!isFormValid || isCreateUserPending) && formStyle.disabled
            )}
            disabled={!isFormValid || isCreateUserPending}
          >
            {isCreateUserPending ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className={clsx(formStyle.close_button, isCreateUserPending && formStyle.disabled)}
            onClick={onClose}
            disabled={isCreateUserPending}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
