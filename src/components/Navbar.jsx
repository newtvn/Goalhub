import React from 'react';
import { Sun, Moon, User, LogOut, X, Menu } from 'lucide-react';

export default function Navbar({
    theme,
    isDarkMode,
    setIsDarkMode,
    navigateTo,
    currentView,
    userRole,
    userProfile,
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
    setDashboardTab,
    handleLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}) {
    return (
        <nav className={theme.glassNav}>
            <div className="flex justify-between items-center gap-4">
                {/* LEFT: LOGO */}
                <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('landing')}>
                    <span className={`text-2xl tracking-[0.15em] font-extrabold uppercase font-mono transition-colors duration-300 ${isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'}`}>
                        GoalHub
                    </span>
                </div>

                {/* CENTER: DESKTOP NAV */}
                <div className={`hidden md:flex items-center rounded-full p-1.5 gap-2 backdrop-blur-md border transition-all ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
                    <button onClick={() => navigateTo('landing')} className={`${theme.navPill} ${currentView === 'landing' ? theme.navPillActive : ''}`}>Home</button>
                    <button onClick={() => navigateTo('events')} className={`${theme.navPill} ${currentView === 'events' ? theme.navPillActive : ''}`}>Events</button>
                    {userRole !== 'guest' && (
                        <button onClick={() => navigateTo('dashboard')} className={`${theme.navPill} ${currentView === 'dashboard' ? theme.navPillActive : ''}`}>Dashboard</button>
                    )}
                </div>

                {/* RIGHT: PROFILE / LOGIN / MOBILE MENU BTN */}
                <div className="flex items-center gap-5">

                    {/* THEME TOGGLE */}
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className={theme.iconBtn}>
                        {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                    </button>

                    <div className="hidden md:flex items-center gap-4">
                        {userRole === 'guest' ? (
                            <button onClick={() => navigateTo('login')} className="text-sm font-medium hover:text-emerald-500 transition px-4">Log In</button>
                        ) : (
                            <div className="flex items-center gap-4 relative">
                                {/* PROFILE DROPDOWN TRIGGER */}
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className={`flex items-center gap-3 pr-1 pl-4 py-1 rounded-full transition border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    <span className="text-xs font-bold hidden sm:block mr-2">{userProfile.name}</span>
                                    <img src={userProfile.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-emerald-500/50" />
                                </button>

                                {/* DROPDOWN MENU */}
                                {isProfileDropdownOpen && (
                                    <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-[#0a1410] border-white/10' : 'bg-white border-slate-200'}`}>
                                        <button
                                            onClick={() => {
                                                navigateTo('dashboard');
                                                if (setDashboardTab) setDashboardTab('profile'); // Guard in case not passed
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center transition ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            <User className="h-4 w-4 mr-2" /> View Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center transition text-red-500 ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" /> Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        {userRole !== 'guest' && (
                            <img onClick={() => navigateTo('dashboard')} src={userProfile.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-emerald-500/50 mr-3 cursor-pointer" />
                        )}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className={`absolute top-full left-0 w-full mt-4 border rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col space-y-2 md:hidden animate-in fade-in slide-in-from-top-5 z-50 ${isDarkMode ? 'bg-[#0a1410] border-white/10' : 'bg-white border-slate-200'}`}>
                    <button onClick={() => navigateTo('landing')} className={`p-3 text-left rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Home</button>
                    <button onClick={() => navigateTo('events')} className={`p-3 text-left rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Events</button>
                    {userRole !== 'guest' && (
                        <button onClick={() => navigateTo('dashboard')} className={`p-3 text-left rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Dashboard</button>
                    )}
                    {userRole === 'guest' ? (
                        <button onClick={() => navigateTo('login')} className={`p-3 text-left text-emerald-500 rounded-xl font-bold ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Log In</button>
                    ) : (
                        <button onClick={handleLogout} className={`p-3 text-left text-red-500 rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Log Out</button>
                    )}
                </div>
            )}
        </nav>
    );
}
