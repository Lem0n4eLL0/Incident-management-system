import { Role } from '@custom-types/types';
import { useSelector } from '@services/store';
import { selectUser } from '@services/userSlice';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRoute = {
  acсessRoles: Array<Role>;
};
export const ProtectedRoute = ({ acсessRoles }: ProtectedRoute) => {
  const user = useSelector((state) => selectUser.unwrapped(state.userReducer));
  return user ? (
    acсessRoles.includes(user.role) ? (
      <Outlet />
    ) : (
      <Navigate to="/forbidden" replace />
    )
  ) : (
    <Navigate to="/forbidden" replace />
  );
};
