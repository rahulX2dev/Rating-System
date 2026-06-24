import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { validateName, validateEmail, validatePassword, validateAddress, getPasswordStrength } from '../utils/validation';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        const newErrors = {};
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const addressError = validateAddress(formData.address);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
        if (addressError) newErrors.address = addressError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setErrors({ submit: err.response?.data?.message || 'Failed to register.' });
        }
    };

    const getBarsToColor = (strength) => {
        if (strength <= 0) return 0;
        if (strength <= 2) return 1;
        if (strength === 3) return 2;
        return 3;
    };
    const barsToColor = getBarsToColor(passwordStrength.strength);

    return (
        <div className="auth-page">
            <div className="auth-glow-mesh auth-glow-mesh-1"></div>
            <div className="auth-glow-mesh auth-glow-mesh-2"></div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo-wrapper">
                            <svg className="auth-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                            </svg>
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join us to start rating stores</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-icon-wrapper">
                                <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name (20-60 characters)"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="auth-input"
                                />
                            </div>
                            {errors.name && <small style={{ color: '#fca5a5', marginTop: '0.2rem', display: 'block' }}>{errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="auth-input"
                                />
                            </div>
                            {errors.email && <small style={{ color: '#fca5a5', marginTop: '0.2rem', display: 'block' }}>{errors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-icon-wrapper">
                                <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="auth-input auth-input-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle-btn"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="password-toggle-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg className="password-toggle-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <small className="input-hint">8-16 characters, 1 uppercase, 1 number, 1 special character (!@#$&*)</small>
                            {formData.password && (
                                <div style={{ marginTop: '0.6rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: passwordStrength.color, fontWeight: '700' }}>
                                        Password Strength: {passwordStrength.label}
                                    </span>
                                    <div className="strength-bar-container">
                                        <div className="strength-bar" style={{ backgroundColor: barsToColor >= 1 ? passwordStrength.color : 'rgba(255, 255, 255, 0.06)' }}></div>
                                        <div className="strength-bar" style={{ backgroundColor: barsToColor >= 2 ? passwordStrength.color : 'rgba(255, 255, 255, 0.06)' }}></div>
                                        <div className="strength-bar" style={{ backgroundColor: barsToColor >= 3 ? passwordStrength.color : 'rgba(255, 255, 255, 0.06)' }}></div>
                                    </div>
                                </div>
                            )}
                            {errors.password && <small style={{ color: '#fca5a5', marginTop: '0.2rem', display: 'block' }}>{errors.password}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address (Optional)</label>
                            <div className="input-icon-wrapper">
                                <svg className="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter your address (max 400 characters)"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="auth-input"
                                ></textarea>
                            </div>
                            {errors.address && <small style={{ color: '#fca5a5', marginTop: '0.2rem', display: 'block' }}>{errors.address}</small>}
                        </div>

                        {errors.submit && (
                            <div className="error-message">
                                <span>⚠️ {errors.submit}</span>
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                <span>✅ {success}</span>
                            </div>
                        )}

                        <button type="submit" className="auth-button">
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
                        <Link to="/" className="auth-link-secondary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
