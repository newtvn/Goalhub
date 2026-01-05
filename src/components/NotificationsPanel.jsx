import React from 'react';
import { Calendar as CalendarIcon, DollarSign, Settings, Trash2, Bell, CheckCircle } from 'lucide-react';

export default function NotificationsPanel({ notifications, setNotifications, theme, isDarkMode }) {

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleMarkRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={theme.card}>
            <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                <div>
                    <h3 className={`font-bold text-lg ${theme.text}`}>Notifications</h3>
                    <p className="text-xs">All system and booking notifications</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className={`text-xs ${theme.textAccent} hover:underline flex items-center gap-1`}
                    >
                        <CheckCircle className="h-3 w-3" /> Mark all as read
                    </button>
                )}
            </div>
            <div className="p-6 space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className={`h-16 w-16 mx-auto mb-4 ${theme.textSub} opacity-50`} />
                        <p className={theme.textSub}>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-2xl border transition cursor-pointer ${notif.read
                                ? (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 opacity-70')
                                : (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                                }`}
                            onClick={() => handleMarkRead(notif.id)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {notif.type === 'booking' && <CalendarIcon className="h-4 w-4 text-emerald-500" />}
                                        {notif.type === 'payment' && <DollarSign className="h-4 w-4 text-emerald-500" />}
                                        {notif.type === 'system' && <Settings className="h-4 w-4 text-gray-500" />}
                                        <span className={`text-xs uppercase font-bold ${theme.textSub}`}>{notif.type}</span>
                                        {!notif.read && <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>}
                                    </div>
                                    <p className={`${theme.text} font-medium`}>{notif.message}</p>
                                    <p className={`text-xs ${theme.textSub} mt-2`}>
                                        {new Date(notif.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, notif.id)}
                                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-full"
                                    title="Delete notification"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
