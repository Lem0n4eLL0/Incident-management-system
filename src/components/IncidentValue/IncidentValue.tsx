import clsx from 'clsx';
import style from './IncidentValue.module.css';
import saticStyle from '@style/common.module.css';
type IncidentValueProps = {
  value: number;
  description: string;
  difference?: number;
  clasName?: string;
};

export const IncidentValue = ({ value, description, difference, clasName }: IncidentValueProps) => {
  const getDifferenceClass = () => {
    if (!difference) return saticStyle.statistic_neutral;
    return difference < 0 ? saticStyle.statistic_exceeds : saticStyle.statistic_worse;
  };

  const formattedDifference = difference ? (difference < 0 ? difference : `+${difference}`) : null;
  return (
    <div className={clsx(clasName, style.content)}>
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
