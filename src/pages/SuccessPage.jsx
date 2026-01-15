
import React from 'react';
import { CheckCircle, QrCode } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SuccessPage({ confirmedBooking, navigateTo }) {
    const { theme } = useTheme();

    return (
        <div className={`${theme.card} max-w-md mx-auto overflow-hidden text-center`}>
            <div className="bg-emerald-500 p-10 text-black">
                <div className="h-20 w-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"><CheckCircle className="h-10 w-10 text-black" /></div>
                <h2 className="text-3xl font-bold">All Set!</h2>
                <p className="font-medium opacity-75 mt-2">Booking Confirmed</p>
            </div>
            <div className="p-10 space-y-8">
                <div><p className={`text-xs uppercase tracking-wider font-bold mb-2 ${theme.textSub}`}>Booking Ref</p><p className="text-3xl font-mono font-bold tracking-widest">{confirmedBooking?.id || "----"}</p></div>
                <div className="bg-white p-4 rounded-2xl inline-block shadow-inner"><QrCode className="h-32 w-32 text-black" /></div>
                <div className={`space-y-2 text-sm ${theme.textSub}`}><p>Show this QR code at the gate.</p><p>A copy has been sent to {confirmedBooking?.customer}</p></div>
                <button onClick={() => navigateTo('landing')} className={theme.btnSecondary + " w-full"}>Done</button>
            </div>
        </div>
    );
}
