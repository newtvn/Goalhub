
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function ExtraModal({ editingExtra, setEditingExtra, handleSaveExtra }) {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className={`${theme.card} w-full max-w-md p-8`}>
                <h3 className="text-xl font-bold mb-6">{editingExtra.id === 'new' ? 'Add New Extra' : 'Edit Extra'}</h3>
                <form onSubmit={handleSaveExtra} className="space-y-4">
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Name</label><input type="text" placeholder="e.g. Team Bibs" value={editingExtra.name} onChange={e => setEditingExtra({ ...editingExtra, name: e.target.value })} className={theme.input} required /></div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Subtitle</label><input type="text" placeholder="e.g. Set of 10" value={editingExtra.sub} onChange={e => setEditingExtra({ ...editingExtra, sub: e.target.value })} className={theme.input} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={`text-xs ml-2 ${theme.textSub}`}>Price (KES)</label><input type="number" placeholder="200" value={editingExtra.price} onChange={e => setEditingExtra({ ...editingExtra, price: e.target.value })} className={theme.input} required /></div>
                        <div><label className={`text-xs ml-2 ${theme.textSub}`}>Icon</label>
                            <select value={editingExtra.icon} onChange={e => setEditingExtra({ ...editingExtra, icon: e.target.value })} className={theme.input}>
                                <option value="check-circle">Checkmark</option>
                                <option value="users">Users/Teams</option>
                                <option value="shield">Shield/Pro</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setEditingExtra(null)} className={`px-4 ${theme.textSub} hover:text-emerald-500`}>Cancel</button><button type="submit" className={theme.btnPrimary + " py-2 px-6"}>Save Extra</button></div>
                </form>
            </div>
        </div>
    );
}
