import { Column, Table, TableProps } from '../Table';
import { FilterController, useFilter } from '@hooks/useFilter';
import style from './FilteredTable.module.css';
import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { FilterFunc } from '@utils/Filter';

export type FilteredColumn<T extends { id: string }> = Column<T> &
  {
    [K in keyof T]: {
      key: K;
      filterController?: (
        value: T[K],
        onClose: () => void,
        onChange: (newValue: T[K] | undefined, filterFunc: FilterFunc<T, K>) => void
      ) => React.ReactNode;
    };
  }[keyof T];

type FilteredTable<T extends { id: string }> = Omit<TableProps<T>, 'data' | 'columns'> & {
  filter: ReturnType<typeof useFilter<T>>;
  columns: FilteredColumn<T>[];
};

export function FilteredTable<T extends { id: string }>(props: FilteredTable<T>) {
  const { filter, columns, ...rest } = props;

  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleOpen = (key: string) => {
    setOpenModals((prev) => ({ ...prev, [key]: true }));
  };

  const handleClose = (key: string) => {
    setOpenModals((prev) => ({ ...prev, [key]: false }));
  };

  const handleChange = <K extends keyof T>(
    column: K,
    value: T[K] | undefined,
    filterFunc: FilterFunc<T, K>
  ) => {
    setFilterValues((prev) => ({ ...prev, [column as string]: value }));
    filter.setFilter(column, (item) => filterFunc(item, value));
  };

  const headerColumn = columns.map((col) => {
    const colKey = col.key.toString();
    const isOpen = openModals[colKey] ?? false;
    const title = col.filterController ? (
      <>
        {
          <div className={style.header_column_wrapper}>
            <div className={style.title}>{col.title}</div>
            <button
              type="button"
              title={col.title?.toString()}
              className={style.filter_button}
              onClick={() => handleOpen(colKey)}
            ></button>
            {isOpen &&
              col.filterController(
                filterValues[colKey],
                () => handleClose(colKey),
                (newValue, filterFunc) => handleChange(col.key, newValue, filterFunc)
              )}
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
