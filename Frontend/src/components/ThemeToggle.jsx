import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ variant = 'light', size = 'sm' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip>
                    {isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                </Tooltip>
            }
        >
            <Button
                variant={variant}
                size={size}
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '8px 16px'
                }}
            >
                <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
                <span style={{ fontSize: '0.85rem' }}>
                    {isDark ? 'Clair' : 'Sombre'}
                </span>
            </Button>
        </OverlayTrigger>
    );
};

export default ThemeToggle;
