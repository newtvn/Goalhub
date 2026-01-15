
import React from 'react';
import { X, CheckCircle, Smartphone, Shield, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TIME_SLOTS } from '../data/constants';

// Helper for icons
const getExtraIcon = (iconName) => {
    const iconMap = {
        'users': <Users className="h-5 w-5" />,
        'check-circle': <CheckCircle className="h-5 w-5" />,
        'shield': <Shield className="h-5 w-5" />,
    };
    return iconMap[iconName] || <CheckCircle className="h-5 w-5" />;
};

export default function BookingPage({
    selectedTurf,
    navigateTo,
    globalDiscount,
    bookingDate,
    setBookingDate,
    duration,
    setDuration,
    selectedTime,
    setSelectedTime,
    extrasList,
    cartExtras,
    toggleExtra,
    calculateTotal
}) {
    const { theme, isDarkMode } = useTheme();

    const getDiscountedPrice = (price) => {
        if (!globalDiscount || globalDiscount <= 0) return price;
        return price - (price * (globalDiscount / 100));
    };

    if (!selectedTurf) return null;

    return (
        <div className={`${theme.card} max-w-5xl mx-auto overflow-hidden`}>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className={`p-6 md:p-10 text-white flex flex-col justify-between relative overflow-hidden order-1 md:order-1 ${isDarkMode ? 'bg-[#0f1f18]' : 'bg-slate-900'}`}>
                    <div className="relative z-10">
                        <button onClick={() => navigateTo('landing')} className="text-gray-400 hover:text-white mb-4 md:mb-8 flex items-center text-sm"><X className="h-4 w-4 mr-2" /> Cancel</button>
                        <h2 className="text-2xl md:text-3xl font-bold mb-1">{selectedTurf.name}</h2>
                        <p className="text-emerald-400 font-medium mb-6">{selectedTurf.type}</p>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Base Rate</div>
                                {globalDiscount > 0 ? (
                                    <div>
                                        <span className="text-sm text-gray-500 line-through decoration-red-500 mr-2">KES {selectedTurf.price}/hr</span>
                                        <span className="text-xl font-bold text-emerald-400">KES {getDiscountedPrice(selectedTurf.price)}/hr</span>
                                    </div>
                                ) : (
                                    <div className="text-xl font-bold">KES {selectedTurf.price}/hr</div>
                                )}
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Estimated Total</div>
                                <div className="text-3xl font-bold text-emerald-400">KES {calculateTotal().toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 relative z-10 hidden md:block">
                        <button disabled={!selectedTime} onClick={() => navigateTo('checkout')} className={`w-full py-4 rounded-2xl font-bold text-black transition-all ${selectedTime ? 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}>Continue to Checkout</button>
                    </div>
                </div>

                <div className={`col-span-1 md:col-span-2 p-6 md:p-12 order-2 md:order-2 ${isDarkMode ? 'bg-black/20' : 'bg-slate-50/50'}`}>
                    <div className="space-y-8 md:space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className={`block text-sm font-medium mb-3 ml-2 ${theme.textSub}`}>Date</label><input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className={theme.input} /></div>
                            <div><label className={`block text-sm font-medium mb-3 ml-2 ${theme.textSub}`}>Duration</label><select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={theme.input}><option value={1}>1 Hour</option><option value={1.5}>1.5 Hours</option><option value={2}>2 Hours</option><option value={3}>3 Hours</option></select></div>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-4 ml-2 ${theme.textSub}`}>Available Slots</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {TIME_SLOTS.map(time => (
                                    <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${selectedTime === time ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg scale-105' : isDarkMode ? 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'}`}>{time}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-4 ml-2 ${theme.textSub}`}>Extras</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {extrasList.map(extra => (
                                    <div key={extra.id} onClick={() => toggleExtra(extra)} className={`flex items-center p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${cartExtras.find(e => e.id === extra.id) ? "bg-emerald-500/10 border-emerald-500/50" : isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-slate-200 hover:border-emerald-400"}`}>
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 transition-colors ${cartExtras.find(e => e.id === extra.id) ? 'bg-emerald-500 text-black' : isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>{getExtraIcon(extra.icon)}</div>
                                        <div className="flex-1"><div className={`font-bold ${cartExtras.find(e => e.id === extra.id) ? theme.textAccent : ''}`}>{extra.name}</div><div className={`text-xs ${theme.textSub}`}>{extra.sub}</div></div>
                                        <div className={`font-mono text-sm ${theme.textSub}`}>+ {extra.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:hidden pt-4">
                            <button disabled={!selectedTime} onClick={() => navigateTo('checkout')} className={`w-full py-4 rounded-2xl font-bold text-black transition-all ${selectedTime ? 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}>Continue to Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
