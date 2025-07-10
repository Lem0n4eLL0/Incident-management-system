import { Column, Table, TableProps } from '../Table';
import { FilterController, useFilter } from '@hooks/useFilter';
import style from './FilteredTable.module.css';
import { useLayoutEffect } from 'react';
import { FilterFunc } from '@utils/Filter';

export type FilterDefinition<T, K extends keyof T> = {
  filter: FilterFunc<T, K>;
  filterPopup: (setFilter: (fn: FilterFunc<T, K>) => void) => React.ReactNode;
};

export type FilteredColumn<T> = Column<T> &
  {
    [K in keyof T]: {
      key: K;
      filterController?: (controller: FilterController<T>) => React.ReactNode;
    };
  }[keyof T];

type FilteredTable<T> = TableProps<T> & {
  filter: ReturnType<typeof useFilter<T>>;
  columns: FilteredColumn<T>[];
};

export function FilteredTable<T>(props: FilteredTable<T>) {
  const { filter, data, columns, ...rest } = props;

  const headerColumn = columns.map((col: FilteredColumn<T>) => {
    const title = col.filterController ? (
      <>
        {
          <div className={style.header_column_wrapper}>
            <div className={style.title}>{col.title}</div>
            <button
              type="button"
              title={col.title?.toString()}
              className={style.filter_button}
            ></button>
            {col.filterController(filter)}
          </div>
        }
      </>
    ) : (
      <div className={style.title}>{col.title}</div>
    );

    return {
      ...col,
      title: title,
    };
  });

  return <Table columns={headerColumn} data={filter.filteredData} {...rest} />;
}
