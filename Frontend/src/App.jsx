import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; 
import Login from './components/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/Dashboard';
import LivreList from './components/LivreList';
import EmpruntList from './components/EmpruntList';
import UtilisateurList from './components/UtilisateurList';
import Settings from './components/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style/theme.css';
import './App.css';

// Composant pour les routes protégées
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <MainLayout>{children}</MainLayout>;
};

const AppContent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <LivreList />
                    </ProtectedRoute>
                } />
                
                <Route path="/utilisateurs" element={
                    <ProtectedRoute>
                        <UtilisateurList />
                    </ProtectedRoute>
                } />
                
                <Route path="/emprunts" element={
                    <ProtectedRoute>
                        <EmpruntList />
                    </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

function App() {
    return (
        // ✅ Ordre correct: AuthProvider puis ThemeProvider
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;