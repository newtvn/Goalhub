
import React from 'react';
import { DollarSign } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function TransactionsView({ transactions }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card}>
            <div className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme.tableHeader}`}>
                <div><h3 className={`font-bold text-lg ${theme.text}`}>Payment Transactions</h3><p className="text-xs">All M-Pesa payment records</p></div>
                <div className="flex gap-4">
                    <div className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <div className="text-xs text-emerald-500">Total Revenue</div>
                        <div className="font-bold text-emerald-500">KES {transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}</div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <div className="text-xs text-blue-500">Transactions</div>
                        <div className="font-bold text-blue-500">{transactions.length}</div>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={theme.tableHeader}>
                        <tr><th className="p-4 text-left">ID</th><th className="p-4 text-left">Customer</th><th className="p-4 text-left">Amount</th><th className="p-4 text-left">Status</th><th className="p-4 text-left">Method</th><th className="p-4 text-left">Date</th><th className="p-4 text-left">Booking</th></tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id} className={theme.tableRow}>
                                <td className="p-4 font-mono text-sm">{txn.id}</td>
                                <td className="p-4">
                                    <div className="font-medium">{txn.customerName}</div>
                                    <div className={`text-xs ${theme.textSub}`}>{txn.customerPhone}</div>
                                </td>
                                <td className="p-4 font-bold">KES {txn.amount?.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${txn.status === 'completed' ? 'bg-emerald-500/20 text-emerald-600' :
                                        txn.status === 'pending' || txn.status === 'awaiting_confirmation' ? 'bg-yellow-500/20 text-yellow-600' :
                                            txn.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                                                'bg-gray-500/20 text-gray-500'
                                        }`}>{txn.status}</span>
                                </td>
                                <td className="p-4">{txn.method}</td>
                                <td className="p-4 text-sm">{new Date(txn.createdAt).toLocaleString()}</td>
                                <td className="p-4">
                                    {txn.bookingId && <span className="text-emerald-500 text-sm">{txn.bookingId}</span>}
                                    {txn.turf && <div className={`text-xs ${theme.textSub}`}>{txn.turf}</div>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-12 text-center">
                        <DollarSign className={`h-12 w-12 mx-auto mb-4 ${theme.textSub}`} />
                        <p className={theme.textSub}>No transactions yet. Payments will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
