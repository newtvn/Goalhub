
import React, { useState, useEffect, Suspense } from 'react';
import {
  monitorConnection,
  subscribeToEvents,
  subscribeToTurfs,
  subscribeToExtras,
  subscribeToSettings,
  createTransaction,
  pollPaymentStatus
} from './firebase';
import { INITIAL_EVENTS } from './data/constants';
import bgImage from './assets/_ (51).jpeg';

// Context Providers
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';

// Pages - Lazy Loading
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SuccessPage = React.lazy(() => import('./pages/SuccessPage'));
const ProcessingPage = React.lazy(() => import('./pages/ProcessingPage'));

// Dashboard
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));

// Main App Component Logic
function GoalHubContent() {
  const { theme, isDarkMode } = useTheme();
  const { userRole, userProfile, authLoading } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState('landing');

  // Data State
  // Bookings, Users, Notifications, Transactions moved to AdminDashboard
  const [eventsList, setEventsList] = useState([]);
  const [turfsList, setTurfsList] = useState([]);
  const [extrasList, setExtrasList] = useState([]);
  const [settings, setSettings] = useState({});
  const [globalDiscount, setGlobalDiscount] = useState(0);

  // Booking Flow State
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [cartExtras, setCartExtras] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  // --- EFFECTS ---

  // Initial Load simulation
  useEffect(() => {
    // If auth is done, we can stop loading after a minimal delay
    if (!authLoading) {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [authLoading]);

  // Subscriptions - Optimized (Only global data)
  useEffect(() => {
    const unsubEvents = subscribeToEvents((data) => setEventsList(data.length > 0 ? data : INITIAL_EVENTS));
    const unsubTurfs = subscribeToTurfs(setTurfsList);
    const unsubExtras = subscribeToExtras(setExtrasList);
    const unsubSettings = subscribeToSettings((data) => {
      setSettings(data);
      if (data?.globalDiscount !== undefined) setGlobalDiscount(data.globalDiscount);
    });
    monitorConnection((status) => console.log("Connection:", status));

    return () => {
      unsubEvents();
      unsubTurfs();
      unsubExtras();
      unsubSettings();
    };
  }, []);

  // --- HANDLERS ---
  const navigateTo = React.useCallback((view) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  }, []);

  const showNotification = React.useCallback((message) => {
    // Simple Toast implementation
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 text-white px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-500 translate-y-10 opacity-0 z-[100] font-bold flex items-center gap-3 backdrop-blur-md ${isDarkMode ? 'bg-emerald-600/90' : 'bg-emerald-600'}`;
    notification.innerHTML = `<span>🔔</span> ${message}`;
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove
    setTimeout(() => {
      notification.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }, [isDarkMode]);

  // Cart Logic
  const addToCart = React.useCallback((turf) => {
    setSelectedTurf(turf);
    setCartExtras([]);
    setSelectedTime(null);
    navigateTo('booking');
  }, [navigateTo]);

  const toggleExtra = React.useCallback((extra) => {
    setCartExtras(prev => {
      if (prev.find(e => e.id === extra.id)) {
        return prev.filter(e => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  }, []);

  const calculateTotal = React.useCallback(() => {
    if (!selectedTurf) return 0;
    let basePrice = selectedTurf.price * duration;
    if (globalDiscount > 0) {
      basePrice = basePrice - (basePrice * (globalDiscount / 100));
    }
    const extrasTotal = cartExtras.reduce((sum, extra) => sum + extra.price, 0);
    return basePrice + extrasTotal;
  }, [selectedTurf, duration, globalDiscount, cartExtras]);

  const handleAddToCalendar = React.useCallback((event) => {
    showNotification(`By adding to calendar, you agree to receive reminders for ${event.title}`);
  }, [showNotification]);

  const handleNotifyMe = React.useCallback((event) => {
    showNotification(`Reminders set for ${event.title}`);
  }, [showNotification]);

  // Payment Logic
  const processPayment = async () => {
    if (!selectedTime || !selectedTurf) return;

    // Use logged in user details if available and form is empty
    const finalCustomer = {
      name: customerDetails.name || userProfile.name,
      phone: customerDetails.phone || userProfile.phone,
      email: customerDetails.email || userProfile.email,
      note: customerDetails.note
    };

    if (!finalCustomer.name || !finalCustomer.phone) {
      showNotification("Please provide Name and Phone number");
      return;
    }

    navigateTo('processing_payment');

    const totalAmount = calculateTotal();
    const transactionData = {
      amount: totalAmount,
      customerName: finalCustomer.name,
      customerPhone: finalCustomer.phone,
      turf: selectedTurf.name,
      date: bookingDate,
      time: selectedTime,
      duration: duration,
      extras: cartExtras.map(e => e.name),
      status: 'pending',
      method: 'M-Pesa',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Create Transaction Record
      const txnResult = await createTransaction(transactionData);
      if (!txnResult.success) throw new Error(txnResult.error);

      const transactionId = txnResult.id;

      // 2. Poll for status (Mocking the callback for now, or real polling)
      const success = await pollPaymentStatus(transactionId);

      if (success) {
        setConfirmedBooking({
          id: `BK-${Math.floor(Math.random() * 10000)}`, // In reality, createBooking returns this
          customer: finalCustomer.name,
          turf: selectedTurf.name
        });
        // We should ideally call createBooking here too if not handled by backend webhook
        navigateTo('success');
      } else {
        showNotification("Payment failed or timed out.");
        navigateTo('checkout');
      }
    } catch (e) {
      console.error(e);
      showNotification("Payment Error: " + e.message);
      navigateTo('checkout');
    }
  };

  // --- RENDER ---
  if (isLoading) return <Loader />;

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-emerald-500/30 ${theme.bgClasses}`}>
      <div
        className="fixed inset-0 z-0 opacity-100 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${bgImage}")` }}
      ></div>
      <div className={`fixed inset-0 z-0 bg-gradient-to-br ${theme.bgGradientFrom} ${theme.bgGradientVia} ${theme.bgGradientTo} pointer-events-none`}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentView={currentView} navigateTo={navigateTo} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
          <Suspense fallback={<Loader />}>
            {currentView === 'landing' && (
              <LandingPage
                turfsList={turfsList}
                addToCart={addToCart}
                globalDiscount={globalDiscount}
              />
            )}

            {currentView === 'events' && (
              <EventsPage
                eventsList={eventsList}
                navigateTo={navigateTo}
                handleAddToCalendar={handleAddToCalendar}
                handleNotifyMe={handleNotifyMe}
              />
            )}

            {currentView === 'booking' && (
              <BookingPage
                selectedTurf={selectedTurf}
                navigateTo={navigateTo}
                globalDiscount={globalDiscount}
                bookingDate={bookingDate}
                setBookingDate={setBookingDate}
                duration={duration}
                setDuration={setDuration}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                extrasList={extrasList}
                cartExtras={cartExtras}
                toggleExtra={toggleExtra}
                calculateTotal={calculateTotal}
              />
            )}

            {currentView === 'checkout' && (
              <CheckoutPage
                selectedTurf={selectedTurf}
                navigateTo={navigateTo}
                bookingDate={bookingDate}
                selectedTime={selectedTime}
                calculateTotal={calculateTotal}
                globalDiscount={globalDiscount}
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
                processPayment={processPayment}
              />
            )}

            {(currentView === 'processing_login' || currentView === 'processing_payment') && (
              <ProcessingPage currentView={currentView} navigateTo={navigateTo} />
            )}

            {currentView === 'login' && <LoginPage navigateTo={navigateTo} />}

            {currentView === 'success' && <SuccessPage confirmedBooking={confirmedBooking} navigateTo={navigateTo} />}

            {currentView === 'dashboard' && (
              <Dashboard
                eventsList={eventsList}
                turfsList={turfsList}
                extrasList={extrasList}
                globalDiscount={globalDiscount}
                showNotification={showNotification}
              />
            )}
          </Suspense>
        </main>

        <Footer navigateTo={navigateTo} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GoalHubContent />
      </AuthProvider>
    </ThemeProvider>
  );
}