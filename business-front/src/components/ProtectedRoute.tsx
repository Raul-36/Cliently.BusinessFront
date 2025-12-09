import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { decodeJwt } from '@/lib/jwt';

const ProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    isAuthorized: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = decodeJwt(token);
            console.log("Decoded Token:", decodedToken);
            const ROLE_CLAIM_TYPE = "role"; // Corrected to "role"
            const userRoles = decodedToken?.[ROLE_CLAIM_TYPE] || [];      const isAuthorized = Array.isArray(userRoles)
        ? userRoles.includes('User')
        : userRoles === 'User';
      
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        isAuthorized: isAuthorized,
      });
    } else {
      setAuthStatus({
        isLoading: false,
        isAuthenticated: false,
        isAuthorized: false,
      });
    }
  }, []);

  if (authStatus.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!authStatus.isAuthorized) {
    return null; // Render empty page
  }

  return <Outlet />; // Renders the nested child route
};

export default ProtectedRoute;
