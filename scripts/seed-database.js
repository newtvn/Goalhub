/**
 * GOALHUB - Database Seed Script
 * Run this to populate Firestore with initial sample data
 * 
 * Usage: node scripts/seed-database.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration (same as in your app)
const firebaseConfig = {
    apiKey: "AIzaSyAkeKpob-TwhGhRR4fPns9T3_txB9QplxI",
    authDomain: "goalhub-prod.firebaseapp.com",
    projectId: "goalhub-prod",
    storageBucket: "goalhub-prod.firebasestorage.app",
    messagingSenderId: "294205667072",
    appId: "1:294205667072:web:992f56b74342c2692c25e5",
    measurementId: "G-104L8JVFEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to create timestamps
const now = Timestamp.now();
const daysFromNow = (days) => Timestamp.fromDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));

// ============================================
// SEED DATA
// ============================================

const users = [
    {
        id: 'admin-user-001',
        email: 'newtvnbrian@gmail.com',
        displayName: 'Brian (Admin)',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
        role: 'admin',
        phone: '+254 700 000 001',
        createdAt: now,
        lastLogin: now
    },
    {
        id: 'manager-user-001',
        email: 'newtonbryan12428@gmail.com',
        displayName: 'Newton (Manager)',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        role: 'manager',
        phone: '+254 722 000 002',
        createdAt: now,
        lastLogin: now
    },
    {
        id: 'user-001',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        role: 'user',
        phone: '+254 712 345 678',
        createdAt: now,
        lastLogin: now
    },
    {
        id: 'user-002',
        email: 'jane.smith@example.com',
        displayName: 'Jane Smith',
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        role: 'user',
        phone: '+254 733 456 789',
        createdAt: now,
        lastLogin: now
    }
];

const bookings = [
    {
        id: 'BK-1001',
        turf: 'Allianz Arena',
        date: '2026-01-15',
        time: '18:00',
        duration: 1,
        customer: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '+254 712 345 678',
        status: 'Confirmed',
        amount: 2500,
        payment: 'M-Pesa',
        extras: [{ id: 'bibs', name: 'Team Bibs', price: 200 }],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'BK-1002',
        turf: 'Camp Nou',
        date: '2026-01-15',
        time: '19:00',
        duration: 2,
        customer: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        customerPhone: '+254 733 456 789',
        status: 'Confirmed',
        amount: 7000,
        payment: 'M-Pesa',
        extras: [
            { id: 'bibs', name: 'Team Bibs', price: 200 },
            { id: 'ball', name: 'Pro Match Ball', price: 150 }
        ],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'BK-1003',
        turf: 'Allianz Arena',
        date: '2026-01-16',
        time: '10:00',
        duration: 1,
        customer: 'Walk-in Guest',
        customerEmail: '',
        customerPhone: '+254 700 111 222',
        status: 'Pending',
        amount: 2500,
        payment: 'Cash',
        extras: [],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'BK-1004',
        turf: 'Camp Nou',
        date: '2026-01-20',
        time: '16:00',
        duration: 2,
        customer: 'Corporate Team',
        customerEmail: 'events@company.co.ke',
        customerPhone: '+254 720 888 999',
        status: 'Confirmed',
        amount: 7000,
        payment: 'M-Pesa',
        extras: [{ id: 'water', name: 'Water Case', price: 800 }],
        createdAt: now,
        updatedAt: now
    }
];

const events = [
    {
        title: 'Kitengela Super Cup 2026',
        date: '2026-02-15',
        time: '14:00',
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400',
        description: 'Annual 5-a-side tournament featuring top local teams',
        createdAt: now
    },
    {
        title: 'Corporate League Season 3',
        date: '2026-01-28',
        time: '18:00',
        image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=400',
        description: 'Weekly corporate football league for Kitengela businesses',
        createdAt: now
    },
    {
        title: 'Youth Development Camp',
        date: '2026-03-01',
        time: '09:00',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=400',
        description: 'Training camp for young footballers aged 8-16',
        createdAt: now
    },
    {
        title: 'Weekend Warriors Cup',
        date: '2026-02-08',
        time: '15:00',
        image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=400',
        description: 'Casual tournament for weekend players',
        createdAt: now
    }
];

const notifications = [
    {
        type: 'booking',
        message: 'New booking: John Doe booked Allianz Arena for Jan 15 at 18:00',
        bookingId: 'BK-1001',
        read: false,
        createdAt: now
    },
    {
        type: 'booking',
        message: 'New booking: Jane Smith booked Camp Nou for Jan 15 at 19:00',
        bookingId: 'BK-1002',
        read: false,
        createdAt: now
    },
    {
        type: 'payment',
        message: 'Payment received: KES 2,500 from John Doe (M-Pesa)',
        read: true,
        createdAt: now
    },
    {
        type: 'system',
        message: 'Welcome to GoalHub! Your database has been initialized.',
        read: false,
        createdAt: now
    },
    {
        type: 'system',
        message: 'New event created: Kitengela Super Cup 2026',
        read: true,
        createdAt: now
    }
];

const turfs = [
    {
        id: 'turf-001',
        name: 'Allianz Arena',
        location: 'Kitengela, Namanga Rd',
        type: '5-a-side',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800',
        description: 'Premium 5-a-side pitch with floodlights and changing rooms',
        available: true,
        createdAt: now
    },
    {
        id: 'turf-002',
        name: 'Camp Nou',
        location: 'Kitengela, CBD',
        type: '7-a-side',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
        description: 'Full-size 7-a-side artificial turf with spectator seating',
        available: true,
        createdAt: now
    },
    {
        id: 'turf-003',
        name: 'Santiago Bernabeu',
        location: 'Athi River',
        type: '11-a-side',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
        description: 'Full stadium experience with 11-a-side pitch',
        available: true,
        createdAt: now
    }
];

const extras = [
    {
        id: 'extra-bibs',
        name: 'Team Bibs',
        sub: 'Set of 10',
        price: 200,
        icon: 'users',
        createdAt: now
    },
    {
        id: 'extra-ball',
        name: 'Pro Match Ball',
        sub: 'Size 5',
        price: 150,
        icon: 'check-circle',
        createdAt: now
    },
    {
        id: 'extra-water',
        name: 'Water Case',
        sub: '24 Bottles',
        price: 800,
        icon: 'check-circle',
        createdAt: now
    },
    {
        id: 'extra-referee',
        name: 'Match Referee',
        sub: 'Professional',
        price: 1500,
        icon: 'shield',
        createdAt: now
    }
];

const settings = {
    globalDiscount: 0,
    siteName: 'GoalHub Kenya',
    contactEmail: 'bookings@goalhub.ke',
    contactPhone: '+254 700 000 000',
    address: 'Namanga Road, Kitengela, Kenya',
    createdAt: now
};

const transactions = [
    {
        id: 'TXN-100001',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '254712345678',
        amount: 2700,
        method: 'M-Pesa',
        status: 'completed',
        turf: 'Allianz Arena',
        bookingDate: '2026-01-15',
        bookingTime: '18:00',
        bookingId: 'BK-1001',
        mpesaReceiptNumber: 'QKR4ABCDEF',
        createdAt: now
    },
    {
        id: 'TXN-100002',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        customerPhone: '254733456789',
        amount: 7350,
        method: 'M-Pesa',
        status: 'completed',
        turf: 'Camp Nou',
        bookingDate: '2026-01-15',
        bookingTime: '19:00',
        bookingId: 'BK-1002',
        mpesaReceiptNumber: 'QKR4GHIJKL',
        createdAt: now
    },
    {
        id: 'TXN-100003',
        customerName: 'Walk-in Guest',
        customerEmail: '',
        customerPhone: '254700111222',
        amount: 2500,
        method: 'M-Pesa',
        status: 'pending',
        turf: 'Allianz Arena',
        bookingDate: '2026-01-16',
        bookingTime: '10:00',
        createdAt: now
    },
    {
        id: 'TXN-100004',
        customerName: 'Corporate Team',
        customerEmail: 'events@company.co.ke',
        customerPhone: '254720888999',
        amount: 7800,
        method: 'M-Pesa',
        status: 'completed',
        turf: 'Camp Nou',
        bookingDate: '2026-01-20',
        bookingTime: '16:00',
        bookingId: 'BK-1004',
        mpesaReceiptNumber: 'QKR4MNOPQR',
        createdAt: now
    },
    {
        id: 'TXN-100005',
        customerName: 'Test User',
        customerEmail: 'test@test.com',
        customerPhone: '254799999999',
        amount: 3500,
        method: 'M-Pesa',
        status: 'failed',
        failureReason: 'User cancelled',
        turf: 'Camp Nou',
        bookingDate: '2026-01-18',
        bookingTime: '14:00',
        createdAt: now
    }
];

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedUsers() {
    console.log('📝 Seeding users...');
    for (const user of users) {
        const { id, ...userData } = user;
        await setDoc(doc(db, 'users', id), userData);
        console.log(`   ✅ Created user: ${userData.displayName}`);
    }
}

async function seedBookings() {
    console.log('📝 Seeding bookings...');
    for (const booking of bookings) {
        const { id, ...bookingData } = booking;
        await setDoc(doc(db, 'bookings', id), bookingData);
        console.log(`   ✅ Created booking: ${id} - ${bookingData.customer}`);
    }
}

async function seedEvents() {
    console.log('📝 Seeding events...');
    for (const event of events) {
        const docRef = await addDoc(collection(db, 'events'), event);
        console.log(`   ✅ Created event: ${event.title} (${docRef.id})`);
    }
}

async function seedNotifications() {
    console.log('📝 Seeding notifications...');
    for (const notification of notifications) {
        const docRef = await addDoc(collection(db, 'notifications'), notification);
        console.log(`   ✅ Created notification: ${notification.type} (${docRef.id})`);
    }
}

async function seedTurfs() {
    console.log('📝 Seeding turfs...');
    for (const turf of turfs) {
        const { id, ...turfData } = turf;
        await setDoc(doc(db, 'turfs', id), turfData);
        console.log(`   ✅ Created turf: ${turfData.name}`);
    }
}

async function seedExtras() {
    console.log('📝 Seeding extras...');
    for (const extra of extras) {
        const { id, ...extraData } = extra;
        await setDoc(doc(db, 'extras', id), extraData);
        console.log(`   ✅ Created extra: ${extraData.name}`);
    }
}

async function seedSettings() {
    console.log('📝 Seeding settings...');
    await setDoc(doc(db, 'settings', 'global'), settings);
    console.log(`   ✅ Created global settings`);
}

async function seedTransactions() {
    console.log('📝 Seeding transactions...');
    for (const transaction of transactions) {
        const { id, ...transactionData } = transaction;
        await setDoc(doc(db, 'transactions', id), transactionData);
        console.log(`   ✅ Created transaction: ${id} - ${transactionData.customerName}`);
    }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function seedDatabase() {
    console.log('\n🚀 GOALHUB DATABASE SEEDER\n');
    console.log('='.repeat(50));

    try {
        await seedUsers();
        console.log('');
        await seedBookings();
        console.log('');
        await seedEvents();
        console.log('');
        await seedNotifications();
        console.log('');
        await seedTurfs();
        console.log('');
        await seedExtras();
        console.log('');
        await seedSettings();
        console.log('');
        await seedTransactions();

        console.log('\n' + '='.repeat(50));
        console.log('✅ DATABASE SEEDED SUCCESSFULLY!\n');
        console.log('📊 Summary:');
        console.log(`   • ${users.length} users`);
        console.log(`   • ${bookings.length} bookings`);
        console.log(`   • ${events.length} events`);
        console.log(`   • ${notifications.length} notifications`);
        console.log(`   • ${turfs.length} turfs`);
        console.log(`   • ${extras.length} extras`);
        console.log(`   • ${transactions.length} transactions`);
        console.log(`   • 1 settings document`);
        console.log('\n🔗 View in Firebase Console:');
        console.log('   https://console.firebase.google.com/project/goalhub-prod/firestore\n');

    } catch (error) {
        console.error('\n❌ ERROR SEEDING DATABASE:', error);
    }

    process.exit(0);
}

// Run the seeder
seedDatabase();
