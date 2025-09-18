import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase/client';
import { Game } from '../types';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user, profile, refetchProfile } = useAuth();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [history, setHistory] = useState<Game[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState('');

    useEffect(() => {
        if (profile?.username) {
            setUsername(profile.username);
        }
    }, [profile]);
    
    useEffect(() => {
        const fetchGameHistory = async () => {
            if (!user) return;
            setHistoryLoading(true);
            setHistoryError('');
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error('Error fetching game history:', error.message);
                setHistoryError('خطا در دریافت تاریخچه بازی‌ها.');
            } else if (data) {
                setHistory(data);
            }
            setHistoryLoading(false);
        };
        if(user) {
            fetchGameHistory();
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!user) {
            setError('شما وارد نشده‌اید.');
            setLoading(false);
            return;
        }

        if (username.trim().length < 3) {
            setError('نام کاربری باید حداقل ۳ کاراکتر باشد.');
            setLoading(false);
            return;
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: username.trim() })
            .eq('id', user.id);
        
        if (updateError) {
            console.error('Error updating profile:', updateError.message);
            if (updateError.code === '23505') { // Unique constraint violation
                 setError('این نام کاربری قبلا گرفته شده است.');
            } else {
                 setError('خطایی در به‌روزرسانی پروفایل رخ داد.');
            }
        } else {
            setMessage('پروفایل با موفقیت به‌روزرسانی شد!');
            await refetchProfile(); // Refresh profile in global context
        }

        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Profile Card */}
            <div className="bg-surface rounded-xl shadow-lg p-8 lg:col-span-2">
                <h1 className="text-3xl font-bold text-center mb-6 text-primary">پروفایل کاربری</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-on-surface/80">
                            ایمیل
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full mt-1 p-3 bg-background/50 border border-on-surface/20 rounded-md text-on-surface/70 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-on-surface/80">
                            نام کاربری
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            className="w-full mt-1 p-3 bg-background border border-on-surface/20 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            aria-describedby="username-help"
                        />
                         <p id="username-help" className="mt-2 text-xs text-on-surface/60">نام شما در جدول امتیازات نمایش داده می‌شود.</p>
                    </div>

                    {message && <div className="p-3 text-center bg-green-500/20 text-green-400 rounded-md">{message}</div>}
                    {error && <div className="p-3 text-center bg-error/20 text-error rounded-md">{error}</div>}
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading || (profile && username === profile.username)}
                            className="w-full py-3 px-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-variant disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Game History Card */}
            <div className="bg-surface rounded-xl shadow-lg p-8 lg:col-span-3">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">تاریخچه بازی‌ها</h2>
                {historyLoading ? (
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-on-surface/80">در حال بارگذاری تاریخچه...</p>
                    </div>
                ) : historyError ? (
                    <p className="text-center text-error">{historyError}</p>
                ) : history.length === 0 ? (
                    <p className="text-center text-on-surface/70">هنوز هیچ بازی انجام نداده‌اید.</p>
                ) : (
                    <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {history.map((game) => (
                            <li key={game.id} className="bg-background p-4 rounded-lg flex justify-between items-center transition-colors hover:bg-background/80">
                                <div>
                                    <p className="text-sm text-on-surface/60">
                                        {new Date(game.created_at).toLocaleString('fa-IR')}
                                    </p>
                                    <p className="font-bold text-lg">
                                        امتیاز: <span className="text-secondary">{game.current_score}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">
                                        مراحل: {game.current_step > 1 ? game.current_step - 1 : 0}
                                    </p>
                                     <span className={`px-2 py-1 text-xs rounded-full ${!game.is_active ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {!game.is_active ? 'پایان یافته' : 'فعال'}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;