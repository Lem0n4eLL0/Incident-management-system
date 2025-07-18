import { selectIncidents, selectStatusIncidents } from '@services/incidentSlice';
import { useDispatch, useSelector } from '@services/store';
import style from './HomePage.module.css';

import { selectUser } from '@services/userSlice';
import { IncidentValue } from '@components/IncidentValue';
import { IncidenMainCard } from '@components/IncidenMainCard';
import { Loader } from '@ui/Loader';
import staticStyle from '@style/common.module.css';

export const HomePage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { isGetIncidentsPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );

  if (isGetIncidentsPending) {
    return (
      <div className={style.content}>
        <section className={style.introduction}>
          <h1 className={style.greetings}>Здравствуйте, {user!.fullName}!</h1>
          <div className={style.statistic}>
            <Loader loaderClass={staticStyle.loader_bg}></Loader>
          </div>
        </section>
        <section className={style.incidents}>
          <Loader loaderClass={staticStyle.loader_bg}></Loader>
        </section>
      </div>
    );
  }

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
      <section className={style.incidents}>
        <div className={style.incidents_list}>
          {[...incidents]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5)
            .map((inc) => (
              <IncidenMainCard key={inc.id} incident={inc}></IncidenMainCard>
            ))}
        </div>
      </section>
    </div>
  );
};
