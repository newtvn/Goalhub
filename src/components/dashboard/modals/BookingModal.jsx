
import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function BookingModal({ editingBooking, setEditingBooking, handleSaveBooking, userRole }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className={`${theme.card} w-full max-w-lg p-8`}>
                <div className="flex justify-between mb-6"><h3 className="text-xl font-bold">{editingBooking.id === 'new' ? 'New Manual Booking' : 'Manage Booking'}</h3><button onClick={() => setEditingBooking(null)}><X className={`h-5 w-5 ${theme.textSub}`} /></button></div>
                <form onSubmit={handleSaveBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4"><div><label className={`text-xs ml-2 ${theme.textSub}`}>Date</label><input type="date" value={editingBooking.date} onChange={e => setEditingBooking({ ...editingBooking, date: e.target.value })} className={theme.input} /></div><div><label className={`text-xs ml-2 ${theme.textSub}`}>Time</label><input type="text" value={editingBooking.time} readOnly className={theme.input + " cursor-not-allowed opacity-50"} /></div></div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Customer</label><input type="text" value={editingBooking.customer} onChange={e => setEditingBooking({ ...editingBooking, customer: e.target.value })} className={theme.input} /></div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Turf</label><input type="text" value={editingBooking.turf} readOnly className={theme.input + " cursor-not-allowed opacity-50"} /></div>
                    {userRole === 'admin' && (<div><label className={`text-xs ml-2 ${theme.textSub}`}>Amount (KES)</label><input type="number" value={editingBooking.amount} onChange={e => setEditingBooking({ ...editingBooking, amount: Number(e.target.value) })} className={theme.input} /></div>)}
                    <div className="flex justify-between gap-4">
                        <div className="w-1/2"><label className={`text-xs ml-2 ${theme.textSub}`}>Status</label><select value={editingBooking.status} onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value })} className={theme.input}><option value="Confirmed" className="text-black">Confirmed</option><option value="Pending" className="text-black">Pending</option><option value="Cancelled" className="text-black">Cancelled</option></select></div>
                        <div className="w-1/2"><label className={`text-xs ml-2 ${theme.textSub}`}>Payment</label><select value={editingBooking.payment} onChange={e => setEditingBooking({ ...editingBooking, payment: e.target.value })} className={theme.input}><option value="M-Pesa" className="text-black">M-Pesa</option><option value="Cash" className="text-black">Cash</option><option value="Pending" className="text-black">Pending</option></select></div>
                    </div>
                    <button type="submit" className={theme.btnPrimary + " w-full mt-4"}>{editingBooking.id === 'new' ? 'Create Booking' : 'Update Booking'}</button>
                </form>
            </div>
        </div>
    );
}
