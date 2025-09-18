import React, { useEffect, useState, FormEvent } from 'react';
import { GameTopic } from '../../types';
import { supabase } from '../../lib/supabase/client';
import { adminCreateGameTopic } from '../../services/api';

const AdminGames: React.FC = () => {
    const [topics, setTopics] = useState<GameTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startWord, setStartWord] = useState('');
    const [questionType, setQuestionType] = useState('association');
    const [maxTurns, setMaxTurns] = useState(20);
    const [isActive, setIsActive] = useState(true);

    const fetchTopics = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('game_topics')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            setError('خطا در دریافت لیست بازی‌ها.');
        } else {
            setTopics(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !startWord.trim() || !questionType.trim() || maxTurns < 1) {
            alert('لطفا تمام فیلدهای ستاره‌دار را به درستی پر کنید.');
            return;
        }
        setIsSubmitting(true);
        try {
            await adminCreateGameTopic({
                title,
                description,
                start_word: startWord,
                question_type: questionType,
                max_turns: maxTurns,
                is_active: isActive,
            });
            // Reset form
            setTitle('');
            setDescription('');
            setStartWord('');
            setQuestionType('association');
            setMaxTurns(20);
            setIsActive(true);
            await fetchTopics(); // Refresh the list
        } catch (err: any) {
            alert('خطا در ساخت بازی جدید: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">مدیریت بازی‌ها</h1>
            <p className="mb-6 text-on-surface/70">در این بخش می‌توانید بازی‌های جدید با قوانین و موضوعات مختلف تعریف کنید.</p>

            <div className="bg-background p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">ایجاد بازی جدید</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium mb-1">موضوع بازی <span className="text-error">*</span></label>
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلا: زنجیره کلمات عمومی" className="w-full bg-surface p-2 border border-on-surface/20 rounded-md" required />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium mb-1">توضیحات</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="توضیح مختصری درباره این حالت بازی (اختیاری)" className="w-full bg-surface p-2 border border-on-surface/20 rounded-md" rows={2}></textarea>
                    </div>
                    <div>
                        <label htmlFor="start_word" className="block text-sm font-medium mb-1">کلمه شروع <span className="text-error">*</span></label>
                        <input id="start_word" type="text" value={startWord} onChange={(e) => setStartWord(e.target.value)} placeholder="مثلا: ابر" className="w-full bg-surface p-2 border border-on-surface/20 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="question_type" className="block text-sm font-medium mb-1">نوع سوال <span className="text-error">*</span></label>
                        <input id="question_type" type="text" value={questionType} onChange={(e) => setQuestionType(e.target.value)} placeholder="مثلا: association" className="w-full bg-surface p-2 border border-on-surface/20 rounded-md" required />
                    </div>
                    <div>
                         <label htmlFor="max_turns" className="block text-sm font-medium mb-1">تعداد مراحل <span className="text-error">*</span></label>
                        <input id="max_turns" type="number" value={maxTurns} onChange={(e) => setMaxTurns(parseInt(e.target.value, 10))} className="w-full bg-surface p-2 border border-on-surface/20 rounded-md" required min="1" />
                    </div>
                    <div className="flex items-center gap-2 self-end">
                        <input id="is_active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="is_active" className="text-sm font-medium">فعال باشد</label>
                    </div>
                    <div className="md:col-span-2">
                         <button type="submit" disabled={isSubmitting} className="w-full py-3 px-6 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-variant disabled:bg-gray-500 transition-colors">
                            {isSubmitting ? 'در حال ایجاد...' : 'ایجاد بازی'}
                        </button>
                    </div>
                </form>
            </div>

            <h2 className="text-xl font-semibold mb-4">لیست بازی‌های موجود</h2>
            {loading ? <p>در حال بارگذاری...</p> : error ? <p className="text-error">{error}</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b border-on-surface/20">
                            <tr>
                                <th className="p-2">موضوع</th>
                                <th className="p-2">کلمه شروع</th>
                                <th className="p-2">نوع سوال</th>
                                <th className="p-2">مراحل</th>
                                <th className="p-2">وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map(topic => (
                                <tr key={topic.id} className="border-b border-background hover:bg-background">
                                    <td className="p-2">
                                        <p className="font-semibold">{topic.title}</p>
                                        {topic.description && <p className="text-xs text-on-surface/60">{topic.description}</p>}
                                    </td>
                                    <td className="p-2">{topic.start_word}</td>
                                    <td className="p-2">{topic.question_type}</td>
                                    <td className="p-2">{topic.max_turns}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${topic.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {topic.is_active ? 'فعال' : 'غیرفعال'}
                                        </span>
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

export default AdminGames;