import { useDispatch, useSelector } from '@services/store';
import style from './IncidentsPage.module.css';
import { selectIncidents } from '@services/incidentSlice';
import { Incident } from '@custom-types/types';
import { Table } from '@ui/Table';
import { TABLE_COLUMNS, TABLE_PLACEHOLDER } from '@constants/constants';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useFilter } from '@hooks/useFilter';
import { FilteredTable } from '@components/ui/FilteredTable';
import { Modal } from '@ui/Modal';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';

export const IncidentsPage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const filter = useFilter<Incident>({ data: incidents });

  const [isOpenAddInciden, setIsOpenAddInciden] = useState(false);

  return (
    <div className={style.content}>
      <section className={style.incidents}>
        <div className={style.controls}>
          <input type="search" className={style.search} name="поиск" placeholder="Поиск..."></input>
          <button
            type="button"
            className={style.add_incident_button}
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
        ></FilteredTable>
      </section>
      {isOpenAddInciden && (
        <Modal
          contentClass={style.modal}
          onClose={() => {
            setIsOpenAddInciden(false);
          }}
        >
          <div>modal</div>
        </Modal>
      )}
    </div>
  );
};
