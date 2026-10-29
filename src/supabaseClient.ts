/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { User, FitnessDetails } from './types';

// Read configuration from Vite environment variables (prefixed with VITE_)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Check if valid client configured
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl !== 'YOUR_SUPABASE_URL'
);

// Lazy direct client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// Local Fallback Storage Engine
// ==========================================
class LocalStorageDatabase {
  private static USERS_KEY = 'fitfusion_users';
  private static FITNESS_KEY = 'fitfusion_fitness_details';
  private static CURRENT_USER_KEY = 'fitfusion_current_user';

  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static getFitnessRecords(): FitnessDetails[] {
    try {
      const data = localStorage.getItem(this.FITNESS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveFitnessRecords(records: FitnessDetails[]): void {
    localStorage.setItem(this.FITNESS_KEY, JSON.stringify(records));
  }

  static getSessionUser(): User | null {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setSessionUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }
}

// Seed mock data initially if empty, so the user has some records right off the bat
if (LocalStorageDatabase.getUsers().length === 0) {
  const defaultUser: User = {
    id: 'usr_demo',
    name: 'Mugesh Kumar',
    email: 'demo@fitfusion.com',
    password: 'password123',
    created_at: new Date().toISOString()
  };
  const defaultDetails: FitnessDetails = {
    user_id: 'usr_demo',
    age: 22,
    gender: 'Male',
    height: 175,
    weight: 72,
    goal: 'Maintain Fitness',
    bmi: 23.5,
    updated_at: new Date().toISOString()
  };
  LocalStorageDatabase.saveUsers([defaultUser]);
  LocalStorageDatabase.saveFitnessRecords([defaultDetails]);
}

// ==========================================
// Unified Authentication Service
// ==========================================
export const authService = {
  async signUp(name: string, email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Sign up with Supabase Authentication
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (error) throw error;
        if (!data.user) throw new Error('Sign up returned empty user data.');

        // Insert user details into the custom "users" table to support the requested schema
        const mappedUser: User = {
          id: data.user.id,
          name,
          email
        };

        const { error: insertError } = await supabase
          .from('users')
          .upsert([mappedUser]);

        if (insertError) {
          console.warn('Could not insert profile into custom users table, proceeding:', insertError.message);
        }

        LocalStorageDatabase.setSessionUser(mappedUser);
        return { user: mappedUser, error: null };
      } catch (err: any) {
        return { user: null, error: err.message || 'An error occurred during sign up' };
      }
    } else {
      // Local Database Fallback
      await new Promise(resolve => setTimeout(resolve, 600)); // simulate network latency
      const users = LocalStorageDatabase.getUsers();
      
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { user: null, error: 'User with this email already exists.' };
      }

      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password, // safe in local mock only
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      LocalStorageDatabase.saveUsers(users);
      LocalStorageDatabase.setSessionUser(newUser);

      return { user: { id: newUser.id, name: newUser.name, email: newUser.email }, error: null };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login returned empty user.');

        // Fetch custom user profile info
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const loggedUser: User = {
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || 'User',
          email: data.user.email || email
        };

        LocalStorageDatabase.setSessionUser(loggedUser);
        return { user: loggedUser, error: null };
      } catch (err: any) {
        return { user: null, error: err.message || 'Invalid email or password' };
      }
    } else {
      // Local Database Fallback
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = LocalStorageDatabase.getUsers();
      const matched = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matched) {
        return { user: null, error: 'Invalid email or password.' };
      }

      const sanitizedUser: User = { id: matched.id, name: matched.name, email: matched.email };
      LocalStorageDatabase.setSessionUser(sanitizedUser);
      return { user: sanitizedUser, error: null };
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    LocalStorageDatabase.setSessionUser(null);
  },

  getCurrentUser(): User | null {
    return LocalStorageDatabase.getSessionUser();
  }
};

// ==========================================
// Unified Fitness & Recommendations Service
// ==========================================
export const fitnessService = {
  async getDetails(userId: string): Promise<{ details: FitnessDetails | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('fitness_details')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        return { details: data, error: null };
      } catch (err: any) {
        return { details: null, error: err.message || 'Failed to fetch fitness details' };
      }
    } else {
      // Local Database Fallback
      await new Promise(resolve => setTimeout(resolve, 300));
      const records = LocalStorageDatabase.getFitnessRecords();
      const matched = records.find(r => r.user_id === userId);
      return { details: matched || null, error: null };
    }
  },

  async saveDetails(details: FitnessDetails): Promise<{ details: FitnessDetails | null; error: string | null }> {
    // Round floats for clean displays
    const processedDetails: FitnessDetails = {
      ...details,
      height: parseFloat(Number(details.height).toFixed(1)),
      weight: parseFloat(Number(details.weight).toFixed(1)),
      bmi: parseFloat(Number(details.bmi).toFixed(1)),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        // Attempt query using upsert corresponding to schema
        // Look up if user has an existing record
        const { data: existingRecord } = await supabase
          .from('fitness_details')
          .select('id')
          .eq('user_id', details.user_id)
          .maybeSingle();

        const payload = existingRecord?.id
          ? { ...processedDetails, id: existingRecord.id }
          : processedDetails;

        const { data, error } = await supabase
          .from('fitness_details')
          .upsert([payload])
          .select()
          .single();

        if (error) throw error;
        return { details: data, error: null };
      } catch (err: any) {
        return { details: null, error: err.message || 'Failed to save fitness details' };
      }
    } else {
      // Local Database Fallback
      await new Promise(resolve => setTimeout(resolve, 400));
      const records = LocalStorageDatabase.getFitnessRecords();
      const index = records.findIndex(r => r.user_id === details.user_id);

      if (index >= 0) {
        records[index] = { ...records[index], ...processedDetails };
      } else {
        records.push(processedDetails);
      }

      LocalStorageDatabase.saveFitnessRecords(records);
      return { details: processedDetails, error: null };
    }
  }
};
