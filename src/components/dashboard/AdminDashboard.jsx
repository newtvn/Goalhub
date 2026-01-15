import React, { useState, useEffect } from 'react';
import {
    Tag, Save, Calendar, Smartphone,
    CalendarDays, Map, Layers,
    DollarSign, FileText, Users,
    Settings, Bell, User
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
    createTurf, updateTurf, deleteTurf,
    createExtra, updateExtra, updateSettings,
    createEvent, updateEvent, deleteEvent,
    createBooking, updateBooking, updateUserRole,
    createNotification,
    subscribeToBookings,
    subscribeToNotifications,
    subscribeToUsers,
    subscribeToTransactions
} from '../../data/supabaseData';

// Views
import CalendarView from './views/CalendarView';
import BookingsView from './views/BookingsView';
import EventsView from './views/EventsView';
import TurfsView from './views/TurfsView';
import ExtrasView from './views/ExtrasView';
import ReportsView from './views/ReportsView';
import UsersView from './views/UsersView';
import SettingsView from './views/SettingsView';
import NotificationsView from './views/NotificationsView';
import TransactionsView from './views/TransactionsView';
import UserProfile from './UserProfile';

// Modals
import BookingModal from './modals/BookingModal';
import TurfModal from './modals/TurfModal';
import EventModal from './modals/EventModal';
import UserModal from './modals/UserModal';
import ExtraModal from './modals/ExtraModal';

export default function AdminDashboard({
    eventsList,
    turfsList,
    extrasList,
    globalDiscount,
    showNotification
}) {
    const { theme, isDarkMode } = useTheme();
    const { userProfile, userRole } = useAuth();

    // Data State (Moved from App.jsx)
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Subscriptions
    useEffect(() => {
        const unsubBookings = subscribeToBookings(setBookings);
        const unsubNotifs = subscribeToNotifications(setNotifications);
        const unsubUsers = subscribeToUsers(setUsers);
        const unsubTrans = subscribeToTransactions(setTransactions);

        return () => {
            unsubBookings();
            unsubNotifs();
            unsubUsers();
            unsubTrans();
        };
    }, []);

    // State
    const [dashboardTab, setDashboardTab] = useState('calendar');
    const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split('T')[0]);

    // Editing State
    const [editingTurf, setEditingTurf] = useState(null);
    const [editingExtra, setEditingExtra] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);

    // Local Discount State
    const [localDiscount, setLocalDiscount] = useState(globalDiscount);

    useEffect(() => {
        setLocalDiscount(globalDiscount);
    }, [globalDiscount]);

    // --- HELPERS ---
    const calculateFinancials = (period) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const getWeekStart = () => {
            const d = new Date(now);
            const day = d.getDay();
            const diff = d.getDate() - day;
            return new Date(d.setDate(diff)).toISOString().split('T')[0];
        };

        const getMonthStart = () => {
            return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        };

        let filteredBookings = [];

        if (period === 'day') {
            filteredBookings = bookings.filter(b => b.date === today && b.status === 'Confirmed');
        } else if (period === 'week') {
            const weekStart = getWeekStart();
            filteredBookings = bookings.filter(b => b.date >= weekStart && b.status === 'Confirmed');
        } else if (period === 'month') {
            const monthStart = getMonthStart();
            filteredBookings = bookings.filter(b => b.date >= monthStart && b.status === 'Confirmed');
        }

        return filteredBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
    };

    const getDiscountedPrice = (price) => {
        if (!localDiscount || localDiscount <= 0) return price;
        return price - (price * (localDiscount / 100));
    };


    // --- HANDLERS (Delegated to Firebase) ---
    const handleUpdateGlobalDiscount = async (newDiscount) => {
        const result = await updateSettings({ globalDiscount: Number(newDiscount) });
        if (result.success) showNotification(`✅ Global discount updated to ${newDiscount}%`);
        else showNotification(`❌ Failed to update discount: ${result.error}`);
    };

    const handleSaveTurf = async (e) => {
        e.preventDefault();
        if (editingTurf.id === 'new') {
            const result = await createTurf({ ...editingTurf, price: Number(editingTurf.price), available: true });
            if (result.success) showNotification("✅ New turf created."); else showNotification(`❌ Error: ${result.error}`);
        } else {
            const result = await updateTurf(editingTurf.id, { ...editingTurf, price: Number(editingTurf.price) });
            if (result.success) showNotification("✅ Turf updated."); else showNotification(`❌ Error: ${result.error}`);
        }
        setEditingTurf(null);
    };

    const handleDeleteTurf = async (id) => {
        if (window.confirm('Are you sure?')) {
            const result = await deleteTurf(id);
            if (result.success) showNotification("✅ Turf deleted."); else showNotification(`❌ Error: ${result.error}`);
        }
    };

    const handleSaveExtra = async (e) => {
        e.preventDefault();
        if (editingExtra.id === 'new') {
            const result = await createExtra({ ...editingExtra, price: Number(editingExtra.price) });
            if (result.success) showNotification("✅ New extra created."); else showNotification(`❌ Error: ${result.error}`);
        } else {
            await updateExtra(editingExtra.id, { ...editingExtra, price: Number(editingExtra.price) });
            showNotification("Extra updated.");
        }
        setEditingExtra(null);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        if (editingEvent.id === 'new') {
            const result = await createEvent(editingEvent);
            if (result.success) showNotification("Event created."); else showNotification(`❌ Error: ${result.error}`);
        } else {
            const result = await updateEvent(editingEvent.id, editingEvent);
            if (result.success) showNotification("Event updated."); else showNotification(`❌ Error: ${result.error}`);
        }
        setEditingEvent(null);
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Delete event?')) {
            const result = await deleteEvent(id);
            if (result.success) showNotification("Event deleted."); else showNotification(`❌ Error: ${result.error}`);
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (editingUser.id) {
            const result = await updateUserRole(editingUser.id, editingUser.role);
            if (result.success) showNotification("User updated."); else showNotification(`❌ Error: ${result.error}`);
        }
        setEditingUser(null);
    };

    const handleDeleteUser = (id) => {
        showNotification("User deletion restricted to server admins.");
    };

    const handleSaveBooking = async (e) => {
        e.preventDefault();
        if (editingBooking.id === 'new') {
            const bookingData = { ...editingBooking, status: 'Confirmed', payment: 'Cash (Manual)', amount: Number(editingBooking.amount), timestamp: new Date().toISOString() };
            const result = await createBooking(bookingData);
            if (result.success) {
                showNotification("Booking created.");
                await createNotification({ type: 'booking', message: `Manual booking: ${editingBooking.customer} @ ${editingBooking.turf}`, bookingId: result.booking.id });
            } else showNotification(`❌ Error: ${result.error}`);
        } else {
            const result = await updateBooking(editingBooking.id, editingBooking);
            if (result.success) showNotification("Booking updated."); else showNotification(`❌ Error: ${result.error}`);
        }
        setEditingBooking(null);
    };

    const handleSlotClick = (turfName, time) => {
        const existing = bookings.find(b => b.date === calendarDate && b.turf === turfName && b.time === time);
        if (existing) setEditingBooking(existing);
        else setEditingBooking({ id: 'new', turf: turfName, date: calendarDate, time, duration: 1, customer: 'Walk-in Guest', amount: 0, payment: 'Pending', status: 'Pending' });
    };

    const handleDownloadPdf = (title) => showNotification(`Downloading ${title}.pdf...`);

    // --- RENDER ---
    return (
        <div className="space-y-8 md:space-y-10">

            {/* HEADER & TABS */}
            <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-black/40 backdrop-blur-xl border border-white/5' : 'bg-white/60 backdrop-blur-xl border border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{userRole === 'admin' ? 'Headquarters' : 'Operations'}</h2>
                        <p className={`text-lg ${theme.textSub}`}>Welcome back, {userProfile.name}.</p>
                    </div>

                    {/* Notification Badge/Profile shortcut if needed */}
                </div>

                {/* SCROLLABLE TABS */}
                <div className={`flex overflow-x-auto pb-2 gap-2 hide-scrollbar`}>
                    <TabButton active={dashboardTab === 'calendar'} onClick={() => setDashboardTab('calendar')} icon={Calendar} label="Calendar" theme={theme} />
                    <TabButton active={dashboardTab === 'bookings'} onClick={() => setDashboardTab('bookings')} icon={Smartphone} label="Bookings" theme={theme} />
                    <TabButton active={dashboardTab === 'events_mgmt'} onClick={() => setDashboardTab('events_mgmt')} icon={CalendarDays} label="Events" theme={theme} />

                    {userRole === 'admin' && (
                        <>
                            <div className={`w-px mx-1 my-2 ${theme.divider}`}></div>
                            <TabButton active={dashboardTab === 'turfs_mgmt'} onClick={() => setDashboardTab('turfs_mgmt')} icon={Map} label="Turfs" theme={theme} />
                            <TabButton active={dashboardTab === 'extras_mgmt'} onClick={() => setDashboardTab('extras_mgmt')} icon={Layers} label="Extras" theme={theme} />
                            <TabButton active={dashboardTab === 'transactions'} onClick={() => setDashboardTab('transactions')} icon={DollarSign} label="Finance" theme={theme} />
                            <div className={`w-px mx-1 my-2 ${theme.divider}`}></div>
                            <TabButton active={dashboardTab === 'users'} onClick={() => setDashboardTab('users')} icon={Users} label="Users" theme={theme} />
                            <TabButton active={dashboardTab === 'settings'} onClick={() => setDashboardTab('settings')} icon={Settings} label="Settings" theme={theme} />
                        </>
                    )}

                    <div className={`w-px mx-1 my-2 ${theme.divider}`}></div>
                    <TabButton active={dashboardTab === 'reports'} onClick={() => setDashboardTab('reports')} icon={FileText} label="Reports" theme={theme} />

                    <button
                        onClick={() => setDashboardTab('notifications')}
                        className={`${theme.navPill} flex items-center gap-2 whitespace-nowrap relative ${dashboardTab === 'notifications' ? theme.navPillActive : ''}`}
                    >
                        <Bell className="h-4 w-4" />
                        <span>Notifs</span>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                                {notifications.filter(n => !n.read).length}
                            </span>
                        )}
                    </button>

                    <TabButton active={dashboardTab === 'profile'} onClick={() => setDashboardTab('profile')} icon={User} label="Profile" theme={theme} />
                </div>
            </div>

            {/* DASHBOARD CONTENT */}
            <div className="animate-fade-in-up">
                {dashboardTab === 'calendar' && (
                    <CalendarView
                        bookings={bookings}
                        turfsList={turfsList}
                        localDiscount={localDiscount}
                        onSlotClick={handleSlotClick}
                        isDarkMode={isDarkMode}
                        calendarDate={calendarDate}
                        setCalendarDate={setCalendarDate}
                        revenueStats={{
                            day: calculateFinancials('day'),
                            week: calculateFinancials('week'),
                            month: calculateFinancials('month')
                        }}
                        userRole={userRole}
                    />
                )}
                {dashboardTab === 'bookings' && <BookingsView bookings={bookings} setEditingBooking={setEditingBooking} handleDownloadPdf={handleDownloadPdf} theme={theme} isDarkMode={isDarkMode} />}
                {dashboardTab === 'events_mgmt' && <EventsView eventsList={eventsList} setEditingEvent={setEditingEvent} handleDeleteEvent={handleDeleteEvent} theme={theme} isDarkMode={isDarkMode} />}
                {dashboardTab === 'turfs_mgmt' && <TurfsView turfsList={turfsList} setEditingTurf={setEditingTurf} handleDeleteTurf={handleDeleteTurf} theme={theme} isDarkMode={isDarkMode} />}
                {dashboardTab === 'extras_mgmt' && <ExtrasView extrasList={extrasList} setEditingExtra={setEditingExtra} theme={theme} isDarkMode={isDarkMode} />}

                {dashboardTab === 'transactions' && userRole === 'admin' && (
                    <TransactionsView transactions={transactions} theme={theme} isDarkMode={isDarkMode} />
                )}

                {dashboardTab === 'reports' && (
                    <ReportsView
                        handleDownloadPdf={handleDownloadPdf}
                    />
                )}

                {dashboardTab === 'users' && userRole === 'admin' && <UsersView users={users} setEditingUser={setEditingUser} handleDeleteUser={handleDeleteUser} theme={theme} isDarkMode={isDarkMode} />}

                {dashboardTab === 'settings' && userRole === 'admin' && (
                    <SettingsView
                        localDiscount={localDiscount}
                        handleUpdateGlobalDiscount={handleUpdateGlobalDiscount}
                        theme={theme}
                        isDarkMode={isDarkMode}
                    />
                )}

                {dashboardTab === 'notifications' && <NotificationsView notifications={notifications} theme={theme} isDarkMode={isDarkMode} />}

                {dashboardTab === 'profile' && <UserProfile bookings={bookings} />}
            </div>

            {/* MODALS */}
            {editingBooking && (
                <BookingModal
                    editingBooking={editingBooking}
                    setEditingBooking={setEditingBooking}
                    handleSaveBooking={handleSaveBooking}
                    turfsList={turfsList}
                    getDiscountedPrice={getDiscountedPrice}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
            )}

            {editingTurf && (
                <TurfModal
                    editingTurf={editingTurf}
                    setEditingTurf={setEditingTurf}
                    handleSaveTurf={handleSaveTurf}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
            )}

            {editingEvent && (
                <EventModal
                    editingEvent={editingEvent}
                    setEditingEvent={setEditingEvent}
                    handleSaveEvent={handleSaveEvent}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
            )}

            {editingUser && (
                <UserModal
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    handleSaveUser={handleSaveUser}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
            )}

            {editingExtra && (
                <ExtraModal
                    editingExtra={editingExtra}
                    setEditingExtra={setEditingExtra}
                    handleSaveExtra={handleSaveExtra}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
            )}

        </div>
    );
}

// --- SUB-COMPONENTS ---
function TabButton({ active, onClick, icon: Icon, label, theme }) {
    return (
        <button
            onClick={onClick}
            className={`${theme.navPill} flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? theme.navPillActive : 'hover:scale-105'}`}
        >
            <Icon className={`h-4 w-4 ${active ? 'text-emerald-400' : 'text-current opacity-70'}`} />
            <span>{label}</span>
        </button>
    );
}
