import clsx from 'clsx';
import style from './IncidentValue.module.css';
type IncidentValueProps = {
  value: number;
  description: string;
  difference?: number;
};

export const IncidentValue = ({ value, description, difference }: IncidentValueProps) => {
  const getDifferenceClass = () => {
    if (!difference) return style.statistic_neutral;
    return difference < 0 ? style.statistic_exceeds : style.statistic_worse;
  };

  const formattedDifference = difference ? (difference < 0 ? difference : `+${difference}`) : null;
  return (
    <div className={style.content}>
      <h2 className={style.description}>{description}</h2>
      <div className={style.summary}>
        <span className={clsx(style.value, getDifferenceClass())}>{value}</span>
        {formattedDifference && (
          <span className={clsx(style.difference, getDifferenceClass())}>
            {formattedDifference}
          </span>
        )}
      </div>
    </div>
  );
};
