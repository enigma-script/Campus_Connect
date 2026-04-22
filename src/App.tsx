import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import AuthPage from './pages/AuthPage';
import { Toaster } from './components/ui/toaster';
import { Loader as Loader2 } from 'lucide-react';

function AppRoutes() {
  const { currentPage, navigate } = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (currentPage === 'auth') {
        navigate(role === 'admin' ? 'admin' : 'events');
      }
    }
  }, [user, role, loading, currentPage, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading CampusConnect...</p>
        </div>
      </div>
    );
  }

  const isAdminRoute = currentPage === 'admin' || currentPage === 'admin-event-form';
  const isStudentOnlyRoute = currentPage === 'my-registrations';

  if (isAdminRoute && role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-slate-500">
          <div className="text-6xl">🔒</div>
          <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
          <p className="text-sm">You need admin privileges to view this page.</p>
          <button
            onClick={() => navigate('home')}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Go to Home
          </button>
        </div>
        <Toaster />
      </>
    );
  }

  if (isStudentOnlyRoute && !user) {
    navigate('auth');
    return null;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'events': return <EventsPage />;
      case 'event-detail': return <EventDetailPage />;
      case 'admin': return <AdminDashboardPage />;
      case 'admin-event-form': return <AdminDashboardPage />;
      case 'my-registrations': return <MyRegistrationsPage />;
      case 'auth': return <AuthPage />;
      default: return <HomePage />;
    }
  };

  const hideNavbar = currentPage === 'auth';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </AuthProvider>
  );
}
