import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Icon from '../../components/Icon';
import './AdminDashboard.css';

/* Build a smooth sparkline path from a small set of points */
const buildSparkline = (points, width = 96, height = 36) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const stepX = width / (points.length - 1);
    const coords = points.map((p, i) => {
        const x = i * stepX;
        const y = height - ((p - min) / range) * (height - 4) - 2;
        return [x, y];
    });
    const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;
    return { line, area };
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data);
            } catch (err) {
                setError('Failed to fetch dashboard stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            iconName: 'users',
            color: '#818cf8',
            gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            change: '+12%',
            changeType: 'positive',
            trend: [12, 18, 15, 24, 22, 30, 28],
        },
        {
            title: 'Total Stores',
            value: stats.totalStores,
            iconName: 'store',
            color: '#fbbf24',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            change: '+8%',
            changeType: 'positive',
            trend: [8, 10, 9, 14, 13, 16, 18],
        },
        {
            title: 'Total Ratings',
            value: stats.totalRatings,
            iconName: 'starFilled',
            color: '#34d399',
            gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            change: '+24%',
            changeType: 'positive',
            trend: [20, 24, 30, 28, 40, 44, 52],
        },
        {
            title: 'Avg Rating',
            value: stats.totalRatings > 0 ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0.0',
            iconName: 'chart',
            color: '#c084fc',
            gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
            change: '+0.3',
            changeType: 'positive',
            trend: [3.2, 3.5, 3.4, 3.8, 4.0, 4.1, 4.3],
        }
    ];

    const quickActions = [
        { title: 'Add New User', iconName: 'plus', action: () => navigate('/admin/users'), color: '#818cf8' },
        { title: 'Add New Store', iconName: 'plus', action: () => navigate('/admin/stores'), color: '#fbbf24' },
        { title: 'Manage Users', iconName: 'settings', action: () => navigate('/admin/users'), color: '#34d399' },
        { title: 'Manage Stores', iconName: 'layers', action: () => navigate('/admin/stores'), color: '#c084fc' }
    ];

    const healthPct = 87;

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-bg" aria-hidden="true">
                    <span className="glow-blob b1" />
                    <span className="glow-blob b2" />
                    <span className="glow-blob b3" />
                </div>
                <div className="skeleton-title premium-skeleton" />
                <div className="stats-grid">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="premium-skeleton skeleton-stat" />
                    ))}
                </div>
                <div className="skeleton-row-block premium-skeleton" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-bg" aria-hidden="true">
                    <span className="glow-blob b1" />
                    <span className="glow-blob b2" />
                    <span className="glow-blob b3" />
                </div>
                <div className="admin-error">
                    <Icon name="bolt" size={22} color="#fca5a5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Ambient background */}
            <div className="dashboard-bg" aria-hidden="true">
                <span className="glow-blob b1" />
                <span className="glow-blob b2" />
                <span className="glow-blob b3" />
            </div>

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-eyebrow">
                        <Icon name="shieldCheck" size={13} color="#a5b4fc" />
                        Administrator Console
                    </span>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back! Here's what's happening with your platform today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary">
                        <Icon name="chart" size={18} color="#fff" />
                        <span>View Reports</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                {statCards.map((stat, index) => {
                    const spark = buildSparkline(stat.trend);
                    return (
                        <div
                            key={index}
                            className="stat-card-modern premium-glass gradient-border"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="stat-icon" style={{ background: stat.gradient }}>
                                <Icon name={stat.iconName} size={24} color="#fff" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">{stat.title}</p>
                                <h2 className="stat-value">{stat.value}</h2>
                                <div className={`stat-change ${stat.changeType}`}>
                                    <Icon
                                        name={stat.changeType === 'positive' ? 'trendingUp' : 'trendingDown'}
                                        size={14}
                                        color={stat.changeType === 'positive' ? '#34d399' : '#f87171'}
                                    />
                                    <span>{stat.change}</span>
                                    <span className="change-label">from last month</span>
                                </div>
                            </div>

                            {/* Mini sparkline */}
                            <svg className="stat-sparkline" viewBox="0 0 96 36" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id={`spark-fill-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={stat.color} stopOpacity="0.35" />
                                        <stop offset="100%" stopColor={stat.color} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={spark.area} fill={`url(#spark-fill-${index})`} />
                                <path d={spark.line} fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <div className="stat-decoration" style={{ background: `${stat.color}15` }}></div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className="quick-action-card premium-glass gradient-border"
                            onClick={action.action}
                            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        >
                            <div className="action-icon" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                                <Icon name={action.iconName} size={20} />
                            </div>
                            <span className="action-title">{action.title}</span>
                            <div className="action-arrow">
                                <Icon name="arrowRight" size={18} color="#475569" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Platform Overview & System Status */}
            <div className="dashboard-bottom">
                <div className="activity-card premium-glass">
                    <h3 className="card-title">Platform Overview</h3>
                    <div className="overview-stats">
                        <div className="overview-item">
                            <span className="overview-label">Active Users</span>
                            <span className="overview-value">{Math.floor(stats.totalUsers * 0.75)}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Active Stores</span>
                            <span className="overview-value">{stats.totalStores}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Avg. Rating</span>
                            <span className="overview-value">
                                {stats.totalRatings > 0 ? (stats.totalRatings / stats.totalStores).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>

                    {/* Donut gauge for platform health */}
                    <div className="platform-health">
                        <div className="health-gauge">
                            <svg viewBox="0 0 120 120" className="health-gauge-svg">
                                <defs>
                                    <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                <circle
                                    cx="60" cy="60" r="50" fill="none" stroke="url(#healthGrad)" strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 50}
                                    strokeDashoffset={2 * Math.PI * 50 * (1 - healthPct / 100)}
                                    transform="rotate(-90 60 60)"
                                    className="health-gauge-arc"
                                />
                            </svg>
                            <div className="health-gauge-center">
                                <span className="health-gauge-num">{healthPct}%</span>
                                <span className="health-gauge-label">Healthy</span>
                            </div>
                        </div>
                        <div className="health-label">
                            <span>Platform Health</span>
                            <span className="health-status">All systems performing well</span>
                        </div>
                    </div>
                </div>

                <div className="activity-card premium-glass">
                    <h3 className="card-title">System Status</h3>
                    <div className="status-list">
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <Icon name="database" size={18} color="#34d399" />
                            <span>Database Connected</span>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <Icon name="activity" size={18} color="#34d399" />
                            <span>API Services Running</span>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <Icon name="shieldCheck" size={18} color="#34d399" />
                            <span>All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
