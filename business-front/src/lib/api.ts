import { useNavigate } from 'react-router-dom';

type NavigateFunction = ReturnType<typeof useNavigate>;

interface AuthFetchOptions extends RequestInit {
}

export async function authFetch(
  url: string,
  options: AuthFetchOptions = {},
  navigate: NavigateFunction
): Promise<Response> {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("API request returned 401 Unauthorized. Redirecting to login.");
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload(); 
    throw new Error('Unauthorized');
  }

  return response;
}
