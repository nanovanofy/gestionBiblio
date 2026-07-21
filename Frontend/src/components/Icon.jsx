import React from 'react';

const Icon = ({ name, size = 24, color = 'currentColor', className = '', ...props }) => {
    // Importer dynamiquement les SVG
    const getIconPath = (iconName) => {
        try {
            return require(`../assets/icons/settings/${iconName}.svg`);
        } catch (e) {
            console.warn(`Icon "${iconName}" not found`);
            return null;
        }
    };

    const iconPath = getIconPath(name);

    if (!iconPath) {
        // Fallback: utiliser un emoji si l'icône n'est pas trouvée
        return <span style={{ fontSize: size }}>❓</span>;
    }

    return (
        <img 
            src={iconPath} 
            alt={name}
            width={size}
            height={size}
            className={`icon-svg ${className}`}
            style={{ 
                filter: 'var(--icon-filter, none)',
                ...props.style 
            }}
            {...props}
        />
    );
};

export default Icon;
