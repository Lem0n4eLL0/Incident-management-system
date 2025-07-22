import { ApiError, Incident } from '@custom-types/types';
import style from './ModalIncident.module.css';
import clsx from 'clsx';
import staticStyle from '@style/common.module.css';
import fromStyle from '@style/form.module.css';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '@services/store';
import {
  deleteIncident,
  selectErrorsIncidents,
  selectStatusIncidents,
} from '@services/incidentSlice';

import { UpdateIncidentForm } from '@components/forms/UpdateIncidentForm';
import { mapIncidentToDto } from '@custom-types/mapperDTO';
import { AlertWindowForm } from '@components/forms/AlertWindowForm';

type ModalIncidentProps = {
  incident: Incident;
  onClose: () => void;
};

export function ModalIncident({ incident, onClose }: ModalIncidentProps) {
  const dispatch = useDispatch();
  const { isDeleteIncidentPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );
  const { deleteIncidentError } = useSelector((state) =>
    selectErrorsIncidents.unwrapped(state.incidentsReducer)
  );

  const [isOpenDeleteWindow, setIsOpenDeletWindow] = useState(false);
  const [isUpdateModeEnabled, setIsUpdateModeEnabled] = useState(false);
  const [deleteUserServerError, setDeleteUserServerError] = useState<ApiError | undefined>(
    undefined
  );

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

  const isOpenDeletWindowHandler = useCallback(() => {
    if (!isDeleteIncidentPending) {
      setIsOpenDeletWindow(false);
      setDeleteUserServerError(undefined);
    }
  }, [isDeleteIncidentPending, setIsUpdateModeEnabled]);

  const deleteIncidentHandler = async (e: FormEvent) => {
    e.preventDefault();
    setDeleteUserServerError(undefined);
    const action = await dispatch(deleteIncident(incident.id));
    if (deleteIncident.rejected.match(action)) {
      setDeleteUserServerError({
        code: action.error.code,
        message: action.error.message || 'Произошла ошибка при удалении',
      });
    } else {
      isOpenDeletWindowHandler();
    }
  };

  if (!incident) {
    onClose();
    return null;
  }

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
        <AlertWindowForm
          onSubmit={deleteIncidentHandler}
          onClose={isOpenDeletWindowHandler}
          title="Вы уверены?"
          isPending={isDeleteIncidentPending}
          serverError={deleteUserServerError}
          alertClassName={style.alert}
        />
      )}
    </>
  );
}
