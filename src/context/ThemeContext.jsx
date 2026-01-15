
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DARK_THEME, LIGHT_THEME } from '../data/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // You can add local storage persistence here later if you want

    const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
