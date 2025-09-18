

import React from 'react';
import { useAuth } from '../../../hooks/useAuth';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">داشبورد</h1>
            <p>خوش آمدید, {user?.email}!</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-on-surface/80">کاربران فعال روزانه (DAU)</h3>
                    <p className="text-3xl font-bold text-primary">1,234</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-on-surface/80">میانگین کمیابی پاسخ‌ها</h3>
                    <p className="text-3xl font-bold text-secondary">2.71</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-on-surface/80">پاسخ‌های در انتظار بررسی</h3>
                    <p className="text-3xl font-bold text-error">42</p>
                </div>
            </div>
            {/* Here you would add charts or more detailed stats */}
        </div>
    );
};

export default AdminDashboard;