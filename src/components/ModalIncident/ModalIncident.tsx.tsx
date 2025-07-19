import { Incident } from '@custom-types/types';
import style from './ModalIncident.module.css';
import clsx from 'clsx';
import staticStyle from '@style/common.module.css';
import fromStyle from '@style/form.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeleteIncidentForm } from '@components/forms/DeleteIncidentForm';
import { useSelector } from '@services/store';
import { selectStatusIncidents } from '@services/incidentSlice';
import { Modal } from '@components/ui/Modal';
import { Alert } from '@components/ui/Alert';
import { UpdateIncidentForm } from '@components/forms/UpdateIncidentForm';
import { mapIncidentToDto } from '@custom-types/mapperDTO';

type ModalIncidentProps = {
  incident: Incident;
  onClose: () => void;
};

export function ModalIncident({ incident, onClose }: ModalIncidentProps) {
  const { isDeleteIncidentPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );

  const [isOpenDeleteWindow, setIsOpenDeletWindow] = useState(false);
  const [isUpdateModeEnabled, setIsUpdateModeEnabled] = useState(false);

  const closeDeleteWindowHandler = useCallback(() => {
    if (!isDeleteIncidentPending) {
      setIsOpenDeletWindow(false);
      onClose();
    }
  }, []);

  const offUpdateModeHandler = useCallback(() => {
    setIsUpdateModeEnabled(false);
  }, []);

  const getStatusClass = useMemo(() => {
    if (!incident) return '';
    return incident.status === 'в работе'
      ? staticStyle.status_underway
      : incident.status === 'на рассмотрении'
        ? staticStyle.status_consideration
        : incident.status === 'завершено'
          ? staticStyle.status_completed
          : '';
  }, [incident]);

  useEffect(() => {
    // закрытие окна если incident удален
    if (!incident) {
      onClose();
    }
  }, [incident, onClose]);

  if (!incident) return null;

  return (
    <>
      <div className={style.content}>
        {incident.status && !isUpdateModeEnabled && (
          <span
            className={clsx(staticStyle.status, style.status, incident.status && getStatusClass)}
          >
            {incident.status}
          </span>
        )}
        <h2 className={staticStyle.modal_title}>
          {isUpdateModeEnabled
            ? 'Изменение происшествия'
            : 'Происшествие №' + incident.incidentNumber}
        </h2>

        {isUpdateModeEnabled ? (
          <UpdateIncidentForm
            onClose={offUpdateModeHandler}
            incident={mapIncidentToDto(incident)}
          />
        ) : (
          <div className={style.info}>
            <div className={style.parameters}>
              <div>
                <span className={style.field}>Тип:</span>
                <span>{incident.type}</span>
              </div>
              <div>
                <span className={style.field}>Описание:</span>
                <div className={staticStyle.text_block}>
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
                <span>{incident.responsible}</span>
              </div>
              <div>
                <span className={style.field}>Принятые меры:</span>
                <div className={staticStyle.text_block}>
                  <span>{incident.measuresTaken}</span>
                </div>
              </div>
            </div>
            <div className={style.footer}>
              <div className={style.date_wrapper}>
                <span className={style.date}>
                  {incident.date ? incident.date.toLocaleDateString('ru-RU') : ''}
                </span>
              </div>

              <div className={style.controls}>
                <button
                  type="button"
                  className={clsx(fromStyle.confirm_button)}
                  onClick={() => setIsUpdateModeEnabled(true)}
                >
                  Изменить
                </button>
                <button
                  type="button"
                  className={clsx(fromStyle.attention_button)}
                  onClick={() => setIsOpenDeletWindow(true)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isOpenDeleteWindow && (
        <Alert className={style.alert}>
          <DeleteIncidentForm
            incident={incident}
            onClose={() => setIsOpenDeletWindow(false)}
          ></DeleteIncidentForm>
        </Alert>
      )}
    </>
  );
}
