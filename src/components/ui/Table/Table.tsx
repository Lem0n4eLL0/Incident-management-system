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
  placeholder?: string;
  caption?: string;
  renderModal?: (item: string, onClose: () => void) => React.ReactNode;
};

export function Table<T extends { id: string }>({
  data,
  columns,
  caption,
  className,
  placeholder,
  renderModal,
  ...rest
}: TableProps<T>) {
  const [isOpenInciden, setIsOpenInciden] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const modalOpenHandler = useCallback(
    (e: SyntheticEvent, item: T, index: number) => {
      setSelectedIncidentId(item.id);
      setIsOpenInciden(true);
      setSelectedRowIndex(index);
    },
    [setSelectedIncidentId, setIsOpenInciden, setSelectedRowIndex]
  );

  const modalCloseHandler = () => {
    setIsOpenInciden(false);
    setSelectedIncidentId(null);
    setSelectedRowIndex(null);
  };

  return (
    <>
      <table className={clsx(className, style.table)} {...rest}>
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
              <td colSpan={columns.length}>Нет данных</td>
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
      {isOpenInciden && selectedIncidentId && (
        <Modal contentClass={staticStyle.modal} onClose={modalCloseHandler}>
          {renderModal?.(selectedIncidentId, modalCloseHandler)}
        </Modal>
      )}
    </>
  );
}
