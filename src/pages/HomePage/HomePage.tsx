import { TestComponent } from '@components/TestCompopnent';
import { selectIncidents } from '@services/incidentSlice';
import { useDispatch, useSelector } from '@services/store';
import style from './HomePage.module.css';
import { selectUser } from '@services/userSlice';
import { DEFAULT_USER } from '@constants/test';
import { IncidentValue } from '@components/IncidentValue';

export const HomePage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));

  return (
    <div className={style.content}>
      <section className={style.introduction}>
        <h1 className={style.greetings}>Здравствуйте, {user!.fullName}!</h1>{' '}
        {/* Было бы круто сделать модальным окном сбоку, с одним приветствием за сессию*/}
        <div className={style.statistic}>
          <IncidentValue value={incidents.length} description={'всего инцедентов'} />{' '}
          {/* Используя фильтры считать */}
          <div className={style.separator_wrapper}>
            {' '}
            {/* может потом переделать под элемент Separator */}
            <div className={style.separator}></div>
          </div>
          <IncidentValue value={32} description={'с нач. года'} difference={-3} />
          <div className={style.separator_wrapper}>
            {' '}
            {/* может потом переделать под элемент Separator */}
            <div className={style.separator}></div>
          </div>
          <IncidentValue value={3} description={'с нач. мес.'} difference={2} />
        </div>
      </section>
      <section className={style.incidents}></section>
    </div>
  );
};
