import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Este comando cria a conexão. Se a URL ou a chave estiverem erradas, ele falha.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);