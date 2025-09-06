import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/AppShell';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { StudentHome } from './pages/StudentHome';

const ReportsExports = lazy(() => import('./pages/ReportsExports'));
const NotificationTemplates = lazy(() => import('./pages/NotificationTemplates'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const PWAStudentApp = lazy(() => import('./pages/PWAStudentApp'));

function Router() {
  const { role, user } = useAuth();
  // Simple router (replace with react-router in prod)
  const [route, setRoute] = React.useState(window.location.pathname);
  React.useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const nav = path => { window.history.pushState({}, '', path); setRoute(path); };

  if (!user) {
    if (route === '/signup') return <Signup onSignup={() => nav('/student')} />;
    if (route === '/forgot') return <ForgotPassword />;
    return <Login onLogin={() => nav('/student')} />;
  }

  // Role-based routing
  if (role === 'student') {
    if (route === '/student') return <AppShell><StudentHome /></AppShell>;
    if (route === '/pwa') return <Suspense fallback={<div>Loading...</div>}><PWAStudentApp /></Suspense>;
    // Add more student routes here
    return <AppShell><StudentHome /></AppShell>;
  }
  if (role === 'guardian') {
    // Guardian shell/pages here
    return <AppShell>Guardian Dashboard (TODO)</AppShell>;
  }
  if (role === 'mentor') {
    // Mentor shell/pages here
    return <AppShell>Mentor Dashboard (TODO)</AppShell>;
  }
  if (role === 'admin') {
    // Admin shell/pages here
    return <AppShell>Admin Dashboard (TODO)</AppShell>;
  }
  return <div>Unknown role</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
