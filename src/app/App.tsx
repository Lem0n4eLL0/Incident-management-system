import { useDispatch, useSelector } from '@services/store';
import { Profiler, useEffect, useLayoutEffect } from 'react';
import { selectIsAuthenticated } from '@services/authSlice';
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

export const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  const isAuthenticated = useSelector((state) =>
    selectIsAuthenticated.unwrapped(state.authReducer)
  );
  const { isGetUserPending } = useSelector((state) =>
    selectStatusUser.unwrapped(state.userReducer)
  );
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

  if (isGetUserPending) {
    return <Loader loaderClass={clsx(staticStyle.loader_v2, style.loader)} isAbsolute></Loader>;
  }

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
                <Route path="profile" element={<ProfilePage />}></Route>
                <Route element={<ProtectedRoute acсessRoles={['руководитель', 'администратор']} />}>
                  <Route path="analytics" element={<ErrorPage />}></Route>
                  <Route element={<ProtectedRoute acсessRoles={['администратор']} />}>
                    <Route path="administration" element={<ErrorPage />}></Route>
                  </Route>
                </Route>
              </Route>
              <Route path="/forbidden" element={<ErrorPage error={ERROR_FORBIDDEN} />} />
              <Route path="*" element={<ErrorPage />}></Route>
            </>
          )}
          {!isAuthenticated && <Route path="*" element={<Navigate to="/auth" />}></Route>}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
