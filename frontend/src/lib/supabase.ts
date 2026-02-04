import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Data functions
export const getPendingSubmissions = async () => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'pending');
  return { data, error };
};

export const approveSubmission = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({ 
      status: 'approved',
      reviewed_by: userId,
      reviewed_at: new Date().toISOString() 
    })
    .eq('id', id);
  return { data, error };
};

export const rejectSubmission = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({ 
      status: 'rejected',
      reviewed_by: userId,
      reviewed_at: new Date().toISOString() 
    })
    .eq('id', id);
  return { data, error };
};
