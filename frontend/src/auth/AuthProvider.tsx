import React, { createContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface DonorProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  blood_group: string;
  date_of_birth: string;
  email_verified: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: DonorProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('donor_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        if (mounted) setProfile(data as DonorProfile);
      } catch (err) {
        console.error('Failed to load donor profile:', err);
        if (mounted) setProfile(null);
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          loadProfile(initialSession.user.id).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          if (!profile || profile.user_id !== newSession.user.id) {
             setLoading(true);
             await loadProfile(newSession.user.id);
             if (mounted) setLoading(false);
          }
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
