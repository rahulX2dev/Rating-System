import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Icon from './Icon';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `navbar-link ${isActive ? 'active' : ''}`;

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="navbar-brand-mark">
                    <Icon name="star" size={18} color="#fff" filled />
                </span>
                <h1>Rating Platform</h1>
            </Link>

            <div className="navbar-right">
                {user ? (
                    <>
                        <div className="navbar-links">
                            {user.role === 'admin' && (
                                <>
                                    <NavLink to="/admin" className={navLinkClass} end>Dashboard</NavLink>
                                    <NavLink to="/admin/users" className={navLinkClass}>Users</NavLink>
                                    <NavLink to="/admin/stores" className={navLinkClass}>Stores</NavLink>
                                </>
                            )}
                            {user.role === 'user' && (
                                <NavLink to="/stores" className={navLinkClass}>Browse Stores</NavLink>
                            )}
                            {user.role === 'store_owner' && (
                                <NavLink to="/owner" className={navLinkClass}>My Dashboard</NavLink>
                            )}
                        </div>

                        <div className="navbar-user">
                            <div className="navbar-avatar" title={user.email}>
                                {initial}
                            </div>
                            <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
                                <Icon name="logOut" size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">Login</Link>
                        <Link to="/signup" className="navbar-signup-btn">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
