import { selectIncidents, selectStatusIncidents } from '@services/incidentSlice';
import { useDispatch, useSelector } from '@services/store';
import style from './HomePage.module.css';

import { selectUser } from '@services/userSlice';
import { IncidentValue } from '@components/IncidentValue';
import { IncidenMainCard } from '@components/IncidenMainCard';
import { Loader } from '@ui/Loader';
import staticStyle from '@style/common.module.css';
import clsx from 'clsx';
import { filterByDateRange } from '@constants/constants';
import { useMemo, useRef } from 'react';

export const HomePage = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => selectIncidents.unwrapped(state.incidentsReducer));
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { isGetIncidentsPending } = useSelector((state) =>
    selectStatusIncidents.unwrapped(state.incidentsReducer)
  );

  const nowDate = useRef<Date>(new Date());

  const thisYearCountIncidents = useMemo(() => {
    const thisYearStart = new Date(nowDate.current.getFullYear(), 0, 1);
    return incidents.filter((el) => filterByDateRange(el, { from: thisYearStart })).length;
  }, [incidents]);

  const lastYearCountIncidents = useMemo(() => {
    const thisYearStart = new Date(nowDate.current.getFullYear(), 0, 1);
    const lastYearStart = new Date(nowDate.current.getFullYear() - 1, 0, 1);
    return incidents.filter((el) =>
      filterByDateRange(el, { from: lastYearStart, to: thisYearStart })
    ).length;
  }, [incidents]);

  const thisMonthsCountIncidents = useMemo(() => {
    const thisMonthsStart = new Date(nowDate.current.getFullYear(), nowDate.current.getMonth(), 1);
    return incidents.filter((el) => filterByDateRange(el, { from: thisMonthsStart })).length;
  }, [incidents]);

  const lastMonthsCountIncidents = useMemo(() => {
    const thisMonthsStart = new Date(nowDate.current.getFullYear(), nowDate.current.getMonth(), 1);
    const lastMonthsStart = new Date(
      nowDate.current.getFullYear(),
      nowDate.current.getMonth() - 1,
      1
    );
    return incidents.filter((el) =>
      filterByDateRange(el, { from: lastMonthsStart, to: thisMonthsStart })
    ).length;
  }, [incidents]);

  if (isGetIncidentsPending) {
    return (
      <div className={style.content}>
        <section className={style.introduction}>
          <h1 className={style.greetings}>Здравствуйте, {user!.fullName}!</h1>
          <div className={style.statistic}>
            <Loader loaderClass={staticStyle.loader_bg} isAbsolute></Loader>
          </div>
        </section>
        <section className={style.incidents}>
          <Loader loaderClass={staticStyle.loader_bg} isAbsolute></Loader>
        </section>
      </div>
    );
  }

  return (
    <div className={style.content}>
      <section className={style.introduction}>
        <h1 className={style.greetings}>Здравствуйте, {user!.fullName}!</h1>{' '}
        <div className={style.statistic}>
          <IncidentValue value={incidents.length} description={'всего инцедентов'} />{' '}
          <div className={style.separator}></div>
          <IncidentValue
            value={thisYearCountIncidents}
            description={'с нач. года'}
            difference={thisYearCountIncidents - lastYearCountIncidents}
          />
          <div className={clsx(style.separator, staticStyle.hidden_760)}></div>
          <IncidentValue
            value={thisMonthsCountIncidents}
            description={'с нач. мес.'}
            difference={thisMonthsCountIncidents - lastMonthsCountIncidents}
            clasName={staticStyle.hidden_760}
          />
        </div>
      </section>
      <section className={style.incidents}>
        <h2 className={style.incidents_title}>Последние происшествия</h2>
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
