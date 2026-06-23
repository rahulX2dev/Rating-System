import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedStore, setSelectedStore] = useState('electronics');
    const [userRating, setUserRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [storeData] = useState({
        electronics: {
            name: 'Premium Electronics Superstore',
            category: 'Technology',
            rating: 4.8,
            reviewsCount: 142,
            address: '101 Silicon Valley Blvd',
            recentReviews: [
                { name: 'Alex Miller', rating: 5, text: 'Incredible customer support and top-tier selection!' },
                { name: 'Sarah Thompson', rating: 4, text: 'Great gadgets, though checkout queue was slightly long.' }
            ]
        },
        foodmarket: {
            name: 'Gourmet Food Market Place',
            category: 'Groceries',
            rating: 4.6,
            reviewsCount: 98,
            address: '202 Organic Market Way',
            recentReviews: [
                { name: 'David Brown', rating: 5, text: 'Fresh organic greens and delicious bakery items.' },
                { name: 'Emma Watson', rating: 4, text: 'Excellent cheese selection. Love the local produce section.' }
            ]
        },
        fashion: {
            name: 'Fashion Boutique Collections',
            category: 'Apparel',
            rating: 4.7,
            reviewsCount: 115,
            address: '303 Vogue Ave',
            recentReviews: [
                { name: 'Jessica K.', rating: 5, text: 'Absolutely gorgeous summer dresses! Worth every dollar.' },
                { name: 'Michael J.', rating: 4, text: 'Friendly staff and very high-quality materials.' }
            ]
        }
    });

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleRatingSubmit = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    const handleStarClick = () => {
        navigate('/signup');
    };

    const filteredStores = Object.entries(storeData).filter(([key, store]) => {
        const query = searchQuery.toLowerCase();
        return store.name.toLowerCase().includes(query) ||
               store.category.toLowerCase().includes(query) ||
               store.address.toLowerCase().includes(query);
    });

    return (
        <div className="landing-page-premium">
            <div className="glow-mesh glow-mesh-1"></div>
            <div className="glow-mesh glow-mesh-2"></div>
            <div className="glow-mesh glow-mesh-3"></div>

            <section className="hero-premium">
                <div className="hero-container">
                    <div className="hero-text">
                        <div className="badge-glow">
                            <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span>REVOLUTIONIZING TRUST & RATINGS</span>
                        </div>
                        <h1 className="hero-title-premium">
                            Find & Rate the <br />
                            <span className="gradient-highlight">Finest Retailers</span>
                        </h1>
                        <p className="hero-subtitle-premium">
                            Discover verified local retailers, submit transparent ratings, and help neighbors make informed purchase decisions. Structured for speed, protected by authorization.
                        </p>
                        <div className="hero-action-buttons">
                            <Link to="/signup" className="btn-glow-primary">
                                Get Started Free
                                <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                            <Link to="/login" className="btn-glass-secondary">Sign In</Link>
                        </div>
                    </div>

                    <div className="hero-interactive-dashboard">
                        <div className="glass-dashboard-card">
                            <div className="card-glowing-border"></div>
                            <div className="card-top-header">
                                <span className="pulse-dot"></span>
                                <h4>LIVE RATINGS SIMULATOR</h4>
                            </div>

                            <div className="interactive-metric-row">
                                <div className="metric-box">
                                    <span className="metric-num">4.8★</span>
                                    <span className="metric-label">Average Score</span>
                                </div>
                                <div className="metric-box">
                                    <span className="metric-num">15.4k</span>
                                    <span className="metric-label">Submissions</span>
                                </div>
                                <div className="metric-box">
                                    <span className="metric-num">99.8%</span>
                                    <span className="metric-label">Verified Accounts</span>
                                </div>
                            </div>

                            <div className="ratings-simulator-box">
                                <h5>Test Drive the Simulator</h5>
                                <form onSubmit={handleRatingSubmit} className="simulator-form">
                                    <div className="form-row-compact">
                                        <select
                                            value={selectedStore}
                                            onChange={(e) => setSelectedStore(e.target.value)}
                                            className="select-premium"
                                        >
                                            <option value="electronics">Premium Electronics</option>
                                            <option value="foodmarket">Gourmet Food Market</option>
                                            <option value="fashion">Fashion Boutique</option>
                                        </select>

                                        <div className="star-rating-select">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={handleStarClick}
                                                    className={star <= userRating ? 'star-btn active' : 'star-btn'}
                                                >
                                                    <svg className="star-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="input-group-submit">
                                        <input
                                            type="text"
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="Write an opinion..."
                                            className="input-premium-txt"
                                        />
                                        <button type="submit" className="btn-sim-submit">
                                            Rate Now
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="live-demo-section">
                <div className="section-head-premium">
                    <span className="section-eyebrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Live Directory
                    </span>
                    <h2 className="section-title-premium">Explore Rated <span className="gradient-highlight">Stores</span></h2>
                    <p className="section-subtitle-premium">Search and filter a simulated directory of verified retailers in real time below.</p>
                </div>

                <div className="demo-search-wrapper">
                    <div className="search-bar-premium">
                        <svg className="search-icon-svg-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search technology, groceries, fashion, avenue..."
                            className="search-input-premium"
                        />
                    </div>

                    <div className="demo-stores-grid">
                        {filteredStores.map(([key, store]) => (
                            <div key={key} className="demo-store-card">
                                <div className="card-badge-cat">{store.category}</div>
                                <h3>{store.name}</h3>
                                <p className="store-address-txt">
                                    <svg className="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {store.address}
                                </p>
                                <div className="card-rating-row">
                                    <span className="star-display">
                                        <svg className="star-small" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                        <span>{store.rating}</span>
                                    </span>
                                    <span className="count-display">Based on {store.reviewsCount} verified reports</span>
                                </div>
                                <div className="card-reviews-preview">
                                    <h4>LATEST EVALUATIONS</h4>
                                    {store.recentReviews.map((rev, i) => (
                                        <div key={i} className="review-preview-item">
                                            <div className="rev-user-header">
                                                <span className="rev-user">{rev.name}</span>
                                                <span className="rev-stars">
                                                    {'★'.repeat(rev.rating)}
                                                </span>
                                            </div>
                                            <p className="rev-text">"{rev.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {filteredStores.length === 0 && (
                            <div className="no-results-premium">
                                <p>No matching stores found in the directory.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="features-premium-section">
                <div className="section-head-premium">
                    <span className="section-eyebrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        Why Choose Us
                    </span>
                    <h2 className="section-title-premium">Built for <span className="gradient-highlight">Modern Businesses</span></h2>
                    <p className="section-subtitle-premium">Everything you need to maintain authentic feedback and review metrics at scale.</p>
                </div>

                <div className="features-glass-grid">
                    <div className="feature-premium-card">
                        <div className="feature-icon-wrapper">
                            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 11l2 2 4-4" />
                            </svg>
                        </div>
                        <h3>Verified Feedback</h3>
                        <p>Strict role validation limits reviews to authenticated customers. Fake account activities are blocked by design.</p>
                    </div>

                    <div className="feature-premium-card">
                        <div className="feature-icon-wrapper">
                            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                        </div>
                        <h3>Realtime Sync</h3>
                        <p>Ratings and store averages update immediately. No lag, no stale calculations across dashboard sections.</p>
                    </div>

                    <div className="feature-premium-card">
                        <div className="feature-icon-wrapper">
                            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h3>Secured Database</h3>
                        <p>Powered by Neon PostgreSQL and Prisma ORM. Queries are isolated, clean, and run under strict authorization.</p>
                    </div>

                    <div className="feature-premium-card">
                        <div className="feature-icon-wrapper">
                            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </div>
                        <h3>Business Analytics</h3>
                        <p>Store owners get dedicated dashboards detailing metrics, rating changes, and customer profiles lists.</p>
                    </div>
                </div>
            </section>

            <section className="cta-premium-section">
                <div className="cta-premium-content">
                    <span className="section-eyebrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Get Started
                    </span>
                    <h2>Upgrade Your <span className="gradient-highlight">Review Infrastructure</span></h2>
                    <p>Begin evaluating your favorite stores today. Business owners can register their storefront details in clicks.</p>
                    <div className="cta-action-row">
                        <Link to="/signup" className="btn-glow-primary large">Create Your Free Account</Link>
                    </div>
                </div>
            </section>

            <footer className="footer-premium">
                <div className="footer-grid-premium">
                    <div className="footer-col">
                        <h3>Rating Platform</h3>
                        <p>Building high-quality bridges between verified users and local stores since 2025.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform Access</h4>
                        <Link to="/login">Customer Login</Link>
                        <Link to="/signup">Register Account</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Business Portals</h4>
                        <Link to="/owner/login">Store Owner Portal</Link>
                        <Link to="/admin/login">Administrator Access</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Corporate</h4>
                        <p>info@ratingplatform.com</p>
                        <p>(555) 123-4567</p>
                    </div>
                </div>
                <div className="footer-bar-premium">
                    <p>&copy; 2025 Rating Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
