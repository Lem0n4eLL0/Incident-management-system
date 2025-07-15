import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@layout/MainLayout';
import { HomePage } from '@pages/HomePage';
import { ErrorPage } from '@pages/ErrorPage';
import { IncidentsPage } from '@pages/IncidentsPage';
import { getIncidents } from '@services/incidentSlice';
import { useDispatch, useSelector } from '@services/store';
import { selectAll } from '@services/userSlice';
import style from './App.module.css';
import { AuthPage } from '@pages/AuthPage';
import { useEffect } from 'react';

export const MainApp = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => selectAll.unwrapped(state.userReducer));

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getIncidents());
    }
  });
  return (
    <div className={style.app}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          {isAuthenticated && (
            <>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />}></Route>
                <Route path="incidents" element={<IncidentsPage />}></Route>
                <Route path="profile" element={<ErrorPage />}></Route>
                <Route path="administration" element={<ErrorPage />}></Route>
                <Route path="analytics" element={<ErrorPage />}></Route>
              </Route>
              <Route path="*" element={<ErrorPage />}></Route>
            </>
          )}
          <Route path="*" element={<Navigate to="/auth" />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
