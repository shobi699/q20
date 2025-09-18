
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Fix: Declare Deno to make it available in the scope for TypeScript as this is a Deno environment.
declare const Deno: any;

// Create a service role client
const createAdminClient = () => {
    return createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '', // FIX: Changed secret name to comply with Supabase policy.
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Create a client with the user's token to check their permissions
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await userSupabaseClient.auth.getUser();
    if (!user) throw new Error('Authentication failed');

    const { data: profile, error: profileError } = await userSupabaseClient
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
    
    if (profileError || !profile || !profile.is_admin) {
        throw new Error('Permission denied: user is not an admin.');
    }

    // 2. If user is an admin, proceed with service_role client
    const supabaseAdmin = createAdminClient();
    const { action, payload } = await req.json();
    let resultData;
    let targetTable;

    switch (action) {
        case 'create_node':
            {
                const { data, error } = await supabaseAdmin.from('nodes').insert(payload).select().single();
                if (error) throw error;
                resultData = data;
                targetTable = 'nodes';
                break;
            }
        case 'create_game_topic':
            {
                const { data, error } = await supabaseAdmin.from('game_topics').insert(payload).select().single();
                if (error) throw error;
                resultData = data;
                targetTable = 'game_topics';
                break;
            }
        // Add cases for 'update_node', 'delete_node', etc.
        default:
            throw new Error(`Invalid action: ${action}`);
    }

    // 3. Log the administrative action
    if (resultData && targetTable) {
        await supabaseAdmin.from('audit_logs').insert({
            user_id: user.id,
            action: `admin:${action}`,
            details: payload,
            target_table: targetTable,
            target_row_id: resultData.id.toString(),
        });
    }


    return new Response(JSON.stringify(resultData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});