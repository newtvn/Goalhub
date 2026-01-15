
import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { subscribeToBookings } from '../../firebase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function UserProfile({ bookings: propBookings }) {
    const { theme, isDarkMode } = useTheme();
    const { userProfile, setUserProfile } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [localBookings, setLocalBookings] = useState([]);

    useEffect(() => {
        if (!propBookings) {
            const unsub = subscribeToBookings(setLocalBookings);
            return () => unsub();
        }
    }, [propBookings]);

    const bookings = propBookings || localBookings;

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setIsEditingProfile(false);
        // Ideally trigger a notification here
        // showNotification("Profile updated successfully");
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className={`${theme.card} p-6 md:p-8 flex flex-col items-center md:w-1/3 relative overflow-hidden`}>
                    <div className="relative">
                        <img src={userProfile.avatar} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-emerald-500/20 mb-4" />
                        <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="absolute bottom-4 right-0 bg-emerald-500 p-2 rounded-full text-black hover:scale-110 transition"><Edit2 className="h-4 w-4" /></button>
                    </div>
                    <h2 className="text-2xl font-bold text-center">{userProfile.name}</h2>
                    <p className={`${theme.textSub} mb-6 text-center`}>{userProfile.email}</p>
                    <div className={`w-full rounded-xl p-4 text-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <div className={`text-xs uppercase font-bold ${theme.textSub}`}>Total Bookings</div>
                        <div className="text-2xl font-bold text-emerald-500">
                            {bookings.filter(b => b.customer === userProfile.name).length}
                        </div>
                    </div>
                </div>
                <div className={`${theme.card} p-6 md:p-8 flex-1`}>
                    {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={userProfile.name} onChange={e => setUserProfile({ name: e.target.value })} className={theme.input} placeholder="Full Name" />
                                <input value={userProfile.phone} onChange={e => setUserProfile({ phone: e.target.value })} className={theme.input} placeholder="Phone" />
                            </div>
                            <input value={userProfile.email} onChange={e => setUserProfile({ email: e.target.value })} className={theme.input} placeholder="Email" />
                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={() => setIsEditingProfile(false)} className="text-gray-400 px-4">Cancel</button>
                                <button type="submit" className={theme.btnPrimary}>Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-full flex flex-col">
                            <h3 className="font-bold text-xl mb-6">Your Bookings</h3>
                            <div className="overflow-y-auto max-h-80 space-y-3 pr-2 custom-scrollbar">
                                {bookings.filter(b => b.customer === userProfile.name).sort((a, b) => new Date(b.date) - new Date(a.date)).map(booking => {
                                    const isPast = new Date(booking.date) < new Date();
                                    return (
                                        <div key={booking.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center ${isPast ? (isDarkMode ? 'bg-white/5 border-white/5 opacity-60' : 'bg-slate-50 border-slate-100 opacity-60') : (isDarkMode ? 'bg-[#0f1f18] border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')}`}>
                                            <div className="mb-2 md:mb-0">
                                                <div className="font-bold text-lg">{booking.turf}</div>
                                                <div className={`text-sm ${theme.textSub}`}>{booking.date} @ {booking.time}</div>
                                            </div>
                                            <div className="text-left md:text-right w-full md:w-auto">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${isPast ? 'bg-gray-500/20 text-gray-400' : 'bg-emerald-500/20 text-emerald-600'}`}>
                                                    {isPast ? 'Completed' : 'Upcoming'}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
