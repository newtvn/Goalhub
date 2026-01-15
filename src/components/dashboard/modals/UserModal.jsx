
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function UserModal({ editingUser, setEditingUser, handleSaveUser, userRole }) {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className={`${theme.card} w-full max-w-md p-8`}>
                <h3 className="text-xl font-bold mb-6">{editingUser.id ? 'Edit User' : 'New User'}</h3>
                <form onSubmit={handleSaveUser} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className={theme.input} required />
                    <input type="email" placeholder="Email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className={theme.input} required />
                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className={theme.input}>
                        <option value="manager" className="text-black">Manager</option>
                        {userRole === 'admin' && <option value="admin" className="text-black">Admin</option>}
                    </select>
                    <select value={editingUser.status} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })} className={theme.input}>
                        <option value="Active" className="text-black">Active</option>
                        <option value="Inactive" className="text-black">Inactive</option>
                    </select>
                    <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setEditingUser(null)} className={`px-4 ${theme.textSub} hover:text-emerald-500`}>Cancel</button><button type="submit" className={theme.btnPrimary + " py-2 px-6"}>Save</button></div>
                </form>
            </div>
        </div>
    );
}
