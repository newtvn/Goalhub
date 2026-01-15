
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function EventModal({ editingEvent, setEditingEvent, handleSaveEvent }) {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className={`${theme.card} w-full max-w-md p-8`}>
                <h3 className="text-xl font-bold mb-6">{editingEvent.id === 'new' ? 'Create New Event' : 'Edit Event'}</h3>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Event Title</label><input type="text" placeholder="e.g. Weekend League" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} className={theme.input} required /></div>
                    <div className="grid grid-cols-2 gap-4"><div><label className={`text-xs ml-2 ${theme.textSub}`}>Date</label><input type="date" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} className={theme.input} required /></div><div><label className={`text-xs ml-2 ${theme.textSub}`}>Time</label><input type="time" value={editingEvent.time} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} className={theme.input} required /></div></div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Image URL (Optional)</label><input type="text" placeholder="https://..." value={editingEvent.image} onChange={e => setEditingEvent({ ...editingEvent, image: e.target.value })} className={theme.input} /></div>
                    <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setEditingEvent(null)} className={`px-4 ${theme.textSub} hover:text-emerald-500`}>Cancel</button><button type="submit" className={theme.btnPrimary + " py-2 px-6"}>Save Event</button></div>
                </form>
            </div>
        </div>
    );
}
