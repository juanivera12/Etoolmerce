import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Database Helpers ---

export const saveTemplate = async ({ name, content, thumbnail }) => {
    // user_id is handled automatically by Supabase Auth RLS (auth.uid())
    const { data, error } = await supabase
        .from('templates')
        .insert([{ name, content, thumbnail }])
        .select();
    return { data, error };
};

export const getTemplates = async () => {
    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
};
