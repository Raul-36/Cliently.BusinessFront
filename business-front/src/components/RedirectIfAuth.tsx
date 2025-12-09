import { Navigate, Outlet } from 'react-router-dom';

const RedirectIfAuth = () => {
  const token = localStorage.getItem('authToken');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RedirectIfAuth;
