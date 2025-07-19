import { ApiError, Incident } from '@custom-types/types';
import style from './DeleteIncidentForm.module.css';
import staticStyle from '@style/common.module.css';
import fromStyle from '@style/form.module.css';
import { useDispatch, useSelector } from '@services/store';
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  clearDeleteIncidentError,
  deleteIncident,
  selectErrorsIncidents,
  selectStatusIncidents,
} from '@services/incidentSlice';
import clsx from 'clsx';

type DeleteIncidentFormProps = {
  incident: Incident;
  onClose: () => void;
};

export const DeleteIncidentForm = ({ incident, onClose }: DeleteIncidentFormProps) => {
  const dispatch = useDispatch();
  const { deleteIncidentError } = useSelector((state) =>
    selectErrorsIncidents.unwrapped(state.incidentsReducer)
  );
  const { isDeleteIncidentPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );
  const [serverError, setServerError] = useState<ApiError | undefined>(undefined);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    dispatch(deleteIncident(incident.id));
  };
  const wasPending = useRef(false);

  useEffect(() => {
    return () => {
      dispatch(clearDeleteIncidentError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isDeleteIncidentPending) {
      wasPending.current = true;
    }

    if (wasPending.current && !isDeleteIncidentPending && !deleteIncidentError) {
      wasPending.current = false;
    }
  }, [isDeleteIncidentPending, deleteIncidentError]);

  useEffect(() => {
    setServerError(deleteIncidentError);
  }, [deleteIncidentError]);

  return (
    <div className={style.content}>
      <h1 className={style.title}>Вы уверены?</h1>
      <form className={style.form} onSubmit={submitHandler}>
        <div className={staticStyle.error}>{serverError?.message}</div>
        <div className={style.controls}>
          <button
            type="submit"
            className={clsx(
              fromStyle.attention_button,
              isDeleteIncidentPending && fromStyle.disabled
            )}
            disabled={isDeleteIncidentPending}
          >
            {isDeleteIncidentPending ? 'Удаление...' : 'Удалить'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={clsx(
              fromStyle.confirm_button,
              isDeleteIncidentPending && fromStyle.disabled
            )}
            disabled={isDeleteIncidentPending}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
