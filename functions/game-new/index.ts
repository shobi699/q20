
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Fix: Declare Deno to make it available in the scope for TypeScript as this is a Deno environment.
declare const Deno: any;

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { difficulty = 'medium' } = await req.json();
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return new Response(JSON.stringify({ error: 'Invalid difficulty level.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        });
    }

    // Find the starting node 'paper'
    const { data: startNode, error: nodeError } = await supabaseClient
      .from('nodes')
      .select('id')
      .eq('slug', 'paper')
      .single();

    if (nodeError || !startNode) {
      throw new Error('Starting node "paper" not found in database.');
    }

    // Create a new game for the user
    const { data: newGame, error: gameError } = await supabaseClient
      .from('games')
      .insert({
        user_id: user.id,
        current_target_node_id: startNode.id,
        difficulty: difficulty,
      })
      .select()
      .single();
    
    if (gameError) throw gameError;

    return new Response(JSON.stringify(newGame), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})