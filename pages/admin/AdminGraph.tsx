
import React, { useEffect, useState } from 'react';
import { Node } from '../../types';
import { supabase } from '../../lib/supabase/client';
import { adminCreateGraphNode } from '../../services/api';

const AdminGraph: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNodes = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('nodes')
                .select('id, title, slug, tags')
                .limit(100);

            if (error) {
                console.error(error);
                setError('Failed to fetch nodes');
            } else {
                setNodes(data);
            }
            setLoading(false);
        };
        fetchNodes();
    }, []);

    const handleCreateNode = async () => {
        // This is a placeholder for a proper form/modal
        const title = prompt("Enter new node title:");
        if (title) {
            try {
                await adminCreateGraphNode({ title, slug: title.replace(/\s+/g, '-'), tags: [] });
                alert('Node created successfully! Refresh to see.');
            } catch (err: any) {
                alert('Error: ' + err.message);
            }
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">مدیریت گراف</h1>
                <button
                    onClick={handleCreateNode}
                    className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary-variant">
                    + افزودن نود جدید
                </button>
            </div>
            <input
                type="text"
                placeholder="جستجوی نود..."
                className="w-full p-2 mb-4 bg-background border border-on-surface/20 rounded-md"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? <p>Loading nodes...</p> : error ? <p className="text-error">{error}</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b border-on-surface/20">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">عنوان</th>
                                <th className="p-2">Slug</th>
                                <th className="p-2">تگ‌ها</th>
                                <th className="p-2">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.filter(n => n.title.includes(searchTerm)).map(node => (
                                <tr key={node.id} className="border-b border-background hover:bg-background">
                                    <td className="p-2">{node.id}</td>
                                    <td className="p-2">{node.title}</td>
                                    <td className="p-2 font-mono">{node.slug}</td>
                                    <td className="p-2">{node.tags?.join(', ')}</td>
                                    <td className="p-2">
                                        <button className="text-secondary hover:underline">ویرایش</button>
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

export default AdminGraph;