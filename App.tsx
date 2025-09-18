import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    return (
        <div className="relative">
            {children}
            {(loading || !user) && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    {loading ? (
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    ) : (
                        <div className="text-center p-8 bg-surface rounded-lg shadow-xl animate-fade-in max-w-md">
                            <h2 className="text-3xl font-bold text-primary mb-4">دسترسی نیازمند ورود است</h2>
                            <p className="text-on-surface/80 mb-6">
                                برای مشاهده این صفحه، لطفا ابتدا وارد حساب کاربری خود شوید.
                            </p>
                            <Link to="/" className="py-2 px-6 bg-secondary text-on-secondary font-bold rounded-md hover:opacity-90 transition-opacity">
                                رفتن به صفحه ورود
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/play" element={<ProtectedRoute><PlayPage /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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
  
  return (
    <header className="bg-surface shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">بازی زنجیرهٔ خلاقیت</Link>
        <div className="flex items-center gap-4">
          <Link to="/play" className="hover:text-secondary">بازی</Link>
          <Link to="/leaderboard" className="hover:text-secondary">جدول امتیازات</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-secondary">{profile?.username || 'پروفایل'}</Link>
              <button onClick={signOut} className="hover:text-error">خروج</button>
            </>
          ) : (
             <Link to="/" className="bg-primary text-on-primary px-3 py-1 rounded-md text-sm">ورود / ثبت‌نام</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default App;