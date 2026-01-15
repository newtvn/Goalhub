
import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function TurfsView({ turfsList, setEditingTurf, handleDeleteTurf }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card}>
            <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                <div><h3 className={`font-bold text-lg ${theme.text}`}>Manage Turfs</h3><p className="text-xs">Add, edit, or remove football pitches</p></div>
                <button onClick={() => setEditingTurf({ id: 'new', name: '', location: '', type: '5-a-side', price: 2500, image: '', description: '' })} className={theme.btnPrimary + " py-2 px-4 text-sm flex items-center"}><Plus className="h-4 w-4 mr-2" /> Add Turf</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {turfsList.map(turf => (
                    <div key={turf.id} className={`rounded-2xl overflow-hidden border transition ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
                        <img src={turf.image} alt={turf.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-lg">{turf.name}</h4>
                                    <p className={`text-sm ${theme.textSub}`}>{turf.location}</p>
                                </div>
                                <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full">{turf.type}</span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="font-bold text-emerald-500">KES {turf.price?.toLocaleString()}/hr</div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingTurf(turf)} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}><Edit2 className="h-4 w-4" /></button>
                                    <button onClick={() => handleDeleteTurf(turf.id)} className={`p-2 rounded-full text-red-400 ${isDarkMode ? 'bg-white/10 hover:bg-red-500/20' : 'bg-slate-100 hover:bg-red-50'}`}><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
