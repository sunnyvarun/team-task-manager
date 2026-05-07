import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { TasksPage } from './pages/tasks/TasksPage';
import { PageLoader } from './components/common/Spinner';

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader message="Loading your workspace" />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#21242c',
              color: '#f8f9fb',
              borderRadius: '0.625rem',
              fontSize: '0.8125rem',
              fontWeight: '500',
              padding: '10px 16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            },
            success: {
              style: {
                background: '#2f9e44',
              },
            },
            error: {
              style: {
                background: '#e03131',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/" element={<AuthGuard><MainLayout /></AuthGuard>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectsPage />} />
            <Route path="tasks" element={<TasksPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;