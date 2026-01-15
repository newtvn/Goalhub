
import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function UsersView({ users, setEditingUser, handleDeleteUser }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card}>
            <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                <h3 className={`font-bold text-lg ${theme.text}`}>Staff Access</h3>
                <button onClick={() => setEditingUser({ id: null, name: '', email: '', role: 'manager', status: 'Active' })} className={theme.btnPrimary + " py-2 px-4 text-sm flex items-center"}><Plus className="h-4 w-4 mr-2" /> Add User</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className={theme.tableHeader}><tr><th className="p-4 pl-6">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right pr-6">Actions</th></tr></thead>
                    <tbody className={isDarkMode ? 'divide-y divide-white/5' : 'divide-y divide-slate-100'}>
                        {users.map(user => (
                            <tr key={user.id} className={theme.tableRow}>
                                <td className="p-4 pl-6 font-medium">{user.name}</td>
                                <td className={`p-4 ${theme.textSub}`}>{user.email}</td>
                                <td className="p-4 capitalize text-emerald-500">{user.role}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-500'}`}>{user.status}</span></td>
                                <td className="p-4 text-right pr-6 space-x-3">
                                    <button onClick={() => setEditingUser(user)} className="text-gray-400 hover:text-emerald-500"><Edit2 className="h-4 w-4" /></button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
