import { TestComponent } from '@components/TestCompopnent';
import style from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@layout/MainLayout';
import { HomePage } from '@pages/HomePage';
import { ErrorPage } from '@pages/ErrorPage';
import { IncidentsPage } from '@pages/IncidentsPage';
import { useDispatch } from '@services/store';
import { getIncidents } from '@services/incidentSlice';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIncidents());
  }, [dispatch]);

  return (
    <div className={style.app}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="incidents" element={<IncidentsPage />}></Route>
            <Route path="profile" element={<ErrorPage />}></Route>
            <Route path="administration" element={<ErrorPage />}></Route>
            <Route path="analytics" element={<ErrorPage />}></Route>
          </Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export { App };
