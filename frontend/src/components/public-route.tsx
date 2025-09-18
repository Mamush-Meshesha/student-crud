import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../stores';

 function PublicRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default PublicRoute;