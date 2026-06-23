import React from 'react';

/**
 * Premium inline SVG icon set (no emoji, no dependencies).
 * Usage: <Icon name="star" size={24} color="#fbbf24" />
 * Icons use currentColor by default so they inherit `color`.
 */
const paths = {
    users: (
        <>
            <path d="M17 20h5v-2a4 4 0 0 0-3-3.87" />
            <path d="M9 20H4v-2a4 4 0 0 1 3-3.87" />
            <circle cx="12" cy="7" r="4" />
            <path d="M17 11a3 3 0 0 0 0-6" />
        </>
    ),
    store: (
        <>
            <path d="M3 9l1.5-5h15L21 9" />
            <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
            <path d="M9 21v-6h6v6" />
            <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        </>
    ),
    star: (
        <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    ),
    starFilled: (
        <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    ),
    chart: (
        <>
            <path d="M3 3v18h18" />
            <path d="M7 15l3-4 3 3 4-6" />
        </>
    ),
    trendingUp: (
        <>
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
        </>
    ),
    trendingDown: (
        <>
            <polyline points="3 7 9 13 13 9 21 17" />
            <polyline points="14 17 21 17 21 10" />
        </>
    ),
    plus: (
        <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </>
    ),
    bolt: <path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />,
    shieldCheck: (
        <>
            <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
            <polyline points="9 12 11 14 15 10" />
        </>
    ),
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </>
    ),
    grid: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
    ),
    list: (
        <>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3.5" cy="6" r="1" />
            <circle cx="3.5" cy="12" r="1" />
            <circle cx="3.5" cy="18" r="1" />
        </>
    ),
    arrowRight: (
        <>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </>
    ),
    database: (
        <>
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </>
    ),
    mail: (
        <>
            <rect x="2" y="4" width="20" height="16" rx="2.5" />
            <polyline points="2.5 6 12 13 21.5 6" />
        </>
    ),
    mapPin: (
        <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </>
    ),
    inbox: (
        <>
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </>
    ),
    logOut: (
        <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </>
    ),
    sparkle: (
        <path d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8L12 2z" />
    ),
    layers: (
        <>
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </>
    ),
    barChart: (
        <>
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
        </>
    ),
    refresh: (
        <>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </>
    ),
};

const Icon = ({ name, size = 24, color = 'currentColor', strokeWidth = 1.8, filled = false, className = '', style = {} }) => {
    const content = paths[name];
    if (!content) return null;

    const isFilled = name === 'starFilled' || filled;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={isFilled ? color : 'none'}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`premium-icon premium-icon-${name} ${className}`}
            style={style}
            aria-hidden="true"
        >
            {content}
        </svg>
    );
};

export default Icon;
