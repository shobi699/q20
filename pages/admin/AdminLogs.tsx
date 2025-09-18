
import React, { useEffect, useState } from 'react';
import { AuditLog } from '../../types';
import { supabase } from '../../lib/supabase/client';

const AdminLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) {
                console.error(error);
                setError('Failed to fetch audit logs');
            } else {
                setLogs(data);
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">لاگ‌های حسابرسی (Audit Logs)</h1>
             {loading ? <p>Loading logs...</p> : error ? <p className="text-error">{error}</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b border-on-surface/20">
                            <tr>
                                <th className="p-2">زمان</th>
                                <th className="p-2">کاربر</th>
                                <th className="p-2">عملیات</th>
                                <th className="p-2">جدول هدف</th>
                                <th className="p-2">جزئیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="border-b border-background hover:bg-background font-mono text-sm">
                                    <td className="p-2">{new Date(log.created_at).toLocaleString('fa-IR')}</td>
                                    <td className="p-2">{log.user_id.substring(0, 8)}...</td>
                                    <td className="p-2">{log.action}</td>
                                    <td className="p-2">{log.target_table}</td>
                                    <td className="p-2">
                                        <pre className="whitespace-pre-wrap bg-background p-1 rounded text-xs">{JSON.stringify(log.details, null, 2)}</pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminLogs;