
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Loader() {
    const { isDarkMode } = useTheme();

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#02100B]' : 'bg-[#E3EED4]'}`}>
            <div className="text-center">
                <Loader2 className={`h-12 w-12 animate-spin mx-auto mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <p className={isDarkMode ? 'text-gray-400' : 'text-slate-500'}>Loading GOALHUB...</p>
            </div>
        </div>
    );
}
