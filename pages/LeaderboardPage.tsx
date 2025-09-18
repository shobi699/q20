import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../hooks/useAuth';

// Define a type for leaderboard entry
interface LeaderboardEntry {
    username: string;
    score: number;
}

const IconTrophy = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${color}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a2 2 0 00-2 2v2a2 2 0 004 0V4a2 2 0 00-2-2z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" />
        <path d="M10 6a4 4 0 100 8 4 4 0 000-8z" />
        <path d="M12.293 8.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L13 10.414V14a1 1 0 11-2 0v-3.586l-1.293 1.293a1 1 0 01-1.414-1.414l2-2z" />
    </svg>
);


const LeaderboardPage: React.FC = () => {
    const { profile } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);

            // Fetch top 100 completed game scores along with user profiles
            const { data, error } = await supabase
                .from('games')
                .select('current_score, profiles ( username )')
                .eq('is_active', false)
                .neq('current_step', 1)
                .order('current_score', { ascending: false })
                .limit(100);

            if (error) {
                console.error("Error fetching leaderboard:", error.message);
                setError("خطا در دریافت جدول امتیازات.");
            } else {
                // Process data to get unique users with their single highest score
                const userScores = new Map<string, LeaderboardEntry>();

                for (const game of data) {
                    // Supabase returns profiles as an object if a relation exists, or an array. We handle both.
                    const userProfile = Array.isArray(game.profiles) ? game.profiles[0] : game.profiles;

                    if (userProfile && userProfile.username) {
                        const username = userProfile.username;
                        // Since the query is ordered by score descending, the first time we see a user,
                        // it's with their highest score in this dataset.
                        if (!userScores.has(username)) {
                            userScores.set(username, {
                                username: username,
                                score: game.current_score
                            });
                        }
                    }
                }

                // Get top 10 from the processed unique user list
                const leaderboardData = Array.from(userScores.values()).slice(0, 10);
                setLeaderboard(leaderboardData);
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-on-surface/80">در حال بارگذاری جدول امتیازات...</p>
          </div>
        );
    }

    if (error) return <div className="text-center p-8 text-error">خطا: {error}</div>;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-center mb-2 text-primary">جدول امتیازات</h1>
            <p className="text-center text-on-surface/70 mb-8">برترین بازیکنان بازی زنجیره خلاقیت</p>
            
            {leaderboard.length > 0 ? (
                <div className="bg-surface rounded-xl shadow-lg p-4 sm:p-6">
                    <ol className="space-y-3">
                        {leaderboard.map((entry, index) => {
                            const rank = index + 1;
                            const isCurrentUser = profile?.username === entry.username;
                            
                            let rankIndicator;
                            if (rank === 1) rankIndicator = <IconTrophy color="text-yellow-400" />;
                            else if (rank === 2) rankIndicator = <IconTrophy color="text-gray-400" />;
                            else if (rank === 3) rankIndicator = <IconTrophy color="text-amber-600" />;
                            else rankIndicator = <span className="font-bold text-xl w-8 text-center text-on-surface/50">{rank}</span>;

                            return (
                                <li 
                                    key={entry.username} 
                                    className={`flex items-center p-3 sm:p-4 rounded-lg transition-all duration-300 ${isCurrentUser ? 'bg-primary/20 scale-105 shadow-md' : 'bg-background hover:bg-background/50'}`}
                                >
                                    <div className="flex-shrink-0 w-12 flex justify-center items-center">{rankIndicator}</div>
                                    <span className="flex-grow font-semibold text-lg text-on-surface truncate pr-4">{entry.username}</span>
                                    <span className="font-bold text-2xl text-secondary">{entry.score.toLocaleString('fa-IR')}</span>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            ) : (
                <div className="text-center bg-surface rounded-lg p-12">
                    <p className="text-on-surface/70">هنوز هیچ امتیازی ثبت نشده است. اولین نفر باشید!</p>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;