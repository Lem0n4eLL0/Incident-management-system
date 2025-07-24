import style from './AddIncidentForm.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';

import {
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  IncidentDTO,
  IncidentStatus,
  IncidentType,
} from '@custom-types/types';
import { Select } from '@ui/Select';
import clsx from 'clsx';
import { selectUser } from '@services/userSlice';
import { useDispatch, useSelector } from '@services/store';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { EMPTY_INCIDENTDTO } from '@constants/constants';
import { useFormValidation } from '@hooks/useFormValidation';
import { Input } from '@components/ui/Input';
import { mapUserToDto } from '@custom-types/mapperDTO';
import { getValidatableIncidentFields, INCIDENT_VALIDATORS } from '@constants/validators';
import { addIncident, selectErrorsIncidents, selectStatusIncidents } from '@services/incidentSlice';
import { FieldErorr } from '../FormComponents/FieldErorr';
import { FieldTitle } from '../FormComponents/FieldTitle';

type AddIncidentFormProps = {
  onClose: () => void;
};

export const AddIncidentForm = ({ onClose }: AddIncidentFormProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { addIncidentError } = useSelector((state) =>
    selectErrorsIncidents.unwrapped(state.incidentsReducer)
  );
  const { isAddIncidentPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IncidentDTO>(EMPTY_INCIDENTDTO);
  const validator = useFormValidation<IncidentDTO>(INCIDENT_VALIDATORS);

  const inputRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    return validator.isAllValid(getValidatableIncidentFields(formData));
  }, [formData]);

  const onCloseHandler = useCallback(() => {
    setServerError('');
    onClose();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: mapUserToDto(user),
        unit: user.unit,
      }));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: mapUserToDto(user),
        unit: user.unit,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isAddIncidentPending) {
      return;
    } else if (addIncidentError?.message) {
      setServerError(addIncidentError.message);
    }
  }, [isAddIncidentPending]);

  const changeHandler = useCallback(
    (field: keyof IncidentDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validator.validateField({ field, value });
        setServerError('');
      },
    [validator.validateField, setServerError]
  );

  const submitHandler = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validator.validateAll(getValidatableIncidentFields(formData))) {
        return;
      }
      console.log(formData);
      dispatch(addIncident(formData));
    },
    [formData, validator.validateAll, dispatch]
  );

  return (
    <div className={style.content}>
      <h2 className={staticStyle.modal_title}>Создание инцедента</h2>
      <form className={style.form} onSubmit={submitHandler}>
        <div className={style.options}>
          <Input
            className={clsx(
              validator.errors.incident_number && formStyle.input_not_valid,
              formStyle.input
            )}
            inputRef={inputRef}
            lableClassName={style.lable_input}
            type="text"
            name="number"
            value={formData.incident_number}
            onChange={changeHandler('incident_number')}
            error={<FieldErorr>{validator.errors.incident_number}</FieldErorr>}
            inputTitle={<FieldTitle>Номер</FieldTitle>}
            disabled={isAddIncidentPending}
          ></Input>
          <label className={style.label_select}>
            <FieldTitle>Тип</FieldTitle>
            <Select<IncidentType>
              name={'type'}
              onChange={changeHandler('type')}
              options={INCIDENT_TYPES}
              value={formData.type as IncidentType}
              placeholder="- Выберите -"
              className={clsx(
                formStyle.select,
                validator.errors.type && formStyle.input_not_valid,
                isAddIncidentPending && formStyle.select_disable
              )}
              disabled={isAddIncidentPending}
            />
            <FieldErorr>{validator.errors.type}</FieldErorr>
          </label>
          <Input
            className={clsx(validator.errors.date && formStyle.input_not_valid, formStyle.input)}
            lableClassName={style.lable_input}
            type="date"
            name="date"
            value={formData.date}
            onChange={changeHandler('date')}
            error={<FieldErorr>{validator.errors.date}</FieldErorr>}
            inputTitle={<FieldTitle>Дата</FieldTitle>}
            disabled={isAddIncidentPending}
          ></Input>
          <label className={style.label_textarea}>
            <FieldTitle>Описание</FieldTitle>
            <textarea
              className={clsx(
                formStyle.textarea,
                validator.errors.description && formStyle.input_not_valid,
                isAddIncidentPending && formStyle.textarea_disable
              )}
              name="description"
              placeholder="Введите описание..."
              value={formData.description}
              onChange={changeHandler('description')}
              disabled={isAddIncidentPending}
            ></textarea>
            <FieldErorr>{validator.errors.description}</FieldErorr>
          </label>
          <Input
            className={clsx(formStyle.input_disable, formStyle.input)}
            lableClassName={style.lable_input}
            type="text"
            name="autor"
            value={formData.author.full_name}
            inputTitle={<FieldTitle>Автор</FieldTitle>}
            disabled
          ></Input>

          <Input
            className={clsx(formStyle.input_disable, formStyle.input)}
            lableClassName={style.lable_input}
            type="text"
            name="unit"
            value={formData.author.unit}
            inputTitle={<FieldTitle>Подразделение</FieldTitle>}
            disabled
          ></Input>

          <label className={style.label_select}>
            <FieldTitle>Статус</FieldTitle>
            <Select<IncidentStatus>
              onChange={changeHandler('status')}
              options={INCIDENT_STATUSES}
              value={formData.status as IncidentStatus}
              placeholder="- Выберите -"
              className={clsx(formStyle.select, isAddIncidentPending && formStyle.select_disable)}
              disabled={isAddIncidentPending}
            />
            {/* переделать с сервера возможно*/}
          </label>
          <label className={style.label_textarea}>
            <FieldTitle>Принятые меры</FieldTitle>
            <textarea
              placeholder="Введите описание..."
              name="measures_taken"
              value={formData.measures_taken}
              onChange={changeHandler('measures_taken')}
              className={clsx(
                formStyle.textarea,
                isAddIncidentPending && formStyle.textarea_disable
              )}
              disabled={isAddIncidentPending}
            ></textarea>
          </label>
          <Input
            className={formStyle.input}
            lableClassName={style.lable_input}
            type="text"
            name="responsible"
            value={formData.responsible}
            onChange={changeHandler('responsible')}
            inputTitle={<FieldTitle>Ответственный</FieldTitle>}
            disabled={isAddIncidentPending}
          ></Input>
        </div>
        <span className={staticStyle.error}>{serverError}</span>
        <div className={style.controls}>
          <button
            type="submit"
            className={clsx(
              formStyle.confirm_button,
              (!isFormValid || isAddIncidentPending) && formStyle.disabled
            )}
            disabled={!isFormValid || isAddIncidentPending}
          >
            {isAddIncidentPending ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className={clsx(formStyle.close_button, isAddIncidentPending && formStyle.disabled)}
            onClick={onCloseHandler}
            disabled={isAddIncidentPending}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
