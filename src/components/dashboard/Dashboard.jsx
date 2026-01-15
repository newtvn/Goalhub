
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserProfile from './UserProfile';

export default function Dashboard(props) {
    const { userRole } = useAuth(); // or pass as prop if desired

    if (userRole === 'user' || userRole === 'guest') {
        // Guest shouldn't really be here, but if they are, show profile view (which might be empty)
        return <UserProfile bookings={props.bookings} />;
    }

    // Admin and Manager
    return <AdminDashboard {...props} />;
}
