
import React from 'react';
import { ChevronRight, MapPin, ArrowRight, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage({ turfsList, addToCart, globalDiscount }) {
    const { theme, isDarkMode } = useTheme();

    const getDiscountedPrice = (price) => {
        if (!globalDiscount || globalDiscount <= 0) return price;
        return price - (price * (globalDiscount / 100));
    };

    return (
        <div className="space-y-12 md:space-y-20">
            <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[50vh] md:min-h-[60vh] flex items-end p-6 md:p-16 shadow-2xl shadow-emerald-900/10 group">
                <img src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1600" alt="Hero" className="absolute inset-0 w-full h-full object-cover brightness-50 transition duration-1000 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90 ${isDarkMode ? 'from-[#020604]' : 'from-slate-900'}`}></div>
                <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Now Live</div>
                        {globalDiscount > 0 && <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pulse">{globalDiscount}% OFF SALE</div>}
                    </div>
                    <h1 className={`text-4xl md:text-8xl font-bold mb-4 md:mb-6 leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-white'}`}>The Future of <br /> <span className="text-emerald-500">Football.</span></h1>
                    <p className="text-base md:text-2xl mb-8 md:mb-10 text-gray-200 font-light max-w-xl">Experience professional grade turfs with seamless digital booking.</p>
                    <button onClick={() => document.getElementById('turfs').scrollIntoView({ behavior: 'smooth' })} className={theme.btnPrimary}>Book a Session</button>
                </div>
            </div>

            <div id="turfs">
                <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
                    <h2 className="text-2xl md:text-3xl font-bold">Select Pitch</h2>
                    <button className="text-emerald-500 text-sm font-medium flex items-center">View map <ChevronRight className="h-4 w-4 ml-1" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {turfsList.map(turf => (
                        <div key={turf.id} onClick={() => addToCart(turf)} className={`${theme.card} ${theme.cardHover} group overflow-hidden relative flex flex-col`}>
                            {/* Image Container */}
                            <div className="h-56 relative w-full">
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent z-10 ${isDarkMode ? 'to-black/20' : 'to-transparent'}`}></div>
                                <img src={turf.image} alt={turf.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className={`absolute top-6 right-6 z-20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-white/20 border-white/10 text-white' : 'bg-white/90 border-white text-slate-900'}`}>{turf.type}</div>
                                {globalDiscount > 0 && (
                                    <div className="absolute top-6 left-6 z-20 bg-red-600 shadow-lg shadow-red-600/20 px-4 py-2 rounded-full text-xs font-bold text-white border border-red-400/20 flex items-center">
                                        <Tag className="h-3 w-3 mr-1" /> {globalDiscount}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Content Container */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>{turf.name}</h3>
                                    </div>
                                    <div className={`flex items-center text-sm mb-6 ${theme.textSub}`}><MapPin className="h-4 w-4 mr-1 text-emerald-500" /> {turf.location}</div>
                                </div>

                                {/* Price & Action Footer */}
                                <div className={`flex justify-between items-center border-t pt-6 ${theme.divider}`}>
                                    <div>
                                        <span className={`text-xs uppercase font-bold tracking-wider ${theme.textSub}`}>Rate</span>
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            {globalDiscount > 0 && (
                                                <span className="text-sm text-gray-400 line-through decoration-red-500 decoration-2 opacity-70">KES {turf.price.toLocaleString()}</span>
                                            )}
                                            <div className={`text-xl md:text-2xl font-bold ${theme.text}`}>
                                                KES {getDiscountedPrice(turf.price).toLocaleString()}
                                                <span className={`text-sm font-normal ${theme.textSub}`}>/ hr</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => addToCart(turf)} className={`${theme.btnPrimary} flex items-center pl-5 pr-4 py-2 text-sm`}>
                                        Book Now <ArrowRight className="h-4 w-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
