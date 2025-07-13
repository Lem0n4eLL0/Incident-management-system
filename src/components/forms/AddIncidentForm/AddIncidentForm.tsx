import { IncidentStatus, IncidentType } from '@custom-types/types';
import { Select } from '@ui/Select';
import style from './AddIncidentForm.module.css';
import staticStyle from '@style/common.module.css';
import clsx from 'clsx';
import { selectUser } from '@services/userSlice';
import { useSelector } from '@services/store';
import { useEffect } from 'react';

export const AddIncidentForm = () => {
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  useEffect(() => {
    console.log(user);
  });
  return (
    <div className={style.content}>
      <h2 className={staticStyle.modal_title}>Создание инцедента</h2>
      <form id="add_incident" className={style.form}>
        <div className={style.options}>
          <label>
            <span>Номер</span>
            <input type="text" name="number"></input>
          </label>
          <label>
            <span>Тип</span>
            <Select<IncidentType>
              onChange={function (value: IncidentType | undefined): void {
                throw new Error('Function not implemented.');
              }}
              options={['авария', 'инцидент', 'пожар', 'травма', 'другое']}
            />{' '}
            {/* переделать с сервера */}
          </label>
          <label>
            <span>Дата</span>
            <input type="date" name="date"></input>
          </label>
          <label>
            <span>Описание</span>
            <textarea name="description" value=""></textarea>
          </label>
          <label>
            <span>Автор</span>
            <input type="text" value={user?.fullName}></input>
          </label>
          <label>
            <span>Подразделение</span>
            <input type="text" value={user?.unit}></input>
          </label>
          <label>
            <span>Статус</span>
            <Select<IncidentStatus>
              onChange={function (value: IncidentStatus | undefined): void {
                throw new Error('Function not implemented.');
              }}
              options={['в работе', 'завершено', 'на рассмотрении']}
              value="в работе"
            />{' '}
            {/* переделать с сервера возможно*/}
          </label>
          <label>
            <span>Принятые меры</span>
            <textarea name="measures_taken" value=""></textarea>
          </label>
          <label>
            <span>Ответственный</span>
            <input type="text" name="responsible"></input>
          </label>
        </div>
        <div>
          <span></span>
        </div>
        <div className={style.controls}>
          <button type="button" className={clsx(staticStyle.control_button)}>
            Отмена
          </button>
          <button type="submit" className={clsx(staticStyle.control_button)}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};
