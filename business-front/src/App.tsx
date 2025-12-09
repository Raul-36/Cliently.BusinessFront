import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuth from './components/RedirectIfAuth';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public routes that should redirect if user is authenticated */}
      <Route element={<RedirectIfAuth />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        {/* Add other protected routes here */}
      </Route>
    </Routes>
  );
}

export default App;
