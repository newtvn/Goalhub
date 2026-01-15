
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Loader() {
    const { isDarkMode } = useTheme();

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#02100B]' : 'bg-[#E3EED4]'}`}>
            <div className="text-center animate-fade-in">
                {/* Simulated Dotted Font using CSS radial gradients if needed, but for now using a clean bold font with opacity animation */}
                <h1 className={`text-6xl font-black tracking-[0.2em] mb-8 animate-pulse ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`} style={{ fontFamily: 'monospace' }}>
                    GOALHUB
                </h1>

                <div className="flex justify-center items-center gap-3">
                    <Loader2 className={`h-6 w-6 animate-spin ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`} />
                    <p className={`text-sm tracking-widest uppercase ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-800/60'}`}>
                        Loading Experience...
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
