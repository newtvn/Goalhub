
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    subscribeToAuthChanges,
    signInWithGoogle as firebaseSignIn,
    signOutUser as firebaseSignOut,
    getCachedUser
} from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const cachedAuth = getCachedUser();
    const [authLoading, setAuthLoading] = useState(true);
    const [userRole, setUserRole] = useState(cachedAuth?.role || 'guest');

    const [userProfile, setUserProfile] = useState(cachedAuth?.user ? {
        name: cachedAuth.user.displayName || 'User',
        email: cachedAuth.user.email || '',
        phone: cachedAuth.user.phone || '0712345678',
        avatar: cachedAuth.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    } : {
        // Default guest/demo profile
        name: 'Alex K.',
        email: 'alex@example.com',
        phone: '0712345678',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    });

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(({ user, loading }) => {
            setAuthLoading(loading);

            if (user) {
                setUserRole(user.role || 'user');
                setUserProfile({
                    name: user.displayName || 'User',
                    email: user.email || '',
                    phone: user.phone || userProfile.phone, // Keep existing phone if not in user object
                    avatar: user.photoURL || userProfile.avatar
                });
            } else {
                setUserRole('guest');
                // We can choose to reset profile or keep the "Guest" placeholder
            }
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        return await firebaseSignIn();
    };

    const logout = async () => {
        await firebaseSignOut();
        setUserRole('guest');
        // Reset to default? Or keep as is.
    };

    const updateUserProfile = (newData) => {
        setUserProfile(prev => ({ ...prev, ...newData }));
    };

    return (
        <AuthContext.Provider value={{
            userRole,
            setUserRole, // Exposed incase we need manual overrides like the dev login shortcuts
            userProfile,
            setUserProfile: updateUserProfile,
            authLoading,
            loginWithGoogle,
            logout,
            cachedAuth
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
