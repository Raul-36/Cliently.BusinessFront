import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './layout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import CreateBusinessPage from './pages/CreateBusinessPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuth from './components/RedirectIfAuth';
import { BusinessProvider } from './contexts/BusinessContext';
import './App.css';

function App() {
  const navigate = useNavigate(); 

  return (
    <Routes>
      <Route element={<RedirectIfAuth />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Route>

      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={
          <BusinessProvider navigate={navigate}> 
            <Layout>
              <HomePage />
            </Layout>
          </BusinessProvider>
        } />
        <Route path="/create-business" element={
          <BusinessProvider navigate={navigate}> 
            <Layout>
              <CreateBusinessPage />
            </Layout>
          </BusinessProvider>
        } />
        <Route path="/settings" element={
          <BusinessProvider navigate={navigate}> 
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
