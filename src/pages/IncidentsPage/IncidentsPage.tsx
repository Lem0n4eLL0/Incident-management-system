import { useDispatch, useSelector } from '@services/store';
import style from './IncidentsPage.module.css';
import formStyle from '@style/form.module.css';
import staticStyle from '@style/common.module.css';
import {
  selectStatusIncidents,
  selectIncidents,
  clearErrorsIncident,
} from '@services/incidentSlice';
import { Incident } from '@custom-types/types';
import { TABLE_INCIDENT_COLUMNS, TABLE_PLACEHOLDER } from '@constants/constants';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useFilter } from '@hooks/useFilter';
import { FilteredTable } from '@ui/FilteredTable';
import { Modal } from '@ui/Modal';
import clsx from 'clsx';
import { ModalIncident } from '@components/ModalIncident';
import { AddIncidentForm } from '@components/forms/AddIncidentForm';
import { Loader } from '@components/ui/Loader';
import { descriptionFilter } from '@constants/filters';

export const IncidentsPage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const { isGetIncidentsPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );
  const filter = useFilter<Incident>({ data: incidents });

  const { isAddIncidentPending, isUpdateIncidentPending, isDeleteIncidentPending } = useSelector(
    (state) => selectStatusIncidents.unwrapped(state.incidentsReducer)
  );
  const [isOpenModalIncident, setIsOpenModalIncident] = useState(false);
  const [isOpenAddInciden, setIsOpenAddInciden] = useState(false);
  const [searchValue, searchHandler] = useReducer(
    (_: string, e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
    ''
  );

  useEffect(() => {
    filter.setFilter('description', (item) => descriptionFilter(item, searchValue));
  }, [searchValue]);

  const closeIcidentModalHandler = (callback: () => void) => {
    if (!isUpdateIncidentPending && !isDeleteIncidentPending) {
      setIsOpenModalIncident(false);
      callback();
    }
  };
  const closeAddIncidenModalHandler = useCallback(() => {
    if (!isAddIncidentPending) {
      setIsOpenAddInciden(false);
      dispatch(clearErrorsIncident());
    }
  }, [isAddIncidentPending, setIsOpenAddInciden]);

  if (isGetIncidentsPending) {
    return (
      <div className={style.content}>
        <section className={style.incidents}>
          <Loader loaderClass={staticStyle.loader_bg} isAbsolute></Loader>
        </section>
      </div>
    );
  }

  return (
    <div className={style.content}>
      <section className={style.incidents}>
        <div className={style.controls}>
          <input
            type="search"
            className={style.search}
            name="search"
            placeholder="Поиск..."
            onChange={searchHandler}
          ></input>
          <button
            type="button"
            className={clsx(formStyle.confirm_button, style.add_incident_button)}
            onClick={() => setIsOpenAddInciden(true)}
          >
            Добавить
          </button>
        </div>
        <FilteredTable<Incident>
          columns={TABLE_INCIDENT_COLUMNS}
          filter={filter}
          placeholder={TABLE_PLACEHOLDER}
          caption={'История происшествий'}
          modal={{
            openHandler: () => setIsOpenModalIncident(true),
            isOpen: isOpenModalIncident,
            renderModal: (id, onClose) => (
              <Modal
                contentClass={staticStyle.modal}
                onClose={() => closeIcidentModalHandler(onClose)}
              >
                <ModalIncident
                  incident={incidents.find((el) => el.id === id)!}
                  onClose={() => closeIcidentModalHandler(onClose)}
                />
              </Modal>
            ),
          }}
        ></FilteredTable>
      </section>
      {isOpenAddInciden && (
        <Modal
          contentClass={staticStyle.modal}
          onClose={closeAddIncidenModalHandler}
          isCloseButton={false}
        >
          <AddIncidentForm onClose={closeAddIncidenModalHandler}></AddIncidentForm>
        </Modal>
      )}
    </div>
  );
};
