import React from 'react';
// FIX: Switched to react-router-dom v6/v7 imports to resolve module export errors.
import { Routes, Route, NavLink } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminGraph from './AdminGraph';
import AdminLogs from './AdminLogs';
import AdminGames from './AdminGames'; // Import the new component

const AdminPage: React.FC = () => {
    // FIX: Removed v5 `useRouteMatch` hook. Nested routing is now handled by parent route configuration and relative paths.
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <aside className="w-full md:w-64 bg-surface p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-primary">پنل مدیریت</h2>
                <nav className="flex flex-col space-y-2">
                    {/* FIX: Updated `to` props to be absolute paths and added `end` for the dashboard link. */}
                    <AdminNavLink to="/admin" end>داشبورد</AdminNavLink>
                    <AdminNavLink to="/admin/games">موضوعات بازی</AdminNavLink>
                    <AdminNavLink to="/admin/graph">گراف دانش</AdminNavLink>
                    <AdminNavLink to="/admin/logs">لاگ‌ها</AdminNavLink>
                </nav>
            </aside>
            <div className="flex-1 bg-surface p-6 rounded-lg">
                {/* FIX: Replaced v5 <Switch> with v6 <Routes> and defined nested routes relative to the parent. */}
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="games" element={<AdminGames />} /> 
                    <Route path="graph" element={<AdminGraph />} />
                    <Route path="logs" element={<AdminLogs />} />
                </Routes>
            </div>
        </div>
    );
};

// FIX: Updated AdminNavLink to use v6/v7 APIs.
const AdminNavLink: React.FC<{ to: string; children: React.ReactNode; end?: boolean }> = ({ to, children, end = false }) => {
    const activeClass = "bg-primary text-on-primary";
    const inactiveClass = "hover:bg-primary/20";
    return (
        <NavLink
            to={to}
            // FIX: Added `end` prop for more precise active link matching.
            end={end}
            // FIX: Replaced v5 `activeClassName` with v6 `className` function.
            className={({ isActive }) => `block px-4 py-2 rounded-md transition-colors ${isActive ? activeClass : inactiveClass}`}
        >
            {children}
        </NavLink>
    )
}

export default AdminPage;