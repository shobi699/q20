import { supabase } from '../lib/supabase/client';

const supabaseUrl = 'https://rjaydfbfhobmewxabdqi.supabase.co';

const getFunctionUrl = (name: string) => {
    return `${supabaseUrl}/functions/v1/${name}`;
}

const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('User not authenticated');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
    };
}

// New function to validate answer via Edge Function
export const validateAnswer = async (payload: { sourceWord: string; answerWord: string }) => {
    const response = await fetch(getFunctionUrl('validate-answer'), {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate answer');
    }
    return response.json();
}

// New function to log answer and get count via RPC
export const logAnswerAndGetCount = async (payload: { sourceWord: string; answerWord: string }) => {
    const { data, error } = await supabase.rpc('log_answer_and_get_count', {
        p_source_word: payload.sourceWord,
        p_answer_word: payload.answerWord,
    });

    if (error) {
        throw new Error(error.message || 'Failed to log answer');
    }
    return { count: data };
}


// Admin function calls
export const adminCreateGraphNode = async (payload: { title: string; slug: string; tags: string[] }) => {
    const response = await fetch(getFunctionUrl('admin-graph'), {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ action: 'create_node', payload }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create node');
    }
    return response.json();
}

export const adminCreateGameTopic = async (payload: { 
    title: string; 
    description: string;
    start_word: string; 
    question_type: string; 
    max_turns: number;
    is_active: boolean;
}) => {
    const response = await fetch(getFunctionUrl('admin-graph'), {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ action: 'create_game_topic', payload }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create game topic');
    }
    return response.json();
}