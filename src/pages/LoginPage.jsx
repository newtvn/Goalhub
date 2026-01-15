
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function LoginPage({ navigateTo }) {
    const { theme, isDarkMode } = useTheme();
    const { loginWithGoogle, setUserRole, setUserProfile } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLoginSubmit = async () => {
        setLoading(true);
        setError(null);

        // Simulate network delay for mock login
        setTimeout(() => {
            if (username.toLowerCase().includes('admin')) {
                setUserRole('admin');
                setUserProfile({
                    name: 'Chief Admin',
                    email: 'admin@goalhub.ke',
                    phone: '+254 700 000 000',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
                });
                navigateTo('dashboard');
            } else if (username.toLowerCase().includes('manager')) {
                setUserRole('manager');
                setUserProfile({
                    name: 'Manager John',
                    email: 'manager@goalhub.ke',
                    phone: '+254 722 000 000',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
                });
                navigateTo('dashboard');
            } else if (username) {
                // Mock user login
                setUserRole('user');
                setUserProfile({ name: 'Alex K.', email: username || 'alex@goalhub.ke' });
                navigateTo('dashboard');
            } else {
                setError("Please enter a username or email.");
                setLoading(false);
            }
        }, 1000);
    };

    const handleGoogleSignInClick = async () => {
        setLoading(true);
        setError(null);
        const { error } = await loginWithGoogle();

        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // No need to navigate manually, Supabase will redirect to the URL configured in AuthContext
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
            <div className={`${theme.card} w-full max-w-md p-8 md:p-10 relative overflow-hidden`}>
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                    </div>
                )}

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className={`text-sm ${theme.textSub}`}>Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 flex items-center gap-3 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignInClick}
                    disabled={loading}
                    className={`w-full mb-8 px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 ${isDarkMode
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-white text-gray-900 hover:bg-gray-50 border-2 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
                        }`}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                    <span className={`text-xs uppercase font-bold tracking-wider ${theme.textSub}`}>
                        Or using email
                    </span>
                    <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${theme.textSub}`}>Username / Email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. alex@goalhub.ke"
                            className={`${theme.input} w-full`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${theme.textSub}`}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`${theme.input} w-full`}
                        />
                    </div>
                </div>

                <button
                    onClick={handleLoginSubmit}
                    disabled={loading}
                    className={`${theme.btnPrimary} w-full py-3.5 text-base shadow-lg hover:shadow-emerald-500/25`}
                >
                    Sign In
                </button>

                <div className="mt-8 text-center bg-emerald-500/5 -mx-8 -mb-8 py-4 border-t border-emerald-500/10">
                    <button onClick={() => navigateTo('landing')} className={`text-sm font-medium ${theme.textSub} hover:text-emerald-500 transition`}>
                        Cancel and return home
                    </button>
                </div>
            </div>
        </div>
    );
}
