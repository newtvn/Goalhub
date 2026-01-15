
import React from 'react';
import { Plus, CheckCircle, Shield, Users } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const getExtraIcon = (iconName) => {
    const iconMap = {
        'users': <Users className="h-5 w-5" />,
        'check-circle': <CheckCircle className="h-5 w-5" />,
        'shield': <Shield className="h-5 w-5" />,
    };
    return iconMap[iconName] || <CheckCircle className="h-5 w-5" />;
};

export default function ExtrasView({ extrasList, setEditingExtra }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card}>
            <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                <div><h3 className={`font-bold text-lg ${theme.text}`}>Manage Extras</h3><p className="text-xs">Booking add-ons and services</p></div>
                <button onClick={() => setEditingExtra({ id: 'new', name: '', sub: '', price: 0, icon: 'check-circle' })} className={theme.btnPrimary + " py-2 px-4 text-sm flex items-center"}><Plus className="h-4 w-4 mr-2" /> Add Extra</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {extrasList.map(extra => (
                    <div key={extra.id} className={`p-4 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>{getExtraIcon(extra.icon)}</div>
                        <div className="flex-1">
                            <div className="font-bold">{extra.name}</div>
                            <div className={`text-xs ${theme.textSub}`}>{extra.sub}</div>
                            <div className="text-emerald-500 font-mono text-sm mt-1">+KES {extra.price}</div>
                        </div>
                        <button onClick={() => setEditingExtra(extra)} className="text-xs underline text-gray-500 hover:text-emerald-500">Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
