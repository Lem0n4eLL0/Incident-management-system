import { useDispatch, useSelector } from '@services/store';
import { useEffect } from 'react';
import { selectFlagsAuth } from '@services/authSlice';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@layout/MainLayout';
import { HomePage } from '@pages/HomePage';
import { ErrorPage } from '@pages/ErrorPage';
import { IncidentsPage } from '@pages/IncidentsPage';
import { getIncidents } from '@services/incidentSlice';
import style from './App.module.css';
import { AuthPage } from '@pages/AuthPage';
import { getUser, selectUser } from '@services/userSlice';

export const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const { isAuthenticated } = useSelector((state) => selectFlagsAuth.unwrapped(state.authReducer));

  const isUserLoaded = user && user.id !== '';

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isUserLoaded) {
      dispatch(getIncidents());
    }
  }, [isAuthenticated, user]);

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
          {!isAuthenticated && <Route path="*" element={<Navigate to="/auth" />}></Route>}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
