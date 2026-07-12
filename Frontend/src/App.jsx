import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoutes';
import LivreList from './components/LivreList';
import LivreForm from './components/LivreForm';
import EmpruntList from './components/EmpruntList';
import UtilisateurList from './components/UtilisateurList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Composant principal avec les routes protégées
const AppContent = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App">
            <Navigation />
            <Container fluid>
                <Routes>
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/" /> : <Login />
                    } />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Row>
                                <Col lg={8}>
                                    <LivreList />
                                </Col>
                                <Col lg={4}>
                                    <LivreForm onSuccess={() => window.location.reload()} />
                                </Col>
                            </Row>
                        </PrivateRoute>
                    } />
                    <Route path="/utilisateurs" element={
                        <PrivateRoute>
                            <UtilisateurList />
                        </PrivateRoute>
                    } />
                    <Route path="/emprunts" element={
                        <PrivateRoute>
                            <EmpruntList />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Container>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;