import { useDispatch, useSelector } from '@services/store';
import { Profiler, useEffect, useLayoutEffect } from 'react';
import {
  checkAuth,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectStatusAuth,
} from '@services/authSlice';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@layout/MainLayout';
import { HomePage } from '@pages/HomePage';
import { ErrorPage } from '@pages/ErrorPage';
import { IncidentsPage } from '@pages/IncidentsPage';
import { getIncidents, selectStatusIncidents } from '@services/incidentSlice';
import style from './App.module.css';
import { AuthPage } from '@pages/AuthPage';
import { getUser, selectStatusUser, selectUser } from '@services/userSlice';
import staticStyle from '@style/common.module.css';
import { Loader } from '@ui/Loader';
import { ProfilePage } from '@pages/ProfilePage';
import clsx from 'clsx';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ERROR_FORBIDDEN } from '@constants/constants';
import { AdministrationPage } from '@pages/AdministrationPage';
import { AnalyticsPage } from '@pages/AnalyticsPage';
import { CreateReportPage } from '@pages/CreateReportPage/CreateReportPage';

export const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const isAuthenticated = useSelector((state) =>
    selectIsAuthenticated.unwrapped(state.authReducer)
  );
  const isAuthCheck = useSelector((state) => selectIsAuthChecked.unwrapped(state.authReducer));

  const { isAuthCheckPending } = useSelector((state) =>
    selectStatusAuth.unwrapped(state.authReducer)
  );

  const isUserLoaded = user && user.id !== '';
  const isAppLoading = !isAuthCheck || isAuthCheckPending || (isAuthenticated && !isUserLoaded);

  useEffect(() => {
    if (!isAuthCheck) {
      dispatch(checkAuth());
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isUserLoaded) {
      dispatch(getUser());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isUserLoaded) {
      dispatch(getIncidents());
    }
  }, [isAuthenticated, isUserLoaded]);

  if (isAppLoading) {
    return <Loader loaderClass={clsx(staticStyle.loader_v2, style.loader)} isAbsolute></Loader>;
  }

  return (
    <div className={style.app}>
      <Routes>
        <Route path="/auth" element={<AuthPage />}></Route>
        {isAuthenticated && (
          <>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />}></Route>
              <Route path="incidents" element={<IncidentsPage />}></Route>
              <Route path="profile" element={<ProfilePage />}></Route>
              <Route element={<ProtectedRoute acсessRoles={['руководитель', 'администратор']} />}>
                <Route path="analytics" element={<AnalyticsPage />}></Route>
                <Route path="/report" element={<CreateReportPage />}></Route>
                <Route element={<ProtectedRoute acсessRoles={['администратор']} />}>
                  <Route path="administration" element={<AdministrationPage />}></Route>
                </Route>
              </Route>
            </Route>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/forbidden" element={<ErrorPage error={ERROR_FORBIDDEN} />} />
            <Route path="*" element={<ErrorPage />}></Route>
          </>
        )}
        {!isAuthenticated && <Route path="*" element={<Navigate to="/auth" replace />}></Route>}
      </Routes>
    </div>
  );
};
