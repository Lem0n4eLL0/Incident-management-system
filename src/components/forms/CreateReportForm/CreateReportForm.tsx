import style from './CreateReportForm.module.css';
import staticStyle from '@style/common.module.css';
import formStyle from '@style/form.module.css';
import clsx from 'clsx';
import { FieldTitle } from '../FormComponents/FieldTitle';
import { Select } from '@components/ui/Select';
import { FieldErorr } from '../FormComponents/FieldErorr';
import { selectIncidents } from '@services/incidentSlice';
import { useCallback, useMemo, useState } from 'react';
import { useFormValidation } from '@hooks/useFormValidation';
import {
  CreateReportData,
  DateRange,
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  IncidentStatus,
  IncidentType,
} from '@custom-types/types';
import { useSelector } from '@services/store';
import { startOfYear } from 'date-fns';
import { Input } from '@components/ui/Input';
import { DateRangePicker } from '@components/DateRangePicker/DateRangePicker';
import { CREATE_REPOT_DATA_VALIDATORS } from '@constants/validators';
import { replace, useNavigate } from 'react-router-dom';

type CreateReportFormProps = {
  onClose: () => void;
};

const EMPTY_CREATE_REPOT_DATA: CreateReportData = {
  dateRange: {
    from: startOfYear(new Date()),
    to: new Date(),
  },
};

const getValidatableReportDataFields = (data: CreateReportData) => {
  const { dateRange } = data;
  return { dateRange };
};

export const CreateReportForm = ({ onClose }: CreateReportFormProps) => {
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateReportData>(EMPTY_CREATE_REPOT_DATA);
  const validator = useFormValidation<CreateReportData>(CREATE_REPOT_DATA_VALIDATORS);

  const changeHandler = useCallback(
    (field: keyof CreateReportData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validator.validateField({ field, value });
      },
    [validator.validateField]
  );

  const isFormValid = useMemo(() => {
    return validator.isAllValid(getValidatableReportDataFields(formData));
  }, [formData]);

  const createReportHandler = useCallback(() => {
    navigate('/report', { state: { reportData: formData } });
  }, [formData]);

  return (
    <div className={style.content}>
      <h2 className={staticStyle.modal_title}>Фильтры отчета</h2>
      <div className={style.form}>
        <div className={style.options}>
          <DateRangePicker
            value={formData?.dateRange ?? { from: startOfYear(new Date()), to: new Date() }}
            onChange={(range) => {
              console.log(range);
              setFormData((prev) => ({ ...prev, dateRange: range }));
              validator.validateField({ field: 'dateRange', value: range });
            }}
            isValid={!validator.errors.dateRange}
          />
          <Input
            className={formStyle.input}
            lableClassName={style.lable_input}
            type="text"
            name="name"
            value={formData.unit}
            onChange={changeHandler('unit')}
            inputTitle={<span className={formStyle.field_title}>Подразделение</span>}
          ></Input>
          <label className={style.label_select}>
            <FieldTitle>Тип</FieldTitle>
            <Select<IncidentType>
              onChange={changeHandler('type')}
              options={INCIDENT_TYPES}
              value={formData.type}
              placeholder="- Выберите -"
              className={formStyle.select}
            />
          </label>

          <label className={style.label_select}>
            <FieldTitle>Статус</FieldTitle>
            <Select<IncidentStatus>
              onChange={changeHandler('status')}
              options={INCIDENT_STATUSES}
              value={formData.status}
              placeholder="- Выберите -"
              className={formStyle.select}
            />
          </label>
        </div>
        <span className={staticStyle.error}>{validator.errors.dateRange}</span>
        <div className={style.controls}>
          <button
            type="button"
            className={clsx(formStyle.confirm_button, !isFormValid && formStyle.disabled)}
            onClick={createReportHandler}
            disabled={!isFormValid}
          >
            Продолжить
          </button>
          <button type="button" className={formStyle.close_button} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
