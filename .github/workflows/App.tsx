import React, { useEffect } from 'react';
// FIX: Switched to react-router-dom v6/v7 imports and syntax.
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import HomePage from '../../pages/HomePage';
import PlayPage from '../../pages/PlayPage';
import AdminPage from '../../pages/admin/AdminPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4">
            {/* FIX: Replaced v5 <Switch> with v6 <Routes> and updated Route syntax. */}
            <Routes>
              <Route path="/play" element={<ProtectedRoute><PlayPage /></ProtectedRoute>} />
              {/* FIX: Added wildcard '*' to support nested routes in AdminPage. */}
              <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const isAnonymous = user?.is_anonymous;

  const handleGuestLoginClick = async () => {
    await signOut();
  }

  return (
    <header className="bg-surface shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">بازی زنجیرهٔ خلاقیت</Link>
        <div className="flex items-center gap-4">
          {user && <Link to="/play" className="hover:text-secondary">بازی</Link>}
          {profile?.is_admin && <Link to="/admin" className="hover:text-secondary">پنل مدیریت</Link>}
          {user ? (
            isAnonymous ? (
              <button onClick={handleGuestLoginClick} className="hover:text-secondary">ورود / ثبت‌نام</button>
            ) : (
              <button onClick={signOut} className="bg-error text-on-primary px-3 py-1 rounded">خروج</button>
            )
          ) : (
            <Link to="/" className="hover:text-secondary">ورود</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-8">در حال بارگذاری...</div>;
  // FIX: Replaced v5 programmatic navigation (useHistory) with the v6 declarative <Navigate> component.
  if (!user) return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { profile, loading } = useAuth();
    if (loading) return <div className="text-center p-8">در حال بارگذاری...</div>;
    if (!profile?.is_admin) {
        return (
            <div className="text-center p-8">
                <h1 className="text-3xl text-error font-bold">403 - Forbidden</h1>
                <p className="mt-4">شما دسترسی لازم برای مشاهده این صفحه را ندارید.</p>
            </div>
        )
    };
    return children;
};


export default App;