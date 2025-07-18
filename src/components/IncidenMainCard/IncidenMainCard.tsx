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
        <h2>{`Происшествие №${incident.incidentNumber}`}</h2>
        <span
          className={clsx(staticStyle.status, {
            [staticStyle.status_underway]: incident.status === 'на рассмотрении',
            [staticStyle.status_consideration]: incident.status === 'в работе',
            [staticStyle.status_completed]: incident.status === 'завершено',
          })}
        >
          {incident.status}
        </span>
      </div>
      <div className={style.card_content}>
        <div className={style.field}>{`Подразделение: ${incident.unit}`}</div>
        <div className={style.field}>{`Тип: ${incident.type}`}</div>
        <div className={clsx(style.text_field, staticStyle.text_block)}>{incident.description}</div>
        <div className={style.field}>{`Автор: ${incident.author.fullName}`}</div>
      </div>
      <div className={style.card_footer}>
        <div>{incident.date?.toLocaleDateString('ru-RU')}</div>
        <div>{`Ответственный: ${incident.responsible ?? 'нет'}`}</div>
      </div>
    </div>
  );
};
