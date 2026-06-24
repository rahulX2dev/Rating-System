import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Icon from '../../components/Icon';
import StarRating from '../../components/StarRating';
import './StoreList.css';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchStores();
    }, [search, sort, order]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const params = { search, sort, order };
            const { data } = await api.get('/stores', { params });
            setStores(data);
            setError('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch stores.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (storeId, rating) => {
        try {
            await api.post(`/stores/${storeId}/rate`, { rating });
            setStores(stores.map(s => s.id === storeId ? { ...s, my_rating: rating } : s));
        } catch (err) {
            setError('Failed to submit rating. Please try again.');
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return '#34d399';
        if (rating >= 3.5) return '#fbbf24';
        return '#f87171';
    };

    const Background = () => (
        <div className="dashboard-bg" aria-hidden="true">
            <span className="glow-blob b1" />
            <span className="glow-blob b2" />
            <span className="glow-blob b3" />
        </div>
    );

    return (
        <div className="store-list-container">
            <Background />

            <div className="store-list-header premium-glass">
                <div>
                    <span className="store-eyebrow">
                        <Icon name="store" size={13} color="#a5b4fc" />
                        Discover
                    </span>
                    <h1 className="page-title">Discover Amazing Stores</h1>
                    <p className="page-subtitle">Find and rate your favorite local businesses</p>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <Icon name="store" size={20} color="#818cf8" />
                        <span className="stat-number">{stores.length}</span>
                        <span className="stat-label">Stores</span>
                    </div>
                </div>
            </div>

            <div className="search-filter-bar premium-glass">
                <div className="search-container">
                    <Icon name="search" size={20} color="#6366f1" className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search stores by name or address..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="clear-search" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>

                <div className="filter-controls">
                    <select
                        className="sort-select"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="name">Sort by Name</option>
                        <option value="overall_rating">Sort by Rating</option>
                        <option value="address">Sort by Location</option>
                    </select>

                    <button
                        className="order-toggle"
                        onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')}
                        title={`Sort ${order === 'ASC' ? 'ascending' : 'descending'}`}
                    >
                        {order === 'ASC' ? '↑' : '↓'}
                    </button>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >
                            <Icon name="grid" size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            <Icon name="list" size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="stores-grid">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="premium-skeleton skeleton-store" />
                    ))}
                </div>
            )}

            {error && (
                <div className="error-banner premium-glass">
                    <Icon name="bolt" size={18} color="#fca5a5" />
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && (
                <div className={`stores-${viewMode}`}>
                    {stores.length === 0 ? (
                        <div className="empty-state premium-glass">
                            <div className="empty-icon-wrap">
                                <Icon name="store" size={42} color="#475569" />
                            </div>
                            <h3>No stores found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        stores.map((store, index) => (
                            <div
                                key={store.id}
                                className={`store-card premium-glass gradient-border ${viewMode}`}
                                style={{ animationDelay: `${index * 0.07}s` }}
                            >
                                <div className="store-header">
                                    <div className="store-icon">
                                        <Icon name="store" size={26} color="#fff" />
                                    </div>
                                    <div className="store-info">
                                        <h3 className="store-name">{store.name}</h3>
                                        <p className="store-address">
                                            <Icon name="mapPin" size={13} color="#94a3b8" />
                                            {store.address}
                                        </p>
                                        <p className="store-email">
                                            <Icon name="mail" size={13} color="#94a3b8" />
                                            {store.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="store-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Average Rating</span>
                                        <div className="rating-badge" style={{
                                            backgroundColor: getRatingColor(parseFloat(store.overall_rating)) + '1f',
                                            color: getRatingColor(parseFloat(store.overall_rating)),
                                            borderColor: getRatingColor(parseFloat(store.overall_rating)) + '40'
                                        }}>
                                            <Icon name="starFilled" size={13} color={getRatingColor(parseFloat(store.overall_rating))} filled />
                                            <span className="rating-value">
                                                {parseFloat(store.overall_rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="stat-item">
                                        <span className="stat-label">Your Rating</span>
                                        <span className={`your-rating ${store.my_rating ? 'rated' : 'not-rated'}`}>
                                            {store.my_rating ? `${store.my_rating}/5` : 'Not rated yet'}
                                        </span>
                                    </div>
                                </div>

                                <div className="store-actions">
                                    <div className="rating-section">
                                        <label>Rate this store</label>
                                        <StarRating
                                            rating={store.my_rating || 0}
                                            onRate={(rating) => handleRating(store.id, rating)}
                                            size={28}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StoreList;
