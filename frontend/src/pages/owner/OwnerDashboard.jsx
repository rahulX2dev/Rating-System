import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Icon from '../../components/Icon';
import './OwnerDashboard.css';

const InlineStars = ({ count, size = 14 }) => (
    <span className="inline-stars" aria-label={`${count} stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" size={size} color={i < count ? '#fbbf24' : 'rgba(148,163,184,0.25)'} filled={i < count} />
        ))}
    </span>
);

const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/owner/dashboard');
                setDashboardData(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const Background = () => (
        <div className="dashboard-bg" aria-hidden="true">
            <span className="glow-blob b1" />
            <span className="glow-blob b2" />
            <span className="glow-blob b3" />
        </div>
    );

    if (loading) {
        return (
            <div className="owner-dashboard">
                <Background />
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
            <div className="owner-dashboard">
                <Background />
                <div className="owner-error">
                    <Icon name="bolt" size={22} color="#fca5a5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const avgRating = dashboardData?.averageRating ? Number(dashboardData.averageRating).toFixed(2) : '0.00';
    const totalRatings = dashboardData?.ratings?.length || 0;
    const recentRatings = dashboardData?.ratings?.slice(0, 5) || [];

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dashboardData?.ratings?.forEach(rating => {
        if (rating.rating >= 1 && rating.rating <= 5) {
            ratingCounts[rating.rating]++;
        }
    });

    const statCards = [
        {
            title: 'Average Rating',
            value: avgRating,
            iconName: 'starFilled',
            color: '#fbbf24',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            subtitle: 'Overall customer satisfaction'
        },
        {
            title: 'Total Ratings',
            value: totalRatings,
            iconName: 'barChart',
            color: '#818cf8',
            gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            subtitle: 'Ratings received'
        },
        {
            title: '5-Star Ratings',
            value: ratingCounts[5],
            iconName: 'sparkle',
            color: '#34d399',
            gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            subtitle: `${totalRatings > 0 ? ((ratingCounts[5] / totalRatings) * 100).toFixed(0) : 0}% of total`
        },
        {
            title: 'Satisfaction Rate',
            value: totalRatings > 0 ? `${(((ratingCounts[5] + ratingCounts[4]) / totalRatings) * 100).toFixed(0)}%` : '0%',
            iconName: 'activity',
            color: '#c084fc',
            gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
            subtitle: '4+ star ratings'
        }
    ];

    const avgNum = Number(avgRating) || 0;
    const R = 52;
    const CIRC = 2 * Math.PI * R;
    const dashOffset = CIRC * (1 - avgNum / 5);

    return (
        <div className="owner-dashboard">
            <Background />

            <div className="dashboard-header">
                <div>
                    <span className="dashboard-eyebrow">
                        <Icon name="store" size={13} color="#86efac" />
                        Store Owner
                    </span>
                    <h1 className="dashboard-title">Owner Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Track your store's performance and customer feedback
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary">
                        <Icon name="trendingUp" size={18} color="#fff" />
                        <span>View Analytics</span>
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
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
                            <div className="stat-subtitle">
                                <span>{stat.subtitle}</span>
                            </div>
                        </div>
                        <div className="stat-decoration" style={{ background: `${stat.color}15` }}></div>
                    </div>
                ))}
            </div>

            <div className="rating-hero premium-glass gradient-border">
                <div className="rating-gauge-block">
                    <span className="block-label">
                        <Icon name="starFilled" size={14} color="#fbbf24" filled />
                        Average Rating
                    </span>
                    <div className="rating-gauge">
                        <svg viewBox="0 0 140 140" className="rating-gauge-svg">
                            <defs>
                                <linearGradient id="avgGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                            <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                            <circle
                                cx="70" cy="70" r={R} fill="none" stroke="url(#avgGrad)" strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={CIRC}
                                strokeDashoffset={dashOffset}
                                transform="rotate(-90 70 70)"
                                className="rating-gauge-arc"
                            />
                        </svg>
                        <div className="rating-gauge-center">
                            <span className="rating-gauge-num">{avgRating}</span>
                            <span className="rating-gauge-max">out of 5</span>
                            <div className="rating-gauge-stars">
                                <InlineStars count={Math.round(avgNum)} size={13} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rating-distribution">
                    <span className="block-label">
                        <Icon name="chart" size={14} color="#818cf8" />
                        Rating Distribution
                    </span>
                    <div className="rating-bars">
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = ratingCounts[star];
                            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                            const fillClass = star >= 4 ? 'good' : star >= 3 ? 'mid' : 'low';
                            return (
                                <div key={star} className="rating-bar-row">
                                    <span className="rating-star-label">
                                        {star}
                                        <Icon name="star" size={13} color="#fbbf24" filled />
                                    </span>
                                    <div className="rating-bar-container">
                                        <div
                                            className={`rating-bar-fill ${fillClass}`}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <span className="rating-bar-pct">
                                                {totalRatings > 0 ? percentage.toFixed(0) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <span className="rating-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="ratings-table-card premium-glass">
                <h3 className="card-title">
                    <Icon name="inbox" size={18} color="#a5b4fc" />
                    Recent Customer Ratings
                </h3>
                {dashboardData.ratings && dashboardData.ratings.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="ratings-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRatings.map(rating => (
                                    <tr key={rating.id}>
                                        <td>
                                            <div className="customer-info">
                                                <div className="customer-avatar">
                                                    {rating.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="customer-name">{rating.name}</div>
                                                    <div className="customer-email">{rating.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="rating-display">
                                                <InlineStars count={rating.rating} size={14} />
                                                <span className="rating-number">{rating.rating}/5</span>
                                            </div>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(rating.updated_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {dashboardData.ratings.length > 5 && (
                            <div className="view-all-link">
                                <button className="btn-secondary">
                                    View All {dashboardData.ratings.length} Ratings
                                    <Icon name="arrowRight" size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon-wrap">
                            <Icon name="inbox" size={40} color="#475569" />
                        </div>
                        <p>No ratings received yet</p>
                        <span className="empty-subtitle">
                            Customers will leave ratings after visiting your store
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
