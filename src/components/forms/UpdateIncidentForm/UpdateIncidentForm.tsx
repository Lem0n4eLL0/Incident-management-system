import style from './UpdateIncidentForm.module.css';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormValidation } from '@hooks/useFormValidation';
import { Input } from '@components/ui/Input';
import { mapUserToDto } from '@custom-types/mapperDTO';
import { getValidatableIncidentFields, INCIDENT_VALIDATORS } from '@constants/validators';
import {
  selectErrorsIncidents,
  selectStatusIncidents,
  updateIncident,
} from '@services/incidentSlice';
import { formatDate } from '@utils/dateFormatter';

type UpdateIncidentFormProps = {
  onClose: () => void;
  incident: IncidentDTO;
};

export const UpdateIncidentForm = ({ onClose, incident }: UpdateIncidentFormProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { updateIncidentError } = useSelector((state) =>
    selectErrorsIncidents.unwrapped(state.incidentsReducer)
  );
  const { isUpdateIncidentPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IncidentDTO>(incident);
  const validator = useFormValidation<IncidentDTO>(INCIDENT_VALIDATORS);

  const inputRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    return validator.isAllValid(getValidatableIncidentFields(formData));
  }, [formData]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: mapUserToDto(user),
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isUpdateIncidentPending) {
      return;
    } else if (updateIncidentError?.message) {
      setServerError(updateIncidentError.message);
    }
  }, [isUpdateIncidentPending]);

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
      dispatch(updateIncident(formData));
    },
    [formData, validator.validateAll, dispatch]
  );

  return (
    <div className={style.content}>
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
            error={
              <span className={clsx(staticStyle.error, formStyle.input_error)}>
                {validator.errors.incident_number}
              </span>
            }
            inputTitle={<span className={formStyle.field_title}>Номер</span>}
          ></Input>
          <label className={style.label_select}>
            <span className={formStyle.field_title}>Тип</span>
            <Select<IncidentType>
              name={'type'}
              onChange={changeHandler('type')}
              options={INCIDENT_TYPES}
              value={formData.type as IncidentType}
              placeholder="- Выберите -"
              className={clsx(formStyle.select, validator.errors.type && formStyle.input_not_valid)}
            />
            <span className={staticStyle.error}>{validator.errors.type}</span>
            {/* переделать с сервера */}
          </label>
          <Input
            className={clsx(validator.errors.date && formStyle.input_not_valid, formStyle.input)}
            lableClassName={style.lable_input}
            type="date"
            name="date"
            value={formatDate(formData.date)}
            onChange={changeHandler('date')}
            error={
              <span className={clsx(staticStyle.error, formStyle.input_error)}>
                {validator.errors.date}
              </span>
            }
            inputTitle={<span className={formStyle.field_title}>Дата</span>}
          ></Input>
          <label className={style.label_textarea}>
            <span className={formStyle.field_title}>Описание</span>
            <textarea
              className={clsx(
                validator.errors.description && formStyle.input_not_valid,
                formStyle.textarea
              )}
              name="description"
              placeholder="Введите описание..."
              value={formData.description}
              onChange={changeHandler('description')}
            ></textarea>
            <span className={staticStyle.error}>{validator.errors.description}</span>
          </label>
          <Input
            className={clsx(formStyle.input_disable, formStyle.input)}
            lableClassName={style.lable_input}
            type="text"
            name="autor"
            value={formData.author.full_name}
            inputTitle={<span className={formStyle.field_title}>Автор</span>}
            disabled
          ></Input>

          <Input
            className={clsx(formStyle.input_disable, formStyle.input)}
            lableClassName={style.lable_input}
            type="text"
            name="unit"
            value={formData.author.unit}
            inputTitle={<span className={formStyle.field_title}>Подразделение</span>}
            disabled
          ></Input>

          <label className={style.label_select}>
            <span className={formStyle.field_title}>Статус</span>
            <Select<IncidentStatus>
              onChange={changeHandler('status')}
              options={INCIDENT_STATUSES}
              value={formData.status as IncidentStatus}
              placeholder="- Выберите -"
              className={formStyle.select}
            />
            {/* переделать с сервера возможно*/}
          </label>
          <label className={style.label_textarea}>
            <span className={formStyle.field_title}>Принятые меры</span>
            <textarea
              placeholder="Введите описание..."
              name="measures_taken"
              value={formData.measures_taken}
              onChange={changeHandler('measures_taken')}
              className={formStyle.textarea}
            ></textarea>
          </label>
          <Input
            className={formStyle.input}
            lableClassName={style.lable_input}
            type="text"
            name="responsible"
            value={formData.responsible}
            onChange={changeHandler('responsible')}
            inputTitle={<span className={formStyle.field_title}>Ответственный</span>}
          ></Input>
        </div>
        <span className={staticStyle.error}>{serverError}</span>
        <div className={style.controls}>
          <button
            type="submit"
            className={clsx(
              formStyle.confirm_button,
              (!isFormValid || isUpdateIncidentPending) && formStyle.disabled
            )}
            disabled={!isFormValid}
          >
            {isUpdateIncidentPending ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className={clsx(formStyle.close_button, isUpdateIncidentPending && formStyle.disabled)}
            onClick={onClose}
            disabled={isUpdateIncidentPending}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
