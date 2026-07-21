import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme doit être utilisé dans un ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const defaultSettings = {
        theme: 'light',
        sidebarCollapsed: false,
        animations: true,
        compactMode: false,
        fontSize: 'medium',
        notifications: true,
        language: 'fr'
    };

    const loadSettings = () => {
        try {
            const saved = localStorage.getItem('appSettings');
            if (saved) {
                return { ...defaultSettings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Erreur chargement paramètres:', error);
        }
        return defaultSettings;
    };

    const [settings, setSettings] = useState(loadSettings);
    const [isDark, setIsDark] = useState(settings.theme === 'dark');

    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        document.documentElement.setAttribute('data-theme', settings.theme);
        setIsDark(settings.theme === 'dark');

        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[settings.fontSize] || '16px';

        if (settings.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }

        if (!settings.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }

        document.documentElement.lang = settings.language;
    }, [settings]);

    const toggleTheme = () => {
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        setSettings(prev => ({ ...prev, theme: newTheme }));
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('appSettings');
    };

    const value = {
        settings,
        isDark,
        toggleTheme,
        updateSetting,
        resetSettings,
        theme: settings.theme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
