import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Vérifier si l'admin est déjà connecté au chargement
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        
        if (token && adminData) {
            setIsAuthenticated(true);
            setAdmin(JSON.parse(adminData));
        }
        setLoading(false);
    }, []);

    // Fonction de login
    const login = (email, password) => {
        // Pour une démo, on utilise des identifiants fixes
        // En production, vous devriez vérifier avec votre backend
        if (email === 'admin@bibliotheque.com' && password === 'admin123') {
            const adminData = {
                id: 1,
                email: 'admin@bibliotheque.com',
                nom: 'Administrateur',
                role: 'admin'
            };
            
            localStorage.setItem('adminToken', 'fake-jwt-token-123456');
            localStorage.setItem('adminData', JSON.stringify(adminData));
            
            setIsAuthenticated(true);
            setAdmin(adminData);
            return true;
        }
        return false;
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};