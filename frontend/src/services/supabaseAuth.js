import { supabase } from "./supabase";

export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function signInWithGoogle() {
  // OAuth redirect flow (configure callback URL in Supabase)
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) throw error;
}

