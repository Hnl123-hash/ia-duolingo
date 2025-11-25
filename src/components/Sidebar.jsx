import React from 'react';

const Sidebar = ({ currentView, onViewChange }) => {
    const navItems = [
        { id: 'home', label: 'Início', icon: '🏠' },
        { id: 'learn', label: 'Aprender', icon: '📚' },
        { id: 'theory', label: 'Resumos', icon: '🧠' },
    ];

    return (
        <aside className="sidebar">
            <div className="logo">LingoAI</div>
            <nav>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
