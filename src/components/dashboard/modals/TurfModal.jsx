
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function TurfModal({ editingTurf, setEditingTurf, handleSaveTurf }) {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className={`${theme.card} w-full max-w-lg p-8`}>
                <h3 className="text-xl font-bold mb-6">{editingTurf.id === 'new' ? 'Add New Turf' : 'Edit Turf'}</h3>
                <form onSubmit={handleSaveTurf} className="space-y-4">
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Turf Name</label><input type="text" placeholder="e.g. Allianz Arena" value={editingTurf.name} onChange={e => setEditingTurf({ ...editingTurf, name: e.target.value })} className={theme.input} required /></div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Location</label><input type="text" placeholder="e.g. Kitengela, Namanga Rd" value={editingTurf.location} onChange={e => setEditingTurf({ ...editingTurf, location: e.target.value })} className={theme.input} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={`text-xs ml-2 ${theme.textSub}`}>Type</label>
                            <select value={editingTurf.type} onChange={e => setEditingTurf({ ...editingTurf, type: e.target.value })} className={theme.input}>
                                <option value="5-a-side">5-a-side</option>
                                <option value="7-a-side">7-a-side</option>
                                <option value="11-a-side">11-a-side</option>
                            </select>
                        </div>
                        <div><label className={`text-xs ml-2 ${theme.textSub}`}>Price/Hour (KES)</label><input type="number" placeholder="2500" value={editingTurf.price} onChange={e => setEditingTurf({ ...editingTurf, price: e.target.value })} className={theme.input} required /></div>
                    </div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Image URL</label><input type="text" placeholder="https://..." value={editingTurf.image} onChange={e => setEditingTurf({ ...editingTurf, image: e.target.value })} className={theme.input} /></div>
                    <div><label className={`text-xs ml-2 ${theme.textSub}`}>Description</label><textarea placeholder="Brief description..." value={editingTurf.description} onChange={e => setEditingTurf({ ...editingTurf, description: e.target.value })} className={theme.input + " h-24"} /></div>
                    <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setEditingTurf(null)} className={`px-4 ${theme.textSub} hover:text-emerald-500`}>Cancel</button><button type="submit" className={theme.btnPrimary + " py-2 px-6"}>Save Turf</button></div>
                </form>
            </div>
        </div>
    );
}
