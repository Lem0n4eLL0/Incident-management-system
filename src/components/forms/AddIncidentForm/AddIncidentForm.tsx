import {
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  IncidentDTO,
  IncidentStatus,
  IncidentType,
} from '@custom-types/types';
import { Select } from '@ui/Select';
import style from './AddIncidentForm.module.css';
import staticStyle from '@style/common.module.css';
import clsx from 'clsx';
import { selectUser } from '@services/userSlice';
import { useSelector } from '@services/store';
import { useEffect, useMemo, useState } from 'react';
import { EMPTY_INCIDENTDTO } from '@constants/constants';
import { TFormValidators, useFormValidation } from '@hooks/useFormValidation';
import { Input } from '@components/ui/Input';
import { mapUserToDto } from '@custom-types/mapperDTO';

export const ADD_INCIDENT_VALIDATORS: Partial<TFormValidators<IncidentDTO>> = {
  incident_number: {
    validator: (value) => value.trim().length > 0,
    message: 'Обязательно для заполнения',
  },
  type: {
    validator: (value) => value.trim().length > 0,
    message: 'Обязательно для заполнения',
  },
  date: {
    validator: (value) =>
      value.trim().length > 0 && new Date(value).getTime() < new Date().getTime(),
    message: 'Неверный формат даты',
  },
  description: {
    validator: (value) => value.trim().length > 0,
    message: 'Описание обязательно',
  },
};

const getValidatableFields = (data: IncidentDTO) => {
  const { incident_number, type, date, description } = data;
  return { incident_number, type, date, description };
};

type AddIncidentFormProps = {
  onClose: () => void;
};

export const AddIncidentForm = ({ onClose }: AddIncidentFormProps) => {
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const [formData, setFormData] = useState<IncidentDTO>(EMPTY_INCIDENTDTO);
  const { errors, isAllValid, validateField, validateAll } =
    useFormValidation<IncidentDTO>(ADD_INCIDENT_VALIDATORS);

  const isFormValid = useMemo(() => {
    return isAllValid(getValidatableFields(formData));
  }, [formData]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: mapUserToDto(user),
      }));
    }
  }, [user]);

  const changeHandler =
    (field: keyof IncidentDTO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      validateField({ field, value });
    };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll(getValidatableFields(formData))) {
      // Отправка запроса
    }
  };

  return (
    <div className={style.content}>
      <h2 className={staticStyle.modal_title}>Создание инцедента</h2>
      <form id="add_incident" className={style.form} onSubmit={submitHandler}>
        <div className={style.options}>
          <Input
            className={clsx(errors.incident_number && style.input_not_valid, style.input)}
            lableClassName={style.lable_input}
            type="text"
            name="number"
            value={formData.incident_number}
            onChange={changeHandler('incident_number')}
            error={
              <span className={clsx(staticStyle.error, style.input_error)}>
                {errors.incident_number}
              </span>
            }
            inputTitle={<span className={style.field_title}>Номер</span>}
          ></Input>
          <label className={style.label_select}>
            <span className={style.field_title}>Тип</span>
            <Select<IncidentType>
              name={'type'}
              onChange={changeHandler('type')}
              options={INCIDENT_TYPES}
              value={formData.type as IncidentType}
              placeholder="- Выберете -"
              className={clsx(style.select, errors.type && style.input_not_valid)}
            />
            <span className={staticStyle.error}>{errors.type}</span>
            {/* переделать с сервера */}
          </label>
          <Input
            className={clsx(errors.date && style.input_not_valid, style.input)}
            lableClassName={style.lable_input}
            type="date"
            name="date"
            value={formData.date}
            onChange={changeHandler('date')}
            error={
              <span className={clsx(staticStyle.error, style.input_error)}>{errors.date}</span>
            }
            inputTitle={<span className={style.field_title}>Дата</span>}
          ></Input>
          <label className={style.label_textarea}>
            <span className={style.field_title}>Описание</span>
            <textarea
              className={clsx(errors.description && style.input_not_valid, style.textarea)}
              name="description"
              placeholder="Введите описание..."
              value={formData.description}
              onChange={changeHandler('description')}
            ></textarea>
            <span className={staticStyle.error}>{errors.description}</span>
          </label>
          <Input
            className={clsx(style.input_disable, style.input)}
            lableClassName={style.lable_input}
            type="text"
            name="autor"
            value={formData.author.full_name}
            inputTitle={<span className={style.field_title}>Автор</span>}
            disabled
          ></Input>

          <Input
            className={clsx(style.input_disable, style.input)}
            lableClassName={style.lable_input}
            type="text"
            name="unit"
            value={formData.author.unit}
            inputTitle={<span className={style.field_title}>Подразделение</span>}
            disabled
          ></Input>

          <label className={style.label_select}>
            <span className={style.field_title}>Статус</span>
            <Select<IncidentStatus>
              onChange={changeHandler('status')}
              options={INCIDENT_STATUSES}
              value={formData.status as IncidentStatus}
              placeholder="- Выберете -"
              className={style.select}
            />
            {/* переделать с сервера возможно*/}
          </label>
          <label className={style.label_textarea}>
            <span className={style.field_title}>Принятые меры</span>
            <textarea
              placeholder="Введите описание..."
              name="measures_taken"
              value={formData.measures_taken}
              onChange={changeHandler('measures_taken')}
              className={style.textarea}
            ></textarea>
          </label>
          <Input
            className={style.input}
            lableClassName={style.lable_input}
            type="text"
            name="responsible"
            value={formData.responsible}
            onChange={changeHandler('responsible')}
            inputTitle={<span className={style.field_title}>Ответственный</span>}
          ></Input>
        </div>
        <div className={style.controls}>
          <button
            type="submit"
            className={clsx(
              style.controls_button,
              style.confirm_button,
              !isFormValid && style.form_not_valid
            )}
            disabled={!isFormValid}
          >
            Сохранить
          </button>
          <button
            type="button"
            className={clsx(style.controls_button, style.close_button)}
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
