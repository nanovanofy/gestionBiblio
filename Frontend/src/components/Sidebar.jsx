import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import logo from '../assets/icons/logo.svg';
import bookIcon from '../assets/icons/book.svg';
import userIcon from '../assets/icons/user.svg';
import borrowIcon from '../assets/icons/borrow.svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { adminUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Overlay pour fermer le sidebar sur mobile */}
            {isOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 998,
                        display: 'block'
                    }}
                />
            )}

            <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                    <h5 className="sidebar-title">Bibliothèque</h5>
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {adminUser?.prenom?.[0]}{adminUser?.nom?.[0]}
                    </div>
                    <div className="sidebar-user-info">
                        <strong>{adminUser?.prenom} {adminUser?.nom}</strong>
                        <small>{adminUser?.email}</small>
                    </div>
                </div>

                <Nav className="sidebar-nav flex-column">
                    <Nav.Link as={NavLink} to="/dashboard" className="sidebar-link">
                        <i className="bi bi-speedometer2"></i>
                        <span>Dashboard</span>
                    </Nav.Link>
                    
                    <Nav.Link as={NavLink} to="/" className="sidebar-link" end>
                        <img src={bookIcon} alt="Livres" />
                        <span>Livres</span>
                    </Nav.Link>
                    
                    <Nav.Link as={NavLink} to="/utilisateurs" className="sidebar-link">
                        <img src={userIcon} alt="Utilisateurs" />
                        <span>Utilisateurs</span>
                    </Nav.Link>
                    
                    <Nav.Link as={NavLink} to="/emprunts" className="sidebar-link">
                        <img src={borrowIcon} alt="Emprunts" />
                        <span>Emprunts</span>
                    </Nav.Link>
                </Nav>

                <div className="sidebar-footer">
                    <Button 
                        variant="danger" 
                        size="sm" 
                        className="w-100"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right"></i> Déconnexion
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
