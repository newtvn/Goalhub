
import React from 'react';
import { X, Calendar as CalendarIcon, CalendarPlus, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EventsPage({ eventsList, navigateTo, handleAddToCalendar, handleNotifyMe }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className="space-y-10 min-h-[60vh]">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={() => navigateTo('landing')} className={theme.iconBtn}><X className="h-5 w-5" /></button>
                <h2 className="text-2xl md:text-3xl font-bold">Leagues & Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {eventsList.map(event => (
                    <div key={event.id} className={`${theme.card} flex flex-col md:flex-row overflow-hidden`}>
                        <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2">
                            <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-2">Upcoming</span>
                            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                            <div className={`flex items-center mb-6 text-sm font-medium ${theme.textSub}`}><CalendarIcon className="h-4 w-4 mr-2 text-emerald-500" /> {event.date} @ {event.time}</div>
                            <div className="flex space-x-3 mt-auto">
                                <button onClick={() => handleAddToCalendar(event)} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
                                    <CalendarPlus className="h-4 w-4 mr-1" /> Calendar
                                </button>
                                <button onClick={() => handleNotifyMe(event)} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
                                    <Bell className="h-4 w-4 mr-1" /> Notify
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
