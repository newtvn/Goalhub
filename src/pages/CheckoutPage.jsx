
import React from 'react';
import { ChevronRight, Percent } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage({
    navigateTo,
    selectedTurf,
    bookingDate,
    selectedTime,
    calculateTotal,
    globalDiscount,
    customerDetails,
    setCustomerDetails,
    processPayment
}) {
    const { theme, isDarkMode } = useTheme();
    const { userRole, userProfile } = useAuth(); // We can get userRole and Profile from context directly

    return (
        <div className="max-w-xl mx-auto space-y-6 md:space-y-8">
            <button onClick={() => navigateTo('booking')} className={`flex items-center hover:text-emerald-500 mb-4 ${theme.textSub}`}><ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back</button>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Confirm & Pay</h2>
            <div className={theme.card + " p-6 md:p-8 space-y-6"}>
                <div className={`flex justify-between items-center border-b pb-6 ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                    <div><div className="text-xl md:text-2xl font-bold">{selectedTurf.name}</div><div className="text-emerald-500">{bookingDate} @ {selectedTime}</div></div>
                    <div className="text-right"><div className="text-2xl md:text-3xl font-bold">KES {calculateTotal().toLocaleString()}</div><div className={`text-sm ${theme.textSub}`}>Total Due</div></div>
                </div>
                {globalDiscount > 0 && (
                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex justify-between items-center">
                        <div className="flex items-center text-emerald-600 text-sm font-bold"><Percent className="h-4 w-4 mr-2" /> Discount Applied</div>
                        <div className="text-emerald-600 font-bold">{globalDiscount}% OFF</div>
                    </div>
                )}
                <div className="space-y-4">
                    {(userRole === 'user' || userRole === 'admin' || userRole === 'manager') ? (
                        <div className={`p-4 rounded-2xl flex flex-col gap-3 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <div className="flex items-center">
                                <img src={userProfile.avatar} className="h-10 w-10 rounded-full mr-4" alt="User" />
                                <div><div className="font-bold">Booking for {userProfile.name}</div><div className={`text-xs ${theme.textSub}`}>{userProfile.email}</div></div>
                            </div>
                            <div className={`border-t pt-3 mt-1 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                <label className={`block text-xs font-bold mb-2 ml-1 ${theme.textSub}`}>M-Pesa Number for Payment</label>
                                <input
                                    type="tel"
                                    placeholder="07..."
                                    className={theme.input + " py-2"}
                                    value={customerDetails.phone || userProfile.phone || ''}
                                    onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <input type="text" placeholder="Full Name" className={theme.input} value={customerDetails.name} onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })} />
                            <input type="tel" placeholder="M-Pesa Phone" className={theme.input} value={customerDetails.phone} onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })} />
                            <input type="email" placeholder="Email" className={theme.input} value={customerDetails.email} onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })} />
                        </>
                    )}
                    <textarea placeholder="Notes..." className={theme.input + " h-24"} value={customerDetails.note} onChange={e => setCustomerDetails({ ...customerDetails, note: e.target.value })}></textarea>
                </div>
                <button onClick={processPayment} className={`${theme.btnPrimary} w-full text-lg py-4 mt-4 disabled:opacity-50 disabled:shadow-none`}>Pay with M-Pesa</button>
                <p className={`text-center text-xs ${theme.textSub}`}>Secured by Safaricom Daraja API</p>
            </div>
        </div>
    );
}
