import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userToFetch: User | null) => {
    if (!userToFetch) {
      setProfile(null);
      return;
    }
    try {
      // FIX: Handle cases where the query returns multiple rows by taking the first result.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userToFetch.id);
        
      if (error) throw error;
      
      setProfile(data?.[0] || null);

    } catch (error) {
      console.error('Error fetching profile:', error instanceof Error ? error.message : "Cannot coerce the result to a single JSON object");
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const setupSession = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      const userToProcess = currentSession?.user ?? null;
      setUser(userToProcess);
      await fetchProfile(userToProcess);
      setLoading(false);
    };
    setupSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const userToProcess = newSession?.user ?? null;
      setUser(userToProcess);
      await fetchProfile(userToProcess);
      setLoading(false); // Ensure loading is false after auth change
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);
  
  const refetchProfile = useCallback(async () => {
    await fetchProfile(user);
  }, [user, fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }

  const value = {
    session,
    user,
    profile,
    loading,
    refetchProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
