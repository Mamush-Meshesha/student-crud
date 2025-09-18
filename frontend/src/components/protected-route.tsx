import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../stores';
import Header from './Header';

export function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}