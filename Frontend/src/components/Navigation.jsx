import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/icons/logo.svg';
import bookIcon from '../assets/icons/book.svg';
import userIcon from '../assets/icons/user.svg';
import borrowIcon from '../assets/icons/borrow.svg';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, admin, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                        alt="Logo Bibliothèque"
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    <span>Gestion de Bibliothèque</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
                            <img src={bookIcon} width="20" height="20" className="me-1" alt="Livres" />
                            Livres
                        </Nav.Link>
                        <Nav.Link as={Link} to="/utilisateurs" className={location.pathname === '/utilisateurs' ? 'active' : ''}>
                            <img src={userIcon} width="20" height="20" className="me-1" alt="Utilisateurs" />
                            Utilisateurs
                        </Nav.Link>
                        <Nav.Link as={Link} to="/emprunts" className={location.pathname === '/emprunts' ? 'active' : ''}>
                            <img src={borrowIcon} width="20" height="20" className="me-1" alt="Emprunts" />
                            Emprunts
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex align-items-center ms-3">
                        <Badge bg="info" className="me-2">
                            {admin?.nom || 'Admin'}
                        </Badge>
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={handleLogout}
                        >
                            Déconnexion
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;