
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authLoading, setAuthLoading] = useState(true);
    const [userRole, setUserRole] = useState('guest');
    const [session, setSession] = useState(null);

    // Default guest profile
    const [userProfile, setUserProfile] = useState({
        name: 'Guest',
        email: '',
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    });

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                setAuthLoading(false);
            }
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                setUserRole('guest');
                setUserProfile({
                    name: 'Guest',
                    email: '',
                    phone: '',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
                });
                setAuthLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (user) => {
        try {
            // Check if user exists in our 'users' table
            let { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // User doesn't exist in public.users yet, create them
                const newProfile = {
                    id: user.id,
                    email: user.email,
                    display_name: user.user_metadata?.full_name || user.email.split('@')[0],
                    avatar_url: user.user_metadata?.avatar_url,
                    role: 'user', // Default role
                };

                const { error: insertError } = await supabase
                    .from('users')
                    .insert([newProfile]);

                if (!insertError) {
                    profile = newProfile;
                }
            }

            if (profile) {
                setUserRole(profile.role || 'user');
                setUserProfile({
                    name: profile.display_name || user.user_metadata?.full_name || 'User',
                    email: profile.email || user.email,
                    phone: profile.phone || '',
                    avatar: profile.avatar_url || user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
                });
            }

        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setAuthLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard` // Ensures redirect back to app
            }
        });
        if (error) console.error("Google login error:", error);
        return { error };
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
        setUserRole('guest');
    };

    const updateUserProfile = async (newData) => {
        // Optimistic update
        setUserProfile(prev => ({ ...prev, ...newData }));

        if (session?.user) {
            const { error } = await supabase
                .from('users')
                .update({
                    display_name: newData.name,
                    phone: newData.phone,
                    avatar_url: newData.avatar
                })
                .eq('id', session.user.id);

            if (error) console.error("Error updating profile:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            userRole,
            setUserRole,
            userProfile,
            setUserProfile: updateUserProfile,
            authLoading,
            loginWithGoogle,
            logout,
            session
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
