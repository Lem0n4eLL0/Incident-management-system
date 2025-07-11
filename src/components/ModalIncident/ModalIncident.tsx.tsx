import { Incident } from '@custom-types/types';
import style from './ModalIncident.module.css';
import clsx from 'clsx';
import staticStyle from '@style/common.module.css';

type ModalIncidentProps = {
  incident: Incident;
};

export function ModalIncident({ incident }: ModalIncidentProps) {
  const getStatusClass = () => {
    return incident.status === 'в работе'
      ? staticStyle.status_underway
      : incident.status === 'на рассмотрении'
        ? staticStyle.status_consideration
        : incident.status === 'завершено'
          ? staticStyle.status_completed
          : '';
  };
  return (
    <div className={style.content}>
      <span className={clsx(style.status, incident.status && getStatusClass())}>
        {incident.status}
      </span>
      <h2 className={style.title}>Происшествие №{incident.incidentNumber}</h2>
      <div className={style.info}>
        <div className={style.parameters}>
          <div>
            <span className={style.field}>Тип:</span>
            <span>{incident.type}</span>
          </div>
          <div>
            <span className={style.field}>Описание:</span>
            <div className={style.text_block}>
              <span>{incident.description}</span>
            </div>
          </div>
          <div>
            <span className={style.field}>Автор:</span>
            <span>{incident.author.fullName}</span>
          </div>
          <div>
            <span className={style.field}>Подразделение:</span>
            <span>{incident.unit}</span>
          </div>
          <div>
            <span className={style.field}>Ответственный:</span>
            <span>{incident.responsible ?? '-'}</span>
          </div>
          <div>
            <span className={style.field}>Принятые меры:</span>
            <div className={style.text_block}>
              <span>{incident.measuresTaken ?? '-'}</span>
            </div>
          </div>
        </div>
        <div className={style.footer}>
          <div className={style.date_wrapper}>
            <span className={style.date}>
              {new Date(incident.date).toLocaleDateString('ru-RU')}
            </span>
          </div>

          <div className={style.controls}>
            <button
              type="button"
              className={clsx(staticStyle.conterol_button, style.controls_button_update)}
            >
              Изменить
            </button>
            <button
              type="button"
              className={clsx(staticStyle.conterol_button, style.controls_button_delete)}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
