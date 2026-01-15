
import { supabase } from '../supabase';

// ============================================
// TURFS (PITCHES) CRUD OPERATIONS
// ============================================

export const subscribeToTurfs = (callback) => {
    const channel = supabase
        .channel('public:turfs')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'turfs' }, (payload) => {
            fetchTurfs(callback);
        })
        .subscribe();

    fetchTurfs(callback);

    return () => {
        supabase.removeChannel(channel);
    };
};

const fetchTurfs = async (callback) => {
    const { data, error } = await supabase
        .from('turfs')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching turfs:", error);
        callback([]);
    } else {
        callback(data);
    }
};

export const createTurf = async (turfData) => {
    const { data, error } = await supabase
        .from('turfs')
        .insert([{ ...turfData }])
        .select();

    if (error) {
        console.error("Error creating turf:", error);
        return { success: false, error: error.message };
    }
    return { success: true, id: data[0].id };
};

export const updateTurf = async (turfId, updates) => {
    const { error } = await supabase
        .from('turfs')
        .update(updates)
        .eq('id', turfId);

    if (error) {
        console.error("Error updating turf:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};

export const deleteTurf = async (turfId) => {
    const { error } = await supabase
        .from('turfs')
        .delete()
        .eq('id', turfId);

    if (error) {
        console.error("Error deleting turf:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};


// ============================================
// BOOKINGS CRUD OPERATIONS
// ============================================

export const subscribeToBookings = (callback) => {
    const channel = supabase
        .channel('public:bookings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
            fetchBookings(callback);
        })
        .subscribe();

    fetchBookings(callback);

    return () => {
        supabase.removeChannel(channel);
    };
};

const fetchBookings = async (callback) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching bookings:", error);
        callback([]);
    } else {
        // Map fields to match fontend expectation if needed (e.g. mapping snake_case to camelCase if frontend expects it)
        // Although Supabase returns snake_case columns.
        // Frontend expects: date, time, customer, status...
        // DB Schema: customer_name, customer_email...
        // We will map it here to avoid breaking frontend.

        const mappedData = data.map(b => ({
            ...b,
            customer: b.customer_name, // Maps customer_name to customer
            customerEmail: b.customer_email,
            customerPhone: b.customer_phone,
            turf: b.turf_name // Assuming we store turf name denormalized or fetch it joined
        }));

        callback(mappedData);
    }
};

export const createBooking = async (bookingData) => {
    // Map camelCase to snake_case for DB
    const dbBooking = {
        turf_id: bookingData.turfId, // Assuming you have ID
        turf_name: bookingData.turf,
        user_id: bookingData.userId, // If authenticated
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
        customer_name: bookingData.customer || bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        amount: bookingData.amount,
        status: 'confirmed', // Assuming instant confirm for demo
        payment_status: bookingData.paymentStatus || 'pending'
    };

    const { data, error } = await supabase
        .from('bookings')
        .insert([dbBooking])
        .select();

    if (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: error.message };
    }
    return { success: true, booking: { ...data[0], id: data[0].id } };
};

export const updateBooking = async (bookingId, updates) => {
    // Basic mapping if needed
    const { error } = await supabase
        .from('bookings')
        .update(updates) // Warning: Make sure keys match DB columns
        .eq('id', bookingId);

    if (error) {
        console.error("Error updating booking:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};

export const deleteBooking = async (bookingId) => {
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

    if (error) {
        console.error("Error deleting booking:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};

export const getUserBookings = async (userEmail) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching user bookings:", error);
        return { success: false, error: error.message, bookings: [] };
    }

    const mappedData = data.map(b => ({
        ...b,
        customer: b.customer_name,
        customerEmail: b.customer_email,
        customerPhone: b.customer_phone,
        turf: b.turf_name
    }));

    return { success: true, bookings: mappedData };
};


// ============================================
// EVENTS CRUD OPERATIONS
// ============================================

export const subscribeToEvents = (callback) => {
    const channel = supabase
        .channel('public:events')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
            fetchEvents(callback);
        })
        .subscribe();

    fetchEvents(callback);

    return () => {
        supabase.removeChannel(channel);
    };
};

const fetchEvents = async (callback) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    if (error) callback([]);
    else callback(data);
};

export const createEvent = async (eventData) => {
    const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data[0].id };
};

export const updateEvent = async (eventId, updates) => {
    const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId);

    if (error) return { success: false, error: error.message };
    return { success: true };
};

export const deleteEvent = async (eventId) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

    if (error) return { success: false, error: error.message };
    return { success: true };
};


// ============================================
// EXTRAS (ADD-ONS) CRUD OPERATIONS
// ============================================

export const subscribeToExtras = (callback) => {
    const channel = supabase
        .channel('public:extras')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'extras' }, () => {
            fetchExtras(callback);
        })
        .subscribe();

    fetchExtras(callback);

    return () => {
        supabase.removeChannel(channel);
    };
};

const fetchExtras = async (callback) => {
    const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching extras:", error);
        callback([]);
    } else {
        callback(data);
    }
};

export const createExtra = async (extraData) => {
    const { data, error } = await supabase
        .from('extras')
        .insert([extraData])
        .select();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data[0].id };
};

export const updateExtra = async (extraId, updates) => {
    const { error } = await supabase
        .from('extras')
        .update(updates)
        .eq('id', extraId);

    if (error) return { success: false, error: error.message };
    return { success: true };
};

export const deleteExtra = async (extraId) => {
    const { error } = await supabase
        .from('extras')
        .delete()
        .eq('id', extraId);

    if (error) return { success: false, error: error.message };
    return { success: true };
};


// ============================================
// SETTINGS
// ============================================

export const subscribeToSettings = (callback) => {
    const channel = supabase
        .channel('public:settings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
            fetchSettings(callback);
        })
        .subscribe();

    fetchSettings(callback);

    return () => supabase.removeChannel(channel);
};

const fetchSettings = async (callback) => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'global')
        .single();

    if (error) {
        callback({ globalDiscount: 0 });
    } else {
        callback({
            globalDiscount: data.global_discount,
            maintenanceMode: data.maintenance_mode
        });
    }
};

export const updateSettings = async (settings) => {
    const dbSettings = {};
    if (settings.globalDiscount !== undefined) dbSettings.global_discount = settings.globalDiscount;
    if (settings.maintenanceMode !== undefined) dbSettings.maintenance_mode = settings.maintenanceMode;

    const { error } = await supabase
        .from('settings')
        .update(dbSettings)
        .eq('key', 'global');

    if (error) return { success: false, error: error.message };
    return { success: true };
};

// ============================================
// NOTIFICATIONS
// ============================================

export const subscribeToNotifications = (callback) => {
    const channel = supabase
        .channel('public:notifications')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
            fetchNotifications(callback);
        })
        .subscribe();

    fetchNotifications(callback);
    return () => supabase.removeChannel(channel);
};

const fetchNotifications = async (callback) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) callback([]);
    else callback(data);
};

export const createNotification = async (notifData) => {
    const { data, error } = await supabase
        .from('notifications')
        .insert([{
            title: notifData.title,
            message: notifData.message,
            type: notifData.type || 'info',
            is_global: true
        }])
        .select();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data[0].id };
};



// ============================================
// USERS (Admin)
// ============================================

export const subscribeToUsers = (callback) => {
    const channel = supabase
        .channel('public:users')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
            fetchUsers(callback);
        })
        .subscribe();

    fetchUsers(callback);
    return () => supabase.removeChannel(channel);
};

const fetchUsers = async (callback) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) callback([]);
    else callback(data.map(u => ({ ...u, name: u.display_name, status: 'Active' })));
};

export const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};


// ============================================
// TRANSACTIONS
// ============================================

export const subscribeToTransactions = (callback) => {
    const channel = supabase
        .channel('public:transactions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
            fetchTransactions(callback);
        })
        .subscribe();

    fetchTransactions(callback);
    return () => supabase.removeChannel(channel);
};

const fetchTransactions = async (callback) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) callback([]);
    else callback(data);
};

export const createTransaction = async (txnData) => {
    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            amount: txnData.amount,
            phone: txnData.customerPhone,
            status: txnData.status,
            // checkout_request_id ... 
        }])
        .select();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data[0].id };
};

export const pollPaymentStatus = async (txnId) => {
    // Mock for now
    return true;
};

// ============================================
// UTILS
// ============================================

export const monitorConnection = (callback) => {
    const updateStatus = () => callback(navigator.onLine ? 'online' : 'offline');
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
    return () => {
        window.removeEventListener('online', updateStatus);
        window.removeEventListener('offline', updateStatus);
    };
};
