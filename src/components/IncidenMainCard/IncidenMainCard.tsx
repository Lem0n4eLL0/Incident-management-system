import { Incident } from '@custom-types/types';
import style from './IncidenMainCard.module.css';
import staticStyle from '@style/common.module.css';
import clsx from 'clsx';

type IncidenMainCardProps = {
  incident: Incident;
};

export const IncidenMainCard = ({ incident }: IncidenMainCardProps) => {
  if (!incident) return null;

  return (
    <div className={style.content}>
      <div className={style.card_header}>
        <h2 className={style.incident_title}>{`Происшествие №${incident.incidentNumber}`}</h2>
        <span
          className={clsx(staticStyle.status, {
            [staticStyle.status_consideration]: incident.status === 'на рассмотрении',
            [staticStyle.status_underway]: incident.status === 'в работе',
            [staticStyle.status_completed]: incident.status === 'завершено',
            [staticStyle.hidden]: !incident.status,
          })}
        >
          {incident.status}
        </span>
      </div>
      <div className={style.card_content}>
        <div className={clsx(style.text_field, staticStyle.text_block)}>{incident.description}</div>
        <div className={style.field}>
          <span className={style.field_title}>Подразделение: </span>
          {incident.unit}
        </div>
        <div className={style.field}>
          <span className={style.field_title}>Тип: </span>
          {incident.type}
        </div>
        <div className={style.field}>
          <span className={style.field_title}>Автор: </span>
          {incident.author.fullName}
        </div>
      </div>
      <div className={style.card_footer}>
        <div className={staticStyle.date}>{incident.date?.toLocaleDateString('ru-RU')}</div>
        <div>
          <span className={style.field_title}>Ответственный: </span>
          {incident.responsible ?? 'нет'}
        </div>
      </div>
    </div>
  );
};
