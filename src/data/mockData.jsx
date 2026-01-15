import React from 'react';
import { Users, CheckCircle } from 'lucide-react';

export const TURFS = [
    { id: 1, name: 'Allianz Arena', location: 'Kitengela, Namanga Rd', type: '5-a-side', price: 2500, image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Camp Nou', location: 'Kitengela, CBD', type: '7-a-side', price: 3500, image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800' }
];

export const EXTRAS = [
    { id: 'bibs', name: 'Team Bibs', sub: 'Set of 10', price: 200, icon: <Users className="h-5 w-5" /> },
    { id: 'ball', name: 'Pro Match Ball', sub: 'Size 5', price: 150, icon: <CheckCircle className="h-5 w-5" /> },
    { id: 'water', name: 'Water Case', sub: '24 Bottles', price: 800, icon: <CheckCircle className="h-5 w-5" /> }
];

export const INITIAL_EVENTS = [
    { id: 1, title: "Kitengela Super Cup", date: "2025-12-15", time: "14:00", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "Corporate League", date: "2025-11-28", time: "18:00", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=400" }
];

export const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00"
];
