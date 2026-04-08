import { supabase } from './supabaseClient'
import type { User } from './store'

export interface AuthResult {
  success: boolean;
  message: string;
  user?: any;
}

// ✅ REGISTER (Supabase Auth + Profile Table)
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  aadhaar?: string;
  dob?: string;
  gender?: string;
}): Promise<AuthResult> => {

  // ✅ STEP 1: SIGNUP
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message || "Signup failed" };
  }

  // ✅ STEP 2: INSERT PROFILE (ONLY IF USER EXISTS)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: authData.user.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      aadhaar: data.aadhaar,
      dob: data.dob,
      gender: data.gender
    }]);

  if (profileError) {
    return { success: false, message: profileError.message };
  }

  return { success: true, message: 'Account created successfully', user: authData.user };
};


// ✅ LOGIN
export const login = async (
  email: string,
  password: string
): Promise<AuthResult> => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (!error && data.user) {
  localStorage.setItem("user", JSON.stringify({
    id: data.user.id,
    email: data.user.email,
    role: "citizen" // 🔥 IMPORTANT
  }));
}

  return { success: true, message: 'Login successful', user: data.user }
}


// ✅ LOGOUT
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("user"); // 🔥 ADD THIS
}


// ✅ GET CURRENT USER (REAL SESSION)
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};


// ✅ UPDATE PROFILE
export const updateCurrentUser = async (id: string, updates: any) => {

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return null

  return data
}