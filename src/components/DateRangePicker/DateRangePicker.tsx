import { DateRange } from '@custom-types/types';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns';
import style from './DateRangePicker.module.css';
import formStyle from '@style/form.module.css';
import clsx from 'clsx';

const quickRanges: { lable: string; range: DateRange }[] = [
  {
    lable: 'тек. мес.',
    range: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
  },
  {
    lable: 'прошл. мес.',
    range: {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    },
  },
  {
    lable: 'тек. год',
    range: {
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    },
  },
  {
    lable: 'прош. год',
    range: {
      from: startOfYear(subYears(new Date(), 1)),
      to: endOfYear(subYears(new Date(), 1)),
    },
  },
];

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  isValid: boolean;
};

export const DateRangePicker = ({ value, onChange, isValid }: DateRangePickerProps) => {
  return (
    <div className={style.content}>
      <div className={style.lable}>
        <span className={formStyle.field_title}>Быстрый выбор</span>
        <div className={style.controls}>
          {quickRanges.map((el) => (
            <button
              key={el.lable}
              className={style.range_button}
              onClick={() => onChange(el.range)}
            >
              {el.lable}
            </button>
          ))}
        </div>
      </div>

      <label className={style.lable}>
        <span className={formStyle.field_title}>Выбор вручную</span>
        <div className={style.input_block}>
          <input
            type="date"
            className={clsx(formStyle.input, !isValid && formStyle.input_not_valid)}
            value={value.from ? value.from.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              onChange({ ...value, from: e.target.value ? new Date(e.target.value) : undefined })
            }
          />
          <input
            type="date"
            className={clsx(formStyle.input, !isValid && formStyle.input_not_valid)}
            value={value.to ? value.to.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              onChange({ ...value, to: e.target.value ? new Date(e.target.value) : undefined })
            }
          />
        </div>
      </label>
    </div>
  );
};
