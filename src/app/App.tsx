import { useDispatch, useSelector } from '@services/store';
import { useEffect } from 'react';
import { getUser, selectAll } from '@services/userSlice';
import { MainApp } from './MainApp';

export const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthChecked } = useSelector((state) =>
    selectAll.unwrapped(state.userReducer)
  );

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return <MainApp />;
};
