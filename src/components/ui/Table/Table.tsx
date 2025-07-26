import { SyntheticEvent, useCallback, useState } from 'react';
import style from './Table.module.css';
import clsx from 'clsx';
import { Modal } from '../Modal';
import { Incident } from '@custom-types/types';
import staticStyle from '@style/common.module.css';

export type Column<T extends { id: string }> = {
  key: keyof T | string;
  title: React.ReactNode;
  render?: (item: T) => React.ReactNode;
};

export type TableProps<T extends { id: string }> = React.TableHTMLAttributes<HTMLTableElement> & {
  columns: Array<Column<T>>;
  data: Array<T>;
  emptyDataPlaceholder?: React.ReactNode;
  placeholder?: string;
  caption?: string;
  modal?: {
    openHandler: () => void;
    isOpen: boolean;
    renderModal: (item: string, onClose: () => void) => React.ReactNode;
  };
};

export function Table<T extends { id: string }>({
  data,
  columns,
  caption,
  emptyDataPlaceholder,
  className,
  placeholder,
  modal,
  ...rest
}: TableProps<T>) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const modalOpenHandler = useCallback(
    (e: SyntheticEvent, item: T, index: number) => {
      setSelectedIncidentId(item.id);
      modal?.openHandler();
      setSelectedRowIndex(index);
    },
    [setSelectedIncidentId, setSelectedRowIndex]
  );

  const modalCloseHandler = () => {
    setSelectedIncidentId(null);
    setSelectedRowIndex(null);
  };

  return (
    <div className={style.table_wrapper}>
      <table
        className={clsx(className, style.table, data.length === 0 && style.empty_table)}
        {...rest}
      >
        <caption className={style.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((el) => (
              <th key={el.key.toString()}>{el.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                {emptyDataPlaceholder ? (
                  <div className={style.empty_data}>{emptyDataPlaceholder}</div>
                ) : (
                  <div className={clsx(style.empty_data, style.empty_data_column)}>Нет данных</div>
                )}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={clsx(style.row, selectedRowIndex === index && style.selected_line)}
                  onClick={(e) => modalOpenHandler(e, item, index)}
                >
                  {columns.map((col) => (
                    <td
                      className={clsx(style.column, !item[col.key as keyof T] && style.empty_cell)}
                      key={col.key.toString()}
                    >
                      {col.render
                        ? col.render(item)
                        : ((item[col.key as keyof T] as React.ReactNode) ?? placeholder)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {modal?.isOpen &&
        selectedIncidentId &&
        modal?.renderModal(selectedIncidentId, modalCloseHandler)}
    </div>
  );
}
