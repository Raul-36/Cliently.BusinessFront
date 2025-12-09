import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import CreateBusinessPage from './pages/CreateBusinessPage';
import SettingsPage from './pages/SettingsPage'; // Import SettingsPage
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuth from './components/RedirectIfAuth';
import { BusinessProvider } from './contexts/BusinessContext';
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
          <BusinessProvider>
            <Layout>
              <HomePage />
            </Layout>
          </BusinessProvider>
        } />
        <Route path="/create-business" element={
          <BusinessProvider>
            <Layout>
              <CreateBusinessPage />
            </Layout>
          </BusinessProvider>
        } />
        <Route path="/settings" element={
          <BusinessProvider>
            <Layout>
              <SettingsPage />
            </Layout>
          </BusinessProvider>
        } />
      </Route>
    </Routes>
  );
}

export default App;
