
import React from 'react';
import { Smartphone, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ProcessingPage({ currentView, navigateTo }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
            <div className="relative mb-8">
                <div className={`h-20 w-20 rounded-full border-4 border-t-emerald-500 animate-spin ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}></div>
                {currentView === 'processing_payment' && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 animate-bounce">
                        <Smartphone className="h-5 w-5 text-black" />
                    </div>
                )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 animate-pulse">
                {currentView === 'processing_payment' ? 'Waiting for Payment...' : 'Authenticating...'}
            </h2>
            <p className={`text-base md:text-lg mb-6 ${theme.textSub} max-w-md`}>
                {currentView === 'processing_payment'
                    ? 'Please check your phone for the M-Pesa STK push prompt and enter your PIN to complete payment.'
                    : 'Verifying credentials...'}
            </p>

            {/* Manual Exit if Stuck */}
            <button
                onClick={() => navigateTo('login')}
                className={`mt-4 px-6 py-2 rounded-full text-sm font-medium border transition hover:bg-white/10 opacity-70 hover:opacity-100 ${isDarkMode ? 'border-white/20 text-white' : 'border-slate-300 text-slate-600'}`}
            >
                Cancel
            </button>
            {currentView === 'processing_payment' && (
                <div className={`${theme.card} p-6 max-w-md mt-4`}>
                    <div className="flex items-start text-left gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-full flex-shrink-0">
                            <Shield className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div className="text-sm">
                            <h4 className="font-bold mb-2">Payment Instructions:</h4>
                            <ol className={`list-decimal list-inside space-y-1 ${theme.textSub}`}>
                                <li>Check your phone for M-Pesa popup</li>
                                <li>Enter your M-Pesa PIN</li>
                                <li>Confirm the transaction</li>
                                <li>Wait for confirmation</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
