
export interface Profile {
  id: string;
  updated_at: string;
  username: string | null;
  is_admin: boolean;
}

export interface Game {
    id: string;
    user_id: string;
    current_score: number;
    current_step: number;
    current_target_node_id: number;
    is_active: boolean;
    created_at: string;
    difficulty: string;
}

export interface Node {
    id: number;
    title: string;
    slug: string;
    tags: string[];
}

export interface AuditLog {
    id: number;
    created_at: string;
    user_id: string;
    action: string;
    details: Record<string, any>;
    target_table: string;
    target_row_id: string;
}

export interface GameTopic {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  start_word: string;
  question_type: string;
  max_turns: number;
  is_active: boolean;
}