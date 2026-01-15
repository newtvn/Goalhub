
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer({ navigateTo }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <footer className={`${theme.footer} mt-auto`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                <div className="col-span-1 md:col-span-2">
                    <h3 className={`text-2xl tracking-[0.15em] font-extrabold uppercase font-mono mb-4 ${theme.text}`}>GoalHub</h3>
                    <p className={`text-sm leading-relaxed max-w-sm mx-auto md:mx-0 ${theme.textSub}`}>
                        Kitengela's premier football destination. Professional grade turfs, seamless booking, and the heart of the local game.
                    </p>
                    <div className="flex space-x-4 mt-6 justify-center md:justify-start">
                        {/* Socials */}
                        <a href="#" className={`${theme.textSub} hover:text-emerald-500 transition`}><Facebook className="h-5 w-5" /></a>
                        <a href="#" className={`${theme.textSub} hover:text-emerald-500 transition`}><Twitter className="h-5 w-5" /></a>
                        <a href="#" className={`${theme.textSub} hover:text-emerald-500 transition`}><Instagram className="h-5 w-5" /></a>
                        <a href="#" className={`${theme.textSub} hover:text-emerald-500 transition`}><Linkedin className="h-5 w-5" /></a>
                    </div>
                </div>

                <div>
                    <h4 className={`font-bold mb-4 uppercase text-sm tracking-wider ${theme.text}`}>Quick Links</h4>
                    <ul className={`space-y-2 text-sm ${theme.textSub}`}>
                        <li><button onClick={() => navigateTo('landing')} className="hover:text-emerald-500 transition">Home</button></li>
                        <li><button onClick={() => navigateTo('events')} className="hover:text-emerald-500 transition">Leagues & Events</button></li>
                        <li><button onClick={() => navigateTo('login')} className="hover:text-emerald-500 transition">My Account</button></li>
                        <li><a href="#" className="hover:text-emerald-500 transition">Terms of Service</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className={`font-bold mb-4 uppercase text-sm tracking-wider ${theme.text}`}>Contact Us</h4>
                    <ul className={`space-y-3 text-sm ${theme.textSub} flex flex-col items-center md:items-start`}>
                        <li className="flex items-start justify-center md:justify-start"><MapPin className="h-4 w-4 mr-2 mt-1 text-emerald-500 flex-shrink-0" /> Namanga Road, Kitengela, Kenya</li>
                        <li className="flex items-center justify-center md:justify-start"><Phone className="h-4 w-4 mr-2 text-emerald-500" /> +254 700 000 000</li>
                        <li className="flex items-center justify-center md:justify-start"><Mail className="h-4 w-4 mr-2 text-emerald-500" /> bookings@goalhub.ke</li>
                    </ul>
                </div>
            </div>
            <div className={`max-w-7xl mx-auto px-4 mt-12 pt-8 border-t text-center text-xs ${isDarkMode ? 'border-white/5 text-gray-600' : 'border-slate-200 text-slate-400'}`}>
                &copy; 2025 GoalHub Kenya. All rights reserved.
            </div>
        </footer>
    );
}
