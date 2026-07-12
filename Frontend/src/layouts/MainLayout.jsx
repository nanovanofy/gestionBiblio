import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="main-layout">
            {/* Bouton hamburger pour mobile */}
            <Button 
                variant="success" 
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
            >
                <i className="bi bi-list"></i>
            </Button>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Contenu principal */}
            <div className={`main-content ${sidebarOpen ? 'main-content-shifted' : ''}`}>
                <Container fluid className="main-container">
                    {children}
                </Container>
            </div>
        </div>
    );
};

export default MainLayout;
