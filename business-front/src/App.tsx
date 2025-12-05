import { useState, useEffect } from 'react';
import Layout from './layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './App.css'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <Layout>
        <HomePage />
      </Layout>
    );
  }

  return <LoginPage />;
}

export default App;
