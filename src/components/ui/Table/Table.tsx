import { useState } from 'react';
import style from './Table.module.css';
import clsx from 'clsx';
import { Modal } from '../Modal';

export type Column<T> = {
  key: keyof T | string;
  title: React.ReactNode;
  render?: (item: T) => React.ReactNode;
};

export type TableProps<T> = React.TableHTMLAttributes<HTMLTableElement> & {
  columns: Array<Column<T>>;
  data: Array<T>;
  placeholder?: string;
  caption?: string;
};

export function Table<T>({
  data,
  columns,
  caption,
  className,
  placeholder,
  ...rest
}: TableProps<T>) {
  const [isOpenInciden, setIsOpenInciden] = useState(false);

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
                <tr key={index} className={style.row}>
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
      {isOpenInciden && (
        <Modal
          contentClass={style.modal}
          onClose={() => {
            setIsOpenInciden(false);
          }}
        >
          <div>modal</div>
        </Modal>
      )}
    </>
  );
}
