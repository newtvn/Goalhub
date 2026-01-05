import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, MapPin, CreditCard, Users, CheckCircle,
  Menu, X, Phone, Mail, Shield, DollarSign, BarChart,
  Settings, LogOut, QrCode, Loader2, Search, Plus, FileText,
  User, Lock, ChevronRight, Bell, Trash2, Edit2, Save, ChevronLeft, EyeOff,
  CalendarPlus, Image as ImageIcon, Camera, Facebook, Instagram, Twitter, Linkedin,
  Globe, ExternalLink, Tag, Percent, FileDown, Download, MoreVertical,
  Sun, Moon, ArrowRight, Smartphone
} from 'lucide-react';
import { signInWithGoogle, signOutUser, loginUser, registerUser, onAuthStateChangedListener } from './firebase';

/**
 * GOALHUB - Football Turf Booking Platform
 * THEMES: Premium Web-Gradient Dark & Spider-Web Light
 */

// --- THEME DEFINITIONS ---

const DARK_THEME = {
  // Very dark green/black (#02100B) gradient with subtle pattern
  bgClasses: "bg-[#02100B] bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.02\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]",
  bgGradientFrom: "from-[#02100B]/98 via-[#041812]/85",
  bgGradientVia: "via-[#02100B]",
  bgGradientTo: "to-[#000000]",

  text: "text-white",
  textSub: "text-gray-400",
  textAccent: "text-emerald-400",
  card: "bg-[#0a1410]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl",
  cardHover: "hover:bg-[#0f1f18]/80 transition-all duration-300 cursor-pointer border-white/20",
  btnPrimary: "bg-emerald-500 text-black font-medium py-3 px-6 rounded-full hover:bg-emerald-400 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  btnSecondary: "bg-white/10 text-white font-medium py-3 px-6 rounded-full hover:bg-white/20 backdrop-blur-md transition-all duration-200",
  btnGhost: "bg-transparent text-gray-400 hover:text-white transition-all",
  input: "w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all",
  navPill: "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10 text-gray-400 hover:text-white",
  navPillActive: "bg-white/15 text-white shadow-inner border border-white/5",
  iconBtn: "p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all",
  glassNav: "relative z-50 mx-4 md:mx-auto max-w-7xl bg-transparent backdrop-blur-md border border-transparent rounded-full px-8 py-4 mt-6 mb-8",
  footer: "border-t border-white/5 mt-12 bg-black/60 backdrop-blur-lg py-12",
  tableHeader: "text-gray-500 font-medium border-b border-white/5",
  tableRow: "hover:bg-white/5 transition divide-y divide-white/5",
  divider: "border-white/10"
};

const LIGHT_THEME = {
  // Soft beige/cream (#E3EED4) gradient with subtle pattern
  bgClasses: "bg-[#E3EED4] bg-[url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\\' fill=\\'%2394a3b8\\' fill-opacity=\\'0.05\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]",
  bgGradientFrom: "from-[#E3EED4]/95 via-[#d4e5c0]/80",
  bgGradientVia: "via-[#E3EED4]",
  bgGradientTo: "to-[#c9dbb5]",

  text: "text-slate-900",
  textSub: "text-slate-500",
  textAccent: "text-emerald-600",
  card: "bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
  cardHover: "hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1 hover:bg-white/90 transition-all duration-300 cursor-pointer",
  btnPrimary: "bg-emerald-600 text-white font-medium py-3 px-6 rounded-full hover:bg-emerald-700 active:scale-95 transition-all duration-200 shadow-lg shadow-emerald-600/20",
  btnSecondary: "bg-white/80 text-slate-700 font-medium py-3 px-6 rounded-full hover:bg-white border border-slate-200 transition-all duration-200 shadow-sm",
  btnGhost: "bg-transparent text-slate-400 hover:text-slate-900 transition-all",
  input: "w-full bg-white/50 border border-slate-200 rounded-2xl p-4 outline-none text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner",
  navPill: "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-slate-200/50 text-slate-500 hover:text-slate-900",
  navPillActive: "bg-white text-slate-900 shadow-sm border border-slate-100",
  iconBtn: "p-3 rounded-full bg-white/60 border border-white/50 hover:bg-white text-slate-600 transition-all shadow-sm",
  glassNav: "relative z-50 mx-4 md:mx-auto max-w-7xl bg-transparent backdrop-blur-md border border-transparent rounded-full px-8 py-4 mt-6 mb-8",
  footer: "border-t border-slate-200 mt-12 bg-white/60 backdrop-blur-lg py-12",
  tableHeader: "text-slate-400 font-medium border-b border-slate-100",
  tableRow: "hover:bg-slate-50/50 transition divide-y divide-slate-100",
  divider: "border-slate-100"
};

// --- MOCK DATA ---

const TURFS = [
  { id: 1, name: 'Allianz Arena', location: 'Kitengela, Namanga Rd', type: '5-a-side', price: 2500, image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Camp Nou', location: 'Kitengela, CBD', type: '7-a-side', price: 3500, image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800' }
];

const EXTRAS = [
  { id: 'ball', name: 'Pro Match Ball', sub: 'Size 5', price: 150, icon: <CheckCircle className="h-5 w-5" /> },
  { id: 'water', name: 'Water Case', sub: '24 Bottles', price: 800, icon: <CheckCircle className="h-5 w-5" /> }
];



const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00"
];

// --- COMPONENT: MAIN APP ---

export default function GoalHubApp() {
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const [currentView, setCurrentView] = useState('landing');
  const [userRole, setUserRole] = useState('guest'); // guest, user, manager, admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // User/Admin/Manager Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Alex K.',
    email: 'alex@example.com',
    phone: '0712345678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Turfs State - Fetch from API
  const [turfs, setTurfs] = useState([]);
  const [isLoadingTurfs, setIsLoadingTurfs] = useState(true);

  // Events State
  const [eventsList, setEventsList] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  // Booking State
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [cartExtras, setCartExtras] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Admin/Manager Data
  const [dashboardTab, setDashboardTab] = useState('calendar');
  const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split('T')[0]);
  const [pendingAdminNotifications, setPendingAdminNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Global Discount State
  const [globalDiscount, setGlobalDiscount] = useState(0);

  // Notifications
  const [notification, setNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ revenue: 0, bookings: 0, users: 0, recent_activity: [] });
  const [chartData, setChartData] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Users Data
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Bookings Data - Fetch from API for admin/manager
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Reports
  const REPORTS = [
    { id: 1, title: "Daily Sales Report", type: "Financial", date: "Nov 20, 2025" },
    { id: 2, title: "Weekly Occupancy Analysis", type: "Operational", date: "Nov 14 - Nov 20" },
    { id: 3, title: "Monthly Revenue Summary", type: "Financial", date: "October 2025" },
    { id: 4, title: "Customer Manifest", type: "User Data", date: "All Time" },
  ];

  // --- HELPERS ---

  const navigateTo = (view) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const getDiscountedPrice = (price) => {
    if (!globalDiscount || globalDiscount <= 0) return price;
    return price - (price * (globalDiscount / 100));
  };

  const calculateTotal = () => {
    if (!selectedTurf) return 0;
    const basePrice = getDiscountedPrice(selectedTurf.price);
    return (basePrice * duration) + cartExtras.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateFinancials = (period) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const getWeekStart = () => {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    const getMonthStart = () => {
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    };

    let filteredBookings = [];

    if (period === 'day') {
      filteredBookings = bookings.filter(b => b.date === today && b.status === 'Confirmed');
    } else if (period === 'week') {
      const weekStart = getWeekStart();
      filteredBookings = bookings.filter(b => b.date >= weekStart && b.status === 'Confirmed');
    } else if (period === 'month') {
      const monthStart = getMonthStart();
      filteredBookings = bookings.filter(b => b.date >= monthStart && b.status === 'Confirmed');
    }

    return filteredBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
  };

  const handleDownloadPdf = (reportTitle) => {
    showNotification(`Downloading ${reportTitle}.pdf...`);
  };

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/[\s\-+]/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.startsWith('254')) return cleaned;
    return cleaned;
  };

  // --- EFFECTS ---

  useEffect(() => {
    if ((userRole === 'admin' || userRole === 'manager') && pendingAdminNotifications.length > 0) {
      const msg = pendingAdminNotifications[pendingAdminNotifications.length - 1];
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        showNotification(`🔔 Alert: ${msg}`);
        setPendingAdminNotifications([]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userRole, pendingAdminNotifications]);

  // Fetch turfs from backend on mount
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setIsLoadingTurfs(true);
        const response = await fetch('http://localhost:8000/api/turfs/');
        if (response.ok) {
          const data = await response.json();
          setTurfs(data);
        } else {
          console.error('Failed to fetch turfs:', response.status);
          showNotification('❌ Failed to load turfs from server');
        }
      } catch (error) {
        console.error('Error fetching turfs:', error);
        showNotification('❌ Cannot connect to backend server');
      } finally {
        setIsLoadingTurfs(false);
      }
    };

    fetchTurfs();
  }, []);

  // Fetch bookings from backend for admin/manager
  useEffect(() => {
    const fetchBookings = async () => {
      if (userRole !== 'admin' && userRole !== 'manager') {
        return;
      }

      const token = userProfile.token;
      if (!token) return;

      try {
        setIsLoadingBookings(true);
        const response = await fetch('http://localhost:8000/api/bookings/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings:', response.status);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    if (dashboardTab === 'bookings' || dashboardTab === 'calendar') {
      fetchBookings();
    }
  }, [userRole, dashboardTab, userProfile.token]);

  // Fetch Events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await fetch('http://localhost:8000/api/events/');
        if (response.ok) {
          const data = await response.json();
          setEventsList(data);
        } else {
          console.error('Failed to fetch events:', response.status);
          // Fallback to empty if failed, or handle error
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch Users (Admin only)
  useEffect(() => {
    if (userRole === 'admin') {
      const fetchUsers = async () => {
        try {
          setIsLoadingUsers(true);
          const response = await fetch('http://localhost:8000/api/users/');
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [userRole]);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userRole === 'guest') return;

      try {
        setIsLoadingNotifications(true);
        const response = await fetch('http://localhost:8000/api/notifications/');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };
    fetchNotifications();

    if (userRole === 'admin' || userRole === 'manager') {
      const fetchStats = async () => {
        try {
          // Retrieve token for current user
          const token = userProfile.token;
          if (!token) return;

          const response = await fetch('http://localhost:8000/api/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setDashboardStats(data);
          }

          // Fetch Chart Data
          const chartResponse = await fetch('http://localhost:8000/api/dashboard/chart-data', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (chartResponse.ok) {
            const chartData = await chartResponse.json();
            setChartData(chartData);
          }
        } catch (e) { console.error("Stats fetch error", e); }
      };
      fetchStats();
    }
  }, [userRole]);

  // --- AUTHENTICATION ---

  // Auth Persistence Listener
  useEffect(() => {
    // Navigate only if we are on login page, otherwise stay where we are (or go dashboard if on landing)
    // Actually, mainly we just want to restore state.

    const unsubscribe = onAuthStateChangedListener(async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Auth State Restored:", firebaseUser.email);
        const token = await firebaseUser.getIdToken();
        await syncUserWithBackend(firebaseUser, token);
        // If we were on login page, move to dashboard. If on landing, stay or move?
        // Let's safe bet: navigate to dashboard if on login/landing.
        if (currentView === 'login' || currentView === 'landing') {
          navigateTo('dashboard');
        }
      } else {
        console.log("No Auth User found.");
        // Optional: clear user state if needed
        // setUserRole('guest');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (firebaseUser, token) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserRole(userData.role || 'user');
        setUserProfile({
          name: userData.name || firebaseUser.displayName || 'User',
          email: userData.email || firebaseUser.email,
          phone: userData.phone || userProfile.phone,
          avatar: userData.avatar || firebaseUser.photoURL || userProfile.avatar,
          token: token,
          id: userData.id
        });
        showNotification(`✅ Welcome back, ${userData.name || firebaseUser.displayName || 'User'}!`);
        setTimeout(() => navigateTo('dashboard'), 1500);
      } else {
        console.error("Backend sync failed:", await response.text());
        // Fallback or retry? For now let them in with limited profile
        setUserRole('user');
        setUserProfile({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          token: token,
          ...userProfile
        });
        showNotification('⚠️ Logged in, but profile sync failed.');
        setTimeout(() => navigateTo('dashboard'), 1500);
      }
    } catch (error) {
      console.error("Sync error:", error);
      showNotification('⚠️ Backend not reachable.');
      setUserProfile({ ...userProfile, token }); // At least save token
      setUserRole('user');
      setTimeout(() => navigateTo('dashboard'), 1500);
    }
  };

  const handleLoginSubmit = async () => {
    navigateTo('processing_login');

    let result;
    if (isSignUp) {
      result = await registerUser(username, password);
    } else {
      result = await loginUser(username, password);
    }

    if (result.success) {
      await syncUserWithBackend(result.user, result.user.token);
    } else {
      showNotification(`❌ ${isSignUp ? 'Signup' : 'Login'} failed: ${result.error}`);
      setTimeout(() => navigateTo('login'), 2000);
    }
  };

  const handleGoogleSignIn = async () => {
    navigateTo('processing_login');
    const result = await signInWithGoogle();

    if (result.success) {
      await syncUserWithBackend(result.user, result.user.token);
    } else {
      showNotification('❌ Google Sign-In failed. Please try again.');
      setTimeout(() => navigateTo('login'), 2000);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUserRole('guest');
    setUsername('');
    setPassword('');
    setIsProfileDropdownOpen(false);
    navigateTo('landing');
  };

  // --- BOOKING HANDLERS ---
  const addToCart = (turf) => { setSelectedTurf(turf); navigateTo('booking'); };

  const toggleExtra = (extra) => {
    if (cartExtras.find(e => e.id === extra.id)) {
      setCartExtras(cartExtras.filter(e => e.id !== extra.id));
    } else {
      setCartExtras([...cartExtras, extra]);
    }
  };

  // --- M-PESA PAYMENT INTEGRATION ---
  // --- M-PESA PAYMENT INTEGRATION (MOCKED) ---
  const processPayment = async () => {
    navigateTo('processing_payment');

    const custName = userRole === 'user' ? userProfile.name : customerDetails.name;

    // Simulate API delay
    setTimeout(() => {
      showNotification("✅ Payment successful! (Mocked)");
      completeBooking(custName);
    }, 3000);
  };

  // Poll payment status until completed or timeout
  const pollPaymentStatus = async (requestId, custName, attempts = 0) => {
    const maxAttempts = 30; // Poll for up to 60 seconds (30 attempts × 2s interval)

    if (attempts >= maxAttempts) {
      showNotification("⏱️ Payment timeout. Please verify your M-Pesa messages.");
      setTimeout(() => navigateTo('checkout'), 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/payment-status/${requestId}`);

      if (response.ok) {
        const data = await response.json();

        if (data.status === 'completed') {
          // Payment confirmed! Show success page with QR code
          showNotification("✅ Payment successful!");
          completeBooking(custName);
        } else if (data.status === 'failed') {
          // Payment failed
          showNotification("❌ Payment was cancelled or failed. Please try again.");
          setTimeout(() => navigateTo('checkout'), 3000);
        } else {
          // Still pending, poll again after 2 seconds
          setTimeout(() => pollPaymentStatus(requestId, custName, attempts + 1), 2000);
        }
      } else {
        // Status check failed, retry
        setTimeout(() => pollPaymentStatus(requestId, custName, attempts + 1), 2000);
      }
    } catch {
      // Network error during status check, retry
      setTimeout(() => pollPaymentStatus(requestId, custName, attempts + 1), 2000);
    }
  };

  const completeBooking = async (custName) => {
    const bookingData = {
      turf_id: selectedTurf.id, // Ensure this maps to UUID if backend expects UUID, or handle mapping
      date: bookingDate,
      time_slot: selectedTime,
      duration: duration,
      amount: calculateTotal(),
      customer_name: custName,
      customer_phone: customerDetails.phone || userProfile.phone,
      customer_email: customerDetails.email || userProfile.email,
      extras: cartExtras
    };

    try {
      const response = await fetch('http://localhost:8000/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userProfile.token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const newBooking = await response.json();
        // Update local state with the returned booking from backend
        setBookings([newBooking, ...bookings]);
        setConfirmedBooking(newBooking);
        setPendingAdminNotifications(prev => [...prev, `New Booking Confirmed! ${custName} @ ${selectedTurf.name}`]);
        navigateTo('success');
      } else {
        console.error("Booking failed:", await response.text());
        showNotification("⚠️ Booking processed, but failed to save to server.");
        // Fallback to local state just to show success screen
        setConfirmedBooking({ ...bookingData, id: 'LOCAL-ERR', turf: selectedTurf.name });
        navigateTo('success');
      }
    } catch (error) {
      console.error("Booking network error:", error);
      showNotification("⚠️ Network error saving booking.");
      setConfirmedBooking({ ...bookingData, id: 'NET-ERR', turf: selectedTurf.name });
      navigateTo('success');
    }
  };

  // --- OTHER HANDLERS ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!userProfile.id) {
      showNotification("❌ Error: User ID missing. Please reload.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userProfile.token}`
        },
        body: JSON.stringify({
          name: userProfile.name,
          phone: userProfile.phone,
          email: userProfile.email
        })
      });

      if (response.ok) {
        showNotification("✅ Profile updated successfully");
        setIsEditingProfile(false);
      } else {
        const err = await response.json();
        showNotification(`❌ Update failed: ${err.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      showNotification("❌ Network error updating profile");
    }
  };

  const handleAddToCalendar = (event) => {
    showNotification(`Added "${event.title}" to your calendar.`);
  };

  const handleNotifyMe = (event) => {
    showNotification(`Reminders enabled for "${event.title}".`);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (editingEvent.id === 'new') {
      const newEvent = { ...editingEvent, id: Date.now(), image: editingEvent.image || 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=400' };
      setEventsList([...eventsList, newEvent]);
      showNotification("New event created successfully.");
    } else {
      setEventsList(eventsList.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
      showNotification("Event details updated.");
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEventsList(eventsList.filter(ev => ev.id !== id));
      showNotification("Event deleted.");
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (editingUser.id) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    } else {
      setUsers([...users, { ...editingUser, id: Date.now() }]);
    }
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  /* --- UPDATED HANDLERS FOR BACKEND --- */
  const handleSaveBooking = async (e) => {
    e.preventDefault();
    if (!editingBooking.id) return;

    // Optimistic Update
    const updated = { ...editingBooking };
    setBookings(bookings.map(b => b.id === updated.id ? updated : b));
    setEditingBooking(null); // Close immediately

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userProfile.token}`
        },
        body: JSON.stringify({
          status: updated.status,
          date: updated.date,
          time_slot: updated.time_slot,
          turf_id: updated.turf_id
        })
      });

      if (response.ok) {
        showNotification("✅ Booking updated successfully");
      } else {
        console.error("Update failed", await response.text());
        showNotification("⚠️ Failed to save changes to server");
        // Revert or fetch fresh could go here
      }
    } catch (e) {
      console.error(e);
      showNotification("❌ Network error saving booking");
    }
  };

  const handleSlotClick = (turfName, time) => {
    const existing = bookings.find(b => b.date === calendarDate && b.turf === turfName && b.time === time);
    if (existing) {
      setEditingBooking(existing);
    } else {
      setEditingBooking({
        id: 'new',
        turf: turfName,
        date: calendarDate,
        time: time,
        duration: 1,
        customer: 'Walk-in Guest',
        amount: 0,
        payment: 'Pending',
        status: 'Pending'
      });
    }
  };

  // --- RENDERERS ---

  if (isAuthLoading) {
    return (
      <div className={`min-h-screen font-sans ${theme.text} bg-black flex items-center justify-center`}>
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${theme.text} selection:bg-emerald-500/30 selection:text-emerald-600 antialiased flex flex-col transition-colors duration-300 relative overflow-x-hidden`}>

      {/* FOREST BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <img
          src="/src/assets/_ (51).jpeg"
          alt="Forest background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ANIMATED GRADIENT OVERLAY */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-[1] ${isDarkMode ? 'opacity-20' : 'opacity-10'}`}>
        <div className={`absolute top-0 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-emerald-400/15' : 'bg-emerald-200/20'}`}></div>
        <div className={`absolute bottom-0 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-green-500/12' : 'bg-lime-200/18'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-teal-400/10' : 'bg-green-100/25'}`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10">

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="fixed top-20 right-4 z-[100] animate-fade-in-down w-11/12 md:w-auto">
            <div className="bg-emerald-500 text-black px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center border border-emerald-400">
              <Bell className="h-5 w-5 mr-3 animate-bounce flex-shrink-0" />
              <span className="truncate">{notification}</span>
            </div>
          </div>
        )}

        {/* NAVBAR (Static) */}
        <nav className={theme.glassNav}>
          <div className="flex justify-between items-center gap-4">
            {/* LEFT: LOGO */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('landing')}>
              <span className={`text-2xl tracking-[0.15em] font-extrabold uppercase font-mono transition-colors duration-300 ${isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'}`}>
                GoalHub
              </span>
            </div>

            {/* CENTER: DESKTOP NAV */}
            <div className={`hidden md:flex items-center rounded-full p-1.5 gap-2 backdrop-blur-md border transition-all ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
              <button onClick={() => navigateTo('landing')} className={`${theme.navPill} ${currentView === 'landing' ? theme.navPillActive : ''}`}>Home</button>
              <button onClick={() => navigateTo('events')} className={`${theme.navPill} ${currentView === 'events' ? theme.navPillActive : ''}`}>Events</button>
              {userRole !== 'guest' && (
                <button onClick={() => navigateTo('dashboard')} className={`${theme.navPill} ${currentView === 'dashboard' ? theme.navPillActive : ''}`}>Dashboard</button>
              )}
            </div>

            {/* RIGHT: PROFILE / LOGIN / MOBILE MENU BTN */}
            <div className="flex items-center gap-5">

              {/* THEME TOGGLE */}
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={theme.iconBtn}>
                {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
              </button>

              <div className="hidden md:flex items-center gap-4">
                {userRole === 'guest' ? (
                  <button onClick={() => navigateTo('login')} className="text-sm font-medium hover:text-emerald-500 transition px-4">Log In</button>
                ) : (
                  <div className="flex items-center gap-4 relative">
                    {/* PROFILE DROPDOWN TRIGGER */}
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className={`flex items-center gap-3 pr-1 pl-4 py-1 rounded-full transition border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
                    >
                      <span className="text-xs font-bold hidden sm:block mr-2">{userProfile.name}</span>
                      <img src={userProfile.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-emerald-500/50" />
                    </button>

                    {/* DROPDOWN MENU */}
                    {isProfileDropdownOpen && (
                      <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-[#0a1410] border-white/10' : 'bg-white border-slate-200'}`}>
                        <button
                          onClick={() => {
                            navigateTo('dashboard');
                            setDashboardTab('profile');
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center transition ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <User className="h-4 w-4 mr-2" /> View Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center transition text-red-500 ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="md:hidden flex items-center">
                {userRole !== 'guest' && (
                  <img onClick={() => navigateTo('dashboard')} src={userProfile.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-emerald-500/50 mr-3 cursor-pointer" />
                )}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className={`absolute top-full left-0 w-full mt-4 border rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col space-y-2 md:hidden animate-in fade-in slide-in-from-top-5 z-50 ${isDarkMode ? 'bg-[#0a1410] border-white/10' : 'bg-white border-slate-200'}`}>
              <button onClick={() => navigateTo('landing')} className={`p-3 text-left rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Home</button>
              <button onClick={() => navigateTo('events')} className={`p-3 text-left rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Events</button>
              {userRole !== 'guest' && (
                <button onClick={() => navigateTo('dashboard')} className={`p-3 text-left rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Dashboard</button>
              )}
              {userRole === 'guest' ? (
                <button onClick={() => navigateTo('login')} className={`p-3 text-left text-emerald-500 rounded-xl font-bold ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Log In</button>
              ) : (
                <button onClick={handleLogout} className={`p-3 text-left text-red-500 rounded-xl font-medium ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>Log Out</button>
              )}
            </div>
          )}
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">

          {/* --- VIEW: LANDING --- */}
          {currentView === 'landing' && (
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
                  {isLoadingTurfs ? (
                    <div className="col-span-2 text-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-500 mb-4" />
                      <p className={theme.textSub}>Loading turfs...</p>
                    </div>
                  ) : turfs.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <p className={theme.textSub}>No turfs available at the moment.</p>
                    </div>
                  ) : (
                    turfs.map(turf => (
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
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: EVENTS --- */}
          {currentView === 'events' && (
            <div className="space-y-10 min-h-[60vh]">
              <div className="flex items-center space-x-4 mb-8">
                <button onClick={() => navigateTo('landing')} className={theme.iconBtn}><X className="h-5 w-5" /></button>
                <h2 className="text-2xl md:text-3xl font-bold">Leagues & Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {eventsList.map(event => (
                  <div key={event.id} className={`${theme.card} flex flex-col md:flex-row overflow-hidden`}>
                    <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2">
                      <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-2">Upcoming</span>
                      <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                      <div className={`flex items-center mb-6 text-sm font-medium ${theme.textSub}`}><CalendarIcon className="h-4 w-4 mr-2 text-emerald-500" /> {event.date} @ {event.time}</div>
                      <div className="flex space-x-3 mt-auto">
                        <button onClick={() => handleAddToCalendar(event)} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
                          <CalendarPlus className="h-4 w-4 mr-1" /> Calendar
                        </button>
                        <button onClick={() => handleNotifyMe(event)} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
                          <Bell className="h-4 w-4 mr-1" /> Notify
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- VIEW: BOOKING CONFIG --- */}
          {currentView === 'booking' && selectedTurf && (
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
                        {EXTRAS.map(extra => (
                          <div key={extra.id} onClick={() => toggleExtra(extra)} className={`flex items-center p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${cartExtras.find(e => e.id === extra.id) ? "bg-emerald-500/10 border-emerald-500/50" : isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-slate-200 hover:border-emerald-400"}`}>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 transition-colors ${cartExtras.find(e => e.id === extra.id) ? 'bg-emerald-500 text-black' : isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>{extra.icon}</div>
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
          )}

          {/* --- VIEW: CHECKOUT --- */}
          {currentView === 'checkout' && (
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
          )}

          {/* --- VIEW: PROCESSING --- */}
          {(currentView === 'processing_login' || currentView === 'processing_payment') && (
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
          )}

          {/* --- VIEW: DASHBOARD --- */}
          {currentView === 'dashboard' && (
            <>
              {userRole === 'user' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className={`${theme.card} p-6 md:p-8 flex flex-col items-center md:w-1/3 relative overflow-hidden`}>
                      <div className="relative">
                        <img src={userProfile.avatar} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-emerald-500/20 mb-4" />
                        <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="absolute bottom-4 right-0 bg-emerald-500 p-2 rounded-full text-black hover:scale-110 transition"><Edit2 className="h-4 w-4" /></button>
                      </div>
                      <h2 className="text-2xl font-bold text-center">{userProfile.name}</h2>
                      <p className={`${theme.textSub} mb-6 text-center`}>{userProfile.email}</p>
                      <div className={`w-full rounded-xl p-4 text-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <div className={`text-xs uppercase font-bold ${theme.textSub}`}>Total Bookings</div>
                        <div className="text-2xl font-bold text-emerald-500">
                          {bookings.filter(b => b.customer === userProfile.name).length}
                        </div>
                      </div>
                    </div>
                    <div className={`${theme.card} p-6 md:p-8 flex-1`}>
                      {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={userProfile.name} onChange={e => setUserProfile({ ...userProfile, name: e.target.value })} className={theme.input} placeholder="Full Name" />
                            <input value={userProfile.phone} onChange={e => setUserProfile({ ...userProfile, phone: e.target.value })} className={theme.input} placeholder="Phone" />
                          </div>
                          <input value={userProfile.email} onChange={e => setUserProfile({ ...userProfile, email: e.target.value })} className={theme.input} placeholder="Email" />
                          <div className="flex justify-end space-x-3 pt-2">
                            <button type="button" onClick={() => setIsEditingProfile(false)} className="text-gray-400 px-4">Cancel</button>
                            <button type="submit" className={theme.btnPrimary}>Save Changes</button>
                          </div>
                        </form>
                      ) : (
                        <div className="h-full flex flex-col">
                          <h3 className="font-bold text-xl mb-6">Your Bookings</h3>
                          <div className="overflow-y-auto max-h-80 space-y-3 pr-2 custom-scrollbar">
                            {bookings.filter(b => b.customer === userProfile.name).sort((a, b) => new Date(b.date) - new Date(a.date)).map(booking => {
                              const isPast = new Date(booking.date) < new Date();
                              return (
                                <div key={booking.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center ${isPast ? (isDarkMode ? 'bg-white/5 border-white/5 opacity-60' : 'bg-slate-50 border-slate-100 opacity-60') : (isDarkMode ? 'bg-[#0f1f18] border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')}`}>
                                  <div className="mb-2 md:mb-0">
                                    <div className="font-bold text-lg">{booking.turf}</div>
                                    <div className={`text-sm ${theme.textSub}`}>{booking.date} @ {booking.time}</div>
                                  </div>
                                  <div className="text-left md:text-right w-full md:w-auto">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${isPast ? 'bg-gray-500/20 text-gray-400' : 'bg-emerald-500/20 text-emerald-600'}`}>
                                      {isPast ? 'Completed' : 'Upcoming'}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {userRole !== 'user' && (
                <div className="space-y-8 md:space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-1">{userRole === 'admin' ? 'Headquarters' : 'Operations'}</h2>
                      <p className={theme.textSub}>Welcome back, {userProfile.name}.</p>
                    </div>
                    <div className={`flex flex-wrap gap-2 p-1 rounded-xl md:rounded-full border w-full md:w-auto justify-start ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                      <button onClick={() => setDashboardTab('calendar')} className={`${theme.navPill} flex-1 md:flex-none text-center ${dashboardTab === 'calendar' ? theme.navPillActive : ''}`}>Calendar</button>
                      <button onClick={() => setDashboardTab('bookings')} className={`${theme.navPill} flex-1 md:flex-none text-center ${dashboardTab === 'bookings' ? theme.navPillActive : ''}`}>Bookings</button>
                      <button onClick={() => setDashboardTab('events_mgmt')} className={`${theme.navPill} flex-1 md:flex-none text-center ${dashboardTab === 'events_mgmt' ? theme.navPillActive : ''}`}>Events</button>
                      <button onClick={() => setDashboardTab('reports')} className={`${theme.navPill} flex-1 md:flex-none text-center ${dashboardTab === 'reports' ? theme.navPillActive : ''}`}>Reports</button>
                      {userRole === 'admin' && <button onClick={() => setDashboardTab('users')} className={`${theme.navPill} flex-1 md:flex-none text-center ${dashboardTab === 'users' ? theme.navPillActive : ''}`}>Users</button>}
                      <button onClick={() => setDashboardTab('notifications')} className={`${theme.navPill} flex-1 md:flex-none text-center relative ${dashboardTab === 'notifications' ? theme.navPillActive : ''}`}>
                        Notifications
                        {notifications.filter(n => !n.read).length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{notifications.filter(n => !n.read).length}</span>
                        )}
                      </button>
                      <button onClick={() => setDashboardTab('profile')} className={`${theme.navPill} flex-1 md:flex-none text-center ${dashboardTab === 'profile' ? theme.navPillActive : ''}`}>Profile</button>
                    </div>
                  </div>

                  {userRole === 'admin' && dashboardTab !== 'profile' && dashboardTab !== 'users' && dashboardTab !== 'reports' && dashboardTab !== 'notifications' && (
                    <div className={`${theme.card} overflow-hidden`}>
                      {/* Header Section */}
                      <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20' : 'bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50'}`}>
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg">
                            <Tag className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              Global Promotion & Discount
                            </h3>
                            <p className={`text-sm ${theme.textSub}`}>
                              Apply a percentage discount across all turf bookings instantly.
                            </p>
                          </div>
                          {globalDiscount > 0 ? (
                            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse shadow-lg">
                              <span className="h-2 w-2 bg-white rounded-full animate-ping"></span>
                              ACTIVE
                            </div>
                          ) : (
                            <div className={`px-4 py-2 rounded-full font-bold text-sm ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-slate-200 text-slate-500'}`}>
                              INACTIVE
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Discount Input Card */}
                          <div className={`p-6 rounded-3xl border-2 ${globalDiscount > 0 ? 'border-emerald-500 bg-emerald-500/5' : (isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}`}>
                            <label className={`text-xs uppercase font-bold mb-3 block tracking-wider ${theme.textSub}`}>
                              Discount Percentage (%)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={globalDiscount || ''}
                                onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                                placeholder="0"
                                className={`${theme.input} text-5xl font-bold text-center py-6 ${globalDiscount > 0 ? 'text-emerald-500' : theme.textSub}`}
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-400">
                                %
                              </div>
                            </div>
                            {globalDiscount > 0 && (
                              <div className="mt-4 text-center">
                                <p className="text-emerald-500 font-semibold text-sm">
                                  🎉 {globalDiscount}% off all bookings
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Live Preview Card */}
                          <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                              <label className={`text-xs uppercase font-bold tracking-wider ${theme.textSub}`}>
                                Live Preview
                              </label>
                              <span className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                                Standard Rate: KES 2,500
                              </span>
                            </div>

                            <div className="space-y-4">
                              {/* Original Price */}
                              <div className="flex items-center justify-between">
                                <span className={theme.textSub}>Original Price:</span>
                                <span className={`text-xl font-semibold ${globalDiscount > 0 ? 'line-through text-gray-400' : theme.text}`}>
                                  KES 2,500
                                </span>
                              </div>

                              {globalDiscount > 0 && (
                                <>
                                  {/* Discount Amount */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-red-500 text-sm">Discount ({globalDiscount}%):</span>
                                    <span className="text-red-500 font-semibold">
                                      - KES {(2500 * globalDiscount / 100).toLocaleString()}
                                    </span>
                                  </div>

                                  {/* Divider */}
                                  <div className={`border-t-2 border-dashed ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}></div>
                                </>
                              )}

                              {/* Final Price */}
                              <div className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <span className="font-bold text-emerald-600">Final Price:</span>
                                <span className="text-3xl font-bold text-emerald-500">
                                  KES {getDiscountedPrice(2500).toLocaleString()}
                                </span>
                              </div>

                              {globalDiscount > 0 && (
                                <div className="text-center">
                                  <p className="text-xs text-emerald-500 font-semibold">
                                    💰 Customers save KES {(2500 * globalDiscount / 100).toLocaleString()} per booking!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            onClick={() => setGlobalDiscount(10)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                          >
                            10% Off
                          </button>
                          <button
                            onClick={() => setGlobalDiscount(20)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                          >
                            20% Off
                          </button>
                          <button
                            onClick={() => setGlobalDiscount(30)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                          >
                            30% Off
                          </button>
                          <button
                            onClick={() => setGlobalDiscount(50)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                          >
                            50% Off
                          </button>
                          {globalDiscount > 0 && (
                            <button
                              onClick={() => setGlobalDiscount(0)}
                              className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition ml-auto"
                            >
                              ✕ Clear Discount
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {dashboardTab === 'calendar' && (
                    <>
                      {userRole === 'admin' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Total Revenue</p><h3 className="text-3xl font-bold text-emerald-500">KES {(dashboardStats.revenue || 0).toLocaleString()}</h3></div>
                            <div onClick={() => setDashboardTab('bookings')} className={`${theme.card} p-6 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Total Bookings</p><h3 className="text-3xl font-bold">{(dashboardStats.bookings || 0).toLocaleString()}</h3></div>
                            <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Total Users</p><h3 className="text-3xl font-bold text-purple-500">{(dashboardStats.users || 0).toLocaleString()}</h3></div>
                          </div>

                          {/* REVENUE CHART */}
                          <div className={`${theme.card} p-6 mt-6`}>
                            <h3 className="font-bold text-lg mb-4">Revenue Trends (Last 7 Days)</h3>
                            <div className="h-48 w-full flex items-end justify-between gap-2">
                              {chartData.length > 0 ? chartData.map((d, i) => {
                                const maxVal = Math.max(...chartData.map(c => c.revenue)) || 100;
                                const height = (d.revenue / maxVal) * 100;
                                return (
                                  <div key={i} className="flex flex-col items-center w-full group relative">
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded transition-opacity">
                                      KES {d.revenue.toLocaleString()}
                                    </div>
                                    <div
                                      style={{ height: `${height}%`, minHeight: '4px' }}
                                      className={`w-full rounded-t-sm transition-all duration-500 ${isDarkMode ? 'bg-emerald-500/50 hover:bg-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                                    ></div>
                                    <span className="text-xs mt-2 text-gray-500">{d.date}</span>
                                  </div>
                                )
                              }) : <div className="text-gray-500 w-full text-center self-center">No data available</div>}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Today's Slots</p><h3 className="text-3xl font-bold text-emerald-500">4 / 16 Booked</h3></div>
                            <div className={`${theme.card} p-6 relative overflow-hidden`}><p className={`text-sm font-bold uppercase mb-1 ${theme.textSub}`}>Next Booking</p><h3 className="text-2xl font-bold">18:00 - Allianz</h3></div>
                          </div>
                        </>
                      )}
                      <div className={theme.card + " p-4 md:p-6"}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                          <h3 className="font-bold text-xl mb-3 md:mb-0">Daily Schedule (Click + to Manually Book)</h3>
                          <div className="flex items-center space-x-4"><input type="date" value={calendarDate} onChange={(e) => setCalendarDate(e.target.value)} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4 py-2 outline-none`} /></div>
                        </div>
                        <div className="overflow-x-auto pb-4">
                          <div className="min-w-[800px]">
                            <div className="grid grid-cols-[150px_1fr] gap-4">
                              <div className="space-y-4 pt-12">{TURFS.map(t => <div key={t.id} className={`h-16 flex items-center font-bold ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{t.name}</div>)}</div>
                              <div>
                                <div className="grid grid-cols-12 gap-2 mb-4">{['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (<div key={t} className={`text-xs text-center ${theme.textSub}`}>{t}</div>))}</div>
                                <div className="space-y-4">
                                  {TURFS.map(t => (
                                    <div key={t.id} className="grid grid-cols-12 gap-2 h-16">
                                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(time => {
                                        const booking = bookings.find(b => b.date === calendarDate && b.turf === t.name && b.time === time);
                                        return (
                                          <div key={time} onClick={() => handleSlotClick(t.name, time)} className={`rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer ${booking ? 'bg-emerald-500/20 text-emerald-600' : isDarkMode ? 'bg-white/5 text-gray-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                                            {booking ? (userRole === 'manager' ? 'Bk' : booking.customer.split(' ')[0]) : '+'}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {dashboardTab === 'bookings' && (
                    <div className={theme.card}>
                      <div className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme.tableHeader}`}>
                        <h3 className={`font-bold text-lg ${theme.text}`}>Bookings Database</h3>
                        <div className={`flex items-center space-x-2 rounded-xl px-3 py-2 border w-full md:w-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                          <Search className="h-4 w-4 text-gray-500" /><input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full md:w-56 placeholder:text-gray-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[800px]">
                          <thead className={theme.tableHeader}>
                            <tr>
                              <th className="p-4 pl-6">When</th>
                              <th className="p-4">Where (Turf)</th>
                              <th className="p-4">Who (Customer)</th>
                              <th className="p-4">Payment</th>
                              <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                          </thead>
                          <tbody className={isDarkMode ? 'divide-y divide-white/5' : 'divide-y divide-slate-100'}>
                            {bookings.filter(b => b.id.toLowerCase().includes(searchTerm.toLowerCase()) || (b.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => new Date(b.date) - new Date(a.date)).map(b => (
                              <tr key={b.id} className={`${theme.tableRow} group`}>
                                <td className="p-4 pl-6">
                                  <div className="font-bold text-base">{b.time_slot}</div>
                                  <div className={`text-xs ${theme.textSub}`}>{new Date(b.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                </td>
                                <td className="p-4">
                                  <div className="font-bold text-emerald-500">
                                    {b.turf?.name || turfs.find(t => t.id === b.turf_id)?.name || 'Unknown Turf'}
                                  </div>
                                  <div className="text-xs text-xs font-mono opacity-50">#{b.id.slice(0, 6)}</div>
                                </td>
                                <td className="p-4">
                                  <div className="font-bold">{b.customer_name || 'Guest'}</div>
                                  {b.customer_phone && <div className={`text-xs flex items-center ${theme.textSub}`}><Phone className="h-3 w-3 mr-1" /> {b.customer_phone}</div>}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase border ${b.status === 'confirmed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                                      {b.status}
                                    </span>
                                    <span className="font-bold text-sm">KES {b.amount}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <button onClick={() => setEditingBooking(b)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition">
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {dashboardTab === 'events_mgmt' && (
                    <div className={theme.card}>
                      <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                        <div><h3 className={`font-bold text-lg ${theme.text}`}>Manage Events</h3><p className="text-xs">Create, Postpone (Edit), or Delete Events</p></div>
                        <button onClick={() => setEditingEvent({ id: 'new', title: '', date: '', time: '', image: '' })} className={theme.btnPrimary + " py-2 px-4 text-sm flex items-center"}><Plus className="h-4 w-4 mr-2" /> Create Event</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {eventsList.map(event => (
                          <div key={event.id} className={`rounded-xl p-4 flex items-center border transition group relative ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                            <img src={event.image} alt={event.title} className="h-16 w-16 rounded-lg object-cover mr-4" />
                            <div className="flex-1"><h4 className="font-bold">{event.title}</h4><div className={`text-xs mt-1 flex items-center ${theme.textSub}`}><CalendarIcon className="h-3 w-3 mr-1 text-emerald-500" /> {event.date} @ {event.time}</div></div>
                            <div className="flex space-x-2"><button onClick={() => setEditingEvent(event)} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white border border-slate-200 hover:bg-slate-50'} text-emerald-500`}><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDeleteEvent(event.id)} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-red-500/20' : 'bg-white border border-slate-200 hover:bg-red-50'} text-red-400`}><Trash2 className="h-4 w-4" /></button></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dashboardTab === 'reports' && (
                    <div className={theme.card + " p-6 md:p-8"}>
                      <div className="flex justify-between items-center mb-8"><div><h3 className="font-bold text-xl">System Reports</h3><p className={`text-sm ${theme.textSub}`}>Generate and download activity summaries.</p></div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {REPORTS.map(report => (
                          <div key={report.id} className={`border p-6 rounded-2xl flex justify-between items-center transition ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md'}`}>
                            <div className="flex items-center"><div className="bg-emerald-500/20 p-3 rounded-xl mr-4"><FileText className="h-6 w-6 text-emerald-500" /></div><div><div className="font-bold">{report.title}</div><div className={`text-xs uppercase font-bold mt-1 ${theme.textSub}`}>{report.type} • {report.date}</div></div></div>
                            <button onClick={() => handleDownloadPdf(report.title)} className={`p-3 rounded-full transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'}`}><Download className="h-5 w-5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dashboardTab === 'users' && userRole === 'admin' && (
                    <div className={theme.card}>
                      <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                        <h3 className={`font-bold text-lg ${theme.text}`}>Staff Access</h3>
                        <button onClick={() => setEditingUser({ id: null, name: '', email: '', role: 'manager', status: 'Active' })} className={theme.btnPrimary + " py-2 px-4 text-sm flex items-center"}><Plus className="h-4 w-4 mr-2" /> Add User</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[600px]">
                          <thead className={theme.tableHeader}><tr><th className="p-4 pl-6">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right pr-6">Actions</th></tr></thead>
                          <tbody className={isDarkMode ? 'divide-y divide-white/5' : 'divide-y divide-slate-100'}>
                            {users.map(user => (
                              <tr key={user.id} className={theme.tableRow}><td className="p-4 pl-6 font-medium">{user.name}</td><td className={`p-4 ${theme.textSub}`}>{user.email}</td><td className="p-4 capitalize text-emerald-500">{user.role}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-500'}`}>{user.status}</span></td><td className="p-4 text-right pr-6 space-x-3"><button onClick={() => setEditingUser(user)} className="text-gray-400 hover:text-emerald-500"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {dashboardTab === 'notifications' && (
                    <div className={theme.card}>
                      <div className={`p-6 flex justify-between items-center ${theme.tableHeader}`}>
                        <div>
                          <h3 className={`font-bold text-lg ${theme.text}`}>Notifications</h3>
                          <p className="text-xs">All system and booking notifications</p>
                        </div>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <button
                            onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                            className={`text-xs ${theme.textAccent} hover:underline`}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="p-6 space-y-3">
                        {notifications.length === 0 ? (
                          <div className="text-center py-12">
                            <Bell className={`h-16 w-16 mx-auto mb-4 ${theme.textSub} opacity-50`} />
                            <p className={theme.textSub}>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              className={`p-4 rounded-2xl border transition cursor-pointer ${notif.read
                                ? (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 opacity-70')
                                : (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                                }`}
                              onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {notif.type === 'booking' && <CalendarIcon className="h-4 w-4 text-emerald-500" />}
                                    {notif.type === 'payment' && <DollarSign className="h-4 w-4 text-emerald-500" />}
                                    {notif.type === 'system' && <Settings className="h-4 w-4 text-gray-500" />}
                                    <span className={`text-xs uppercase font-bold ${theme.textSub}`}>{notif.type}</span>
                                    {!notif.read && <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>}
                                  </div>
                                  <p className={`${theme.text} font-medium`}>{notif.message}</p>
                                  <p className={`text-xs ${theme.textSub} mt-2`}>
                                    {new Date(notif.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNotifications(notifications.filter(n => n.id !== notif.id));
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {dashboardTab === 'profile' && (
                    <div className={`${theme.card} p-6 md:p-8 flex flex-col items-center`}>
                      <div className="relative mb-8"><img src={userProfile.avatar} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-emerald-500/20" /><button className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full text-black hover:scale-110 transition"><Camera className="h-4 w-4" /></button></div>
                      <form onSubmit={handleUpdateProfile} className="w-full max-w-md space-y-4">
                        <h3 className="font-bold text-lg mb-4 text-center">Manage Your Profile</h3>
                        <div><label className={`text-xs uppercase font-bold ml-2 ${theme.textSub}`}>Full Name</label><input value={userProfile.name} onChange={e => setUserProfile({ ...userProfile, name: e.target.value })} className={theme.input} placeholder="Full Name" /></div>
                        <div><label className={`text-xs uppercase font-bold ml-2 ${theme.textSub}`}>Phone</label><input value={userProfile.phone} onChange={e => setUserProfile({ ...userProfile, phone: e.target.value })} className={theme.input} placeholder="Phone" /></div>
                        <div><label className={`text-xs uppercase font-bold ml-2 ${theme.textSub}`}>Email</label><input value={userProfile.email} onChange={e => setUserProfile({ ...userProfile, email: e.target.value })} className={theme.input} placeholder="Email" /></div>
                        <div className="flex justify-center pt-6"><button type="submit" className={theme.btnPrimary + " w-full"}>Save Changes</button></div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* --- MODALS --- */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className={`${theme.card} w-full max-w-md p-8`}>
                <h3 className="text-xl font-bold mb-6">{editingUser.id ? 'Edit User' : 'New User'}</h3>
                <form onSubmit={handleSaveUser} className="space-y-4">
                  <input type="text" placeholder="Full Name" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className={theme.input} required />
                  <input type="email" placeholder="Email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className={theme.input} required />
                  <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className={theme.input}>
                    <option value="manager" className="text-black">Manager</option>
                    {userRole === 'admin' && <option value="admin" className="text-black">Admin</option>}
                  </select>
                  <select value={editingUser.status} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })} className={theme.input}>
                    <option value="Active" className="text-black">Active</option>
                    <option value="Inactive" className="text-black">Inactive</option>
                  </select>
                  <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setEditingUser(null)} className={`px-4 ${theme.textSub} hover:text-emerald-500`}>Cancel</button><button type="submit" className={theme.btnPrimary + " py-2 px-6"}>Save</button></div>
                </form>
              </div>
            </div>
          )}

          {editingBooking && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className={`${theme.card} w-full max-w-lg p-8`}>
                <div className="flex justify-between mb-6"><h3 className="text-xl font-bold">{editingBooking.id === 'new' ? 'New Manual Booking' : 'Manage Booking'}</h3><button onClick={() => setEditingBooking(null)}><X className={`h-5 w-5 ${theme.textSub}`} /></button></div>
                <form onSubmit={handleSaveBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4"><div><label className={`text-xs ml-2 ${theme.textSub}`}>Date</label><input type="date" value={editingBooking.date} onChange={e => setEditingBooking({ ...editingBooking, date: e.target.value })} className={theme.input} /></div><div><label className={`text-xs ml-2 ${theme.textSub}`}>Time</label><input type="text" value={editingBooking.time} readOnly className={theme.input + " cursor-not-allowed opacity-50"} /></div></div>
                  <div><label className={`text-xs ml-2 ${theme.textSub}`}>Customer</label><input type="text" value={editingBooking.customer} onChange={e => setEditingBooking({ ...editingBooking, customer: e.target.value })} className={theme.input} /></div>
                  <div><label className={`text-xs ml-2 ${theme.textSub}`}>Turf</label><input type="text" value={editingBooking.turf} readOnly className={theme.input + " cursor-not-allowed opacity-50"} /></div>
                  {userRole === 'admin' && (<div><label className={`text-xs ml-2 ${theme.textSub}`}>Amount (KES)</label><input type="number" value={editingBooking.amount} onChange={e => setEditingBooking({ ...editingBooking, amount: Number(e.target.value) })} className={theme.input} /></div>)}
                  <div className="flex justify-between gap-4">
                    <div className="w-1/2"><label className={`text-xs ml-2 ${theme.textSub}`}>Status</label><select value={editingBooking.status} onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value })} className={theme.input}><option value="Confirmed" className="text-black">Confirmed</option><option value="Pending" className="text-black">Pending</option><option value="Cancelled" className="text-black">Cancelled</option></select></div>
                    <div className="w-1/2"><label className={`text-xs ml-2 ${theme.textSub}`}>Payment</label><select value={editingBooking.payment} onChange={e => setEditingBooking({ ...editingBooking, payment: e.target.value })} className={theme.input}><option value="M-Pesa" className="text-black">M-Pesa</option><option value="Cash" className="text-black">Cash</option><option value="Pending" className="text-black">Pending</option></select></div>
                  </div>
                  <button type="submit" className={theme.btnPrimary + " w-full mt-4"}>{editingBooking.id === 'new' ? 'Create Booking' : 'Update Booking'}</button>
                </form>
              </div>
            </div>
          )}

          {editingEvent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className={`${theme.card} w-full max-w-md p-8`}>
                <h3 className="text-xl font-bold mb-6">{editingEvent.id === 'new' ? 'Create New Event' : 'Edit Event'}</h3>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div><label className={`text-xs ml-2 ${theme.textSub}`}>Event Title</label><input type="text" placeholder="e.g. Weekend League" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} className={theme.input} required /></div>
                  <div className="grid grid-cols-2 gap-4"><div><label className={`text-xs ml-2 ${theme.textSub}`}>Date</label><input type="date" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} className={theme.input} required /></div><div><label className={`text-xs ml-2 ${theme.textSub}`}>Time</label><input type="time" value={editingEvent.time} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} className={theme.input} required /></div></div>
                  <div><label className={`text-xs ml-2 ${theme.textSub}`}>Image URL (Optional)</label><input type="text" placeholder="https://..." value={editingEvent.image} onChange={e => setEditingEvent({ ...editingEvent, image: e.target.value })} className={theme.input} /></div>
                  <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setEditingEvent(null)} className={`px-4 ${theme.textSub} hover:text-emerald-500`}>Cancel</button><button type="submit" className={theme.btnPrimary + " py-2 px-6"}>Save Event</button></div>
                </form>
              </div>
            </div>
          )}

          {/* --- VIEW: LOGIN --- */}
          {currentView === 'login' && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] pt-12">
              <div className={`${theme.card} w-full max-w-md p-10`}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                  <p className={`text-sm ${theme.textSub}`}>Enter your credentials to access your account</p>
                </div>

                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className={`w-full mb-6 px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all ${isDarkMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border-2 border-slate-200'
                    } shadow-lg hover:shadow-xl`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="text-center mb-6">
                  <span className={`text-sm ${theme.textSub}`}>
                    Or continue with email
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div><label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-2 ${theme.textSub}`}>Username / Email</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. alex@goalhub.ke" className={theme.input} /></div>
                  <div><label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-2 ${theme.textSub}`}>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={theme.input} /></div>
                </div>
                <button onClick={handleLoginSubmit} className={`${theme.btnPrimary} w-full`}>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                <div className="mt-4 text-center">
                  <span className={`text-sm ${theme.textSub}`}>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
                  <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-sm font-bold text-emerald-500 hover:underline">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
                <div className="mt-6 text-center"><button onClick={() => navigateTo('landing')} className={`text-sm ${theme.textSub} hover:text-emerald-500 transition`}>Cancel and return home</button></div>
              </div>
            </div>
          )}

          {/* --- VIEW: SUCCESS --- */}
          {currentView === 'success' && confirmedBooking && (
            <div className={`${theme.card} max-w-md mx-auto overflow-hidden text-center`}>
              <div className="bg-emerald-500 p-10 text-black">
                <div className="h-20 w-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"><CheckCircle className="h-10 w-10 text-black" /></div>
                <h2 className="text-3xl font-bold">All Set!</h2>
                <p className="font-medium opacity-75 mt-2">Booking Confirmed</p>
              </div>
              <div className="p-10 space-y-8">
                <div><p className={`text-xs uppercase tracking-wider font-bold mb-2 ${theme.textSub}`}>Booking Ref</p><p className="text-3xl font-mono font-bold tracking-widest">{confirmedBooking.id}</p></div>
                <div className="bg-white p-4 rounded-2xl inline-block shadow-inner"><QrCode className="h-32 w-32 text-black" /></div>
                <div className={`space-y-2 text-sm ${theme.textSub}`}><p>Show this QR code at the gate.</p><p>A copy has been sent to {confirmedBooking.customer}</p></div>
                <button onClick={() => navigateTo('landing')} className={theme.btnSecondary + " w-full"}>Done</button>
              </div>
            </div>
          )}
        </main>

        {/* --- FOOTER (Responsive Grid) --- */}
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

      </div> {/* End Content Wrapper */}
    </div >
  );
}