
import React, { useState } from 'react';
import { Search, Edit2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function BookingsView({ bookings, setEditingBooking }) {
    const { theme, isDarkMode } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBookings = bookings.filter(b =>
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.turf.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={theme.card}>
            <div className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme.tableHeader}`}>
                <h3 className={`font-bold text-lg ${theme.text}`}>Bookings Database</h3>
                <div className={`flex items-center space-x-2 rounded-xl px-3 py-2 border w-full md:w-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <Search className="h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-sm w-full md:w-56 placeholder:text-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className={theme.tableHeader}><tr><th className="p-4 pl-6">Ref</th><th className="p-4">Name</th><th className="p-4">Details</th><th className="p-4">Status</th><th className="p-4 text-right pr-6">Action</th></tr></thead>
                    <tbody className={isDarkMode ? 'divide-y divide-white/5' : 'divide-y divide-slate-100'}>
                        {filteredBookings.map(b => (
                            <tr key={b.id} className={theme.tableRow}>
                                <td className="p-4 pl-6 font-mono text-emerald-500">{b.id}</td>
                                <td className="p-4">{b.customer}</td>
                                <td className={`p-4 ${theme.textSub}`}>{b.turf} <br /><span className="text-xs">{b.date}</span></td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-yellow-500/20 text-yellow-600'}`}>{b.status}</span></td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setEditingBooking(b)} className="text-gray-400 hover:text-emerald-500 transition">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No bookings found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
