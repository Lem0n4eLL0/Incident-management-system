import { useDispatch, useSelector } from '@services/store';
import style from './IncidentsPage.module.css';
import formStyle from '@style/form.module.css';
import staticStyle from '@style/common.module.css';
import { selectStatusIncidents, selectIncidents } from '@services/incidentSlice';
import { Incident } from '@custom-types/types';
import { Table } from '@ui/Table';
import { descriptionFilter, TABLE_COLUMNS, TABLE_PLACEHOLDER } from '@constants/constants';
import { useCallback, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { useFilter } from '@hooks/useFilter';
import { FilteredTable } from '@ui/FilteredTable';
import { Modal } from '@ui/Modal';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { ModalIncident } from '@components/ModalIncident';
import { AddIncidentForm } from '@components/forms/AddIncidentForm';
import { Loader } from '@components/ui/Loader';
import { FilterFunc } from '@utils/Filter';

export const IncidentsPage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const filter = useFilter<Incident>({ data: incidents });

  const { isAddIncidentPending, isUpdateIncidentPending, isDeleteIncidentPending } = useSelector(
    (state) => selectStatusIncidents.unwrapped(state.incidentsReducer)
  );
  const [isOpenAddInciden, setIsOpenAddInciden] = useState(false);
  const [searchValue, searchHandler] = useReducer(
    (_: string, e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
    ''
  );

  useEffect(() => {
    if (filter) {
      filter.setFilter('description', (item) => descriptionFilter(item, searchValue));
    }
  }, [searchValue]);

  const closeModalHandler = useCallback(() => {
    if (!isAddIncidentPending) {
      setIsOpenAddInciden(false);
    }
  }, [isAddIncidentPending, setIsOpenAddInciden]);

  return (
    <div className={style.content}>
      <section className={style.incidents}>
        <div className={style.controls}>
          <input
            type="search"
            className={style.search}
            name="поиск"
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
          columns={TABLE_COLUMNS}
          data={incidents}
          filter={filter}
          placeholder={TABLE_PLACEHOLDER}
          caption={'История происшествий'}
          renderModal={(id, onClose) => (
            <ModalIncident incident={incidents.find((el) => el.id === id)!} onClose={onClose} />
          )}
        ></FilteredTable>
      </section>
      {isOpenAddInciden && (
        <Modal contentClass={staticStyle.modal} onClose={closeModalHandler} isCloseButton={false}>
          <AddIncidentForm onClose={() => setIsOpenAddInciden(false)}></AddIncidentForm>
        </Modal>
      )}
    </div>
  );
};
