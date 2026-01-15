
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TIME_SLOTS } from '../../../data/constants';

export default function CalendarView({
    bookings,
    turfsList,
    calendarDate,
    setCalendarDate,
    onSlotClick,
    revenueStats,
    userRole
}) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Daily Revenue</p><h3 className="text-3xl font-bold text-emerald-500">KES {revenueStats.day.toLocaleString()}</h3></div>
                <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Weekly Revenue</p><h3 className="text-3xl font-bold">KES {revenueStats.week.toLocaleString()}</h3></div>
                <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Monthly Revenue</p><h3 className="text-3xl font-bold text-purple-500">KES {revenueStats.month.toLocaleString()}</h3></div>
            </div>

            <div className={theme.card + " p-4 md:p-6"}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h3 className="font-bold text-xl mb-3 md:mb-0">Daily Schedule (Click + to Manually Book)</h3>
                    <div className="flex items-center space-x-4"><input type="date" value={calendarDate} onChange={(e) => setCalendarDate(e.target.value)} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4 py-2 outline-none`} /></div>
                </div>
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-[150px_1fr] gap-4">
                            <div className="space-y-4 pt-12">{turfsList.map(t => <div key={t.id} className={`h-16 flex items-center font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{t.name}</div>)}</div>
                            <div>
                                <div className="grid grid-cols-12 gap-2 mb-4">{TIME_SLOTS.slice(0, 12).map(t => (<div key={t} className={`text-xs text-center ${theme.textSub}`}>{t}</div>))}</div>
                                <div className="space-y-4">
                                    {turfsList.map(t => (
                                        <div key={t.id} className="grid grid-cols-12 gap-2 h-16">
                                            {TIME_SLOTS.slice(0, 12).map(time => {
                                                const booking = bookings.find(b => b.date === calendarDate && b.turf === t.name && b.time === time && b.status !== 'Cancelled');
                                                return (
                                                    <div key={time} onClick={() => onSlotClick(t.name, time)} className={`rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer transition hover:scale-105 ${booking ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' : isDarkMode ? 'bg-white/5 text-gray-600 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                                                        {booking ? (userRole === 'manager' ? 'Bk' : booking.customer.split(' ')[0]) : '+'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
