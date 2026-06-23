import React, { useState } from 'react';

/**
 * Premium star rating component built with inline SVG stars.
 * Keeps the exact same API ({ rating, onRate }) so consumers are untouched.
 */
const StarRating = ({ rating = 0, onRate, size = 32, readOnly = false }) => {
    const [hover, setHover] = useState(0);
    const activeValue = hover || rating;

    return (
        <div className="star-rating-premium" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= activeValue;
                return (
                    <button
                        type="button"
                        key={value}
                        className={`star-btn-premium ${active ? 'is-active' : 'is-idle'}`}
                        onClick={() => !readOnly && onRate?.(value)}
                        onMouseEnter={() => !readOnly && setHover(value)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        disabled={readOnly}
                        aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    >
                        <svg
                            width={size}
                            height={size}
                            viewBox="0 0 24 24"
                            className="star-svg-premium"
                            fill={active ? 'url(#starGradFill)' : 'none'}
                            stroke={active ? 'none' : 'currentColor'}
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                        >
                            <defs>
                                <linearGradient id="starGradFill" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
