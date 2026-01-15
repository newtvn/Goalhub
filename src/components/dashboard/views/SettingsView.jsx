
import React from 'react';
import { Percent, Settings } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function SettingsView({ globalDiscount, setGlobalDiscount, handleUpdateGlobalDiscount }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card + " p-6 md:p-8"}>
            <h3 className="font-bold text-xl mb-6">Global Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500/20 p-3 rounded-xl"><Percent className="h-6 w-6 text-red-500" /></div>
                        <div>
                            <h4 className="font-bold">Global Discount</h4>
                            <p className={`text-sm ${theme.textSub}`}>Apply site-wide discount</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <input type="number" min="0" max="100" value={globalDiscount} onChange={(e) => setGlobalDiscount(Number(e.target.value))} className={theme.input + " w-24 text-center text-xl font-bold"} />
                        <span className="text-2xl font-bold">%</span>
                        <button onClick={() => handleUpdateGlobalDiscount(globalDiscount)} className={theme.btnPrimary + " ml-auto"}>Save</button>
                    </div>
                    {globalDiscount > 0 && <div className="mt-4 p-3 rounded-xl bg-red-500/20 text-red-400 text-sm">⚠️ A {globalDiscount}% discount is currently active!</div>}
                </div>
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-500/20 p-3 rounded-xl"><Settings className="h-6 w-6 text-emerald-500" /></div>
                        <div><h4 className="font-bold">Quick Actions</h4><p className={`text-sm ${theme.textSub}`}>Common admin tasks</p></div>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => { setGlobalDiscount(10); handleUpdateGlobalDiscount(10); }} className={`w-full text-left p-3 rounded-xl transition ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-100'}`}>🏷️ Set 10% Flash Sale</button>
                        <button onClick={() => { setGlobalDiscount(0); handleUpdateGlobalDiscount(0); }} className={`w-full text-left p-3 rounded-xl transition ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-100'}`}>❌ Remove All Discounts</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
