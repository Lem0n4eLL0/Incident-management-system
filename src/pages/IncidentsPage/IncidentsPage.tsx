import { useDispatch, useSelector } from '@services/store';
import style from './IncidentsPage.module.css';
import staticStyle from '@style/common.module.css';
import { selectErrorsStatus, selectIncidents } from '@services/incidentSlice';
import { Incident } from '@custom-types/types';
import { Table } from '@ui/Table';
import { TABLE_COLUMNS, TABLE_PLACEHOLDER } from '@constants/constants';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useFilter } from '@hooks/useFilter';
import { FilteredTable } from '@ui/FilteredTable';
import { Modal } from '@ui/Modal';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { ModalIncident } from '@components/ModalIncident';
import { AddIncidentForm } from '@components/forms/AddIncidentForm';

export const IncidentsPage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const filter = useFilter<Incident>({ data: incidents });
  const { isAddIncidentPending } = useSelector((state) =>
    selectErrorsStatus.unwrapped(state.incidentsReducer)
  );
  const [isOpenAddInciden, setIsOpenAddInciden] = useState(false);

  const closeModalHandler = useCallback(() => {
    if (!isAddIncidentPending) {
      setIsOpenAddInciden(false);
    }
  }, [isAddIncidentPending, setIsOpenAddInciden]);

  return (
    <div className={style.content}>
      <section className={style.incidents}>
        <div className={style.controls}>
          <input type="search" className={style.search} name="поиск" placeholder="Поиск..."></input>
          <button
            type="button"
            className={clsx(staticStyle.control_button, style.add_incident_button)}
            onClick={() => setIsOpenAddInciden(true)}
          >
            Добавить
          </button>
        </div>
        <FilteredTable<Incident>
          columns={TABLE_COLUMNS}
          data={incidents}
          filter={filter}
          placeholder={TABLE_PLACEHOLDER}
          caption={'История происшествий'}
          renderModal={(item) => <ModalIncident incident={item}></ModalIncident>}
        ></FilteredTable>
      </section>
      {isOpenAddInciden && (
        <Modal contentClass={staticStyle.modal} onClose={closeModalHandler}>
          <AddIncidentForm onClose={() => setIsOpenAddInciden(false)}></AddIncidentForm>
        </Modal>
      )}
    </div>
  );
};
