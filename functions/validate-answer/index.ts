
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenAI } from 'https://esm.sh/@google/genai@0.15.0';
import { corsHeaders } from '../_shared/cors.ts';

declare const Deno: any;

// Helper to parse potentially malformed JSON from the AI
const parseAiResponse = (text: string): { valid: boolean; reason: string } => {
  try {
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    return {
      valid: typeof parsed.valid === 'boolean' ? parsed.valid : false,
      reason: typeof parsed.reason === 'string' ? parsed.reason : "پاسخ نامعتبر از هوش مصنوعی",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", text, error);
    return { valid: false, reason: "خطا در تحلیل پاسخ هوش مصنوعی." };
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sourceWord, answerWord } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 1. Check cache first
    const { data: cached, error: cacheError } = await supabaseClient
      .from('answer_cache')
      .select('is_valid, reason')
      .eq('source_word', sourceWord)
      .eq('answer_word', answerWord)
      .single();

    if (cached) {
      return new Response(JSON.stringify({
        valid: cached.is_valid,
        reason: cached.reason,
        source: 'cache'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // 2. If not in cache, call Gemini AI
    const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! });
    const prompt = `You are the judge for a creative chain game about destruction. The current target is "${sourceWord}" and the user's answer is "${answerWord}".

    The goal is to determine if the answer is a valid way to destroy, neutralize, overcome, or render the target harmless. This can include burning, breaking, dissolving, melting, neutralizing, etc.

    Safety Rules (Strictly Enforced):
    - DO NOT allow answers that describe harm to humans or animals.
    - DO NOT allow answers related to self-harm, hate speech, illegal substances, or dangerous instructions.
    - Keep answers general (e.g., "water" is good, "a high-pressure water jet at 5000 PSI" is bad).

    Valid examples:
    - Target: "paper", Answer: "fire" (Valid, it burns)
    - Target: "ice", Answer: "heat" (Valid, it melts)
    - Target: "rumor", Answer: "truth" (Valid, it neutralizes it)
    - Target: "computer virus", Answer: "antivirus" (Valid, it removes it)

    Your response MUST be a JSON object with this exact format: {"valid": boolean, "reason": "A very short explanation in Persian why it is valid or invalid."}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const result = parseAiResponse(response.text);

    // 3. Save the new result to the cache (do this in the background, don't wait for it)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '' // FIX: Changed secret name to comply with Supabase policy.
    );
    supabaseAdmin.from('answer_cache').insert({
      source_word: sourceWord,
      answer_word: answerWord,
      is_valid: result.valid,
      reason: result.reason,
      validated_by: 'AI'
    }).then(({ error }) => {
      if (error) console.error('Failed to cache answer:', error.message);
    });

    // 4. Return the result to the user
    return new Response(JSON.stringify({
      ...result,
      source: 'AI'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});