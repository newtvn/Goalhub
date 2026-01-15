
import React from 'react';
import { Plus, Calendar as CalendarIcon, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function EventsView({ eventsList, setEditingEvent, handleDeleteEvent }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card}>
            <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                <div><h3 className={`font-bold text-lg ${theme.text}`}>Manage Events</h3><p className="text-xs">Create, Postpone (Edit), or Delete Events</p></div>
                <button onClick={() => setEditingEvent({ id: 'new', title: '', date: '', time: '', image: '' })} className={theme.btnPrimary + " py-2 px-4 text-sm flex items-center"}><Plus className="h-4 w-4 mr-2" /> Create Event</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {eventsList.map(event => (
                    <div key={event.id} className={`rounded-xl p-4 flex items-center border transition group relative ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                        <img src={event.image} alt={event.title} className="h-16 w-16 rounded-lg object-cover mr-4" />
                        <div className="flex-1"><h4 className="font-bold">{event.title}</h4><div className={`text-xs mt-1 flex items-center ${theme.textSub}`}><CalendarIcon className="h-3 w-3 mr-1 text-emerald-500" /> {event.date} @ {event.time}</div></div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingEvent(event)} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white border border-slate-200 hover:bg-slate-50'} text-emerald-500`}><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteEvent(event.id)} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-red-500/20' : 'bg-white border border-slate-200 hover:bg-red-50'} text-red-400`}><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
                {eventsList.length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center p-8 text-gray-500">No events scheduled.</div>
                )}
            </div>
        </div>
    );
}
