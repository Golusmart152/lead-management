/**
 * Background Effects Component
 * Implements the exact polygon-based background design from the HTML template
 * with SVG polygons, angular overlays, and glass morphism effects
 */
import React, { useEffect, useState } from 'react';

interface BackgroundEffectsProps {
    children: React.ReactNode;
    className?: string;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ children, className = '' }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="relative z-10 min-h-screen">{children}</div>;
    }

    return (
        <>
            {/* SVG Polygon background */}
            <svg className="polygon-svg-bg" viewBox="0 0 1920 950" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <polygon
                    points="0,80 600,0 1100,200 900,900 200,800"
                    fill="#1a2236"
                    opacity="0.75"
                />
                <polygon
                    points="1210,230 1920,100 1900,700 1300,900 1040,600"
                    fill="#21243b"
                    opacity="0.79"
                />
                <polygon
                    points="900,700 1500,900 800,950 700,850"
                    fill="#191e33"
                    opacity="0.33"
                />
            </svg>
            
            {/* Extra overlays for style and realism */}
            <div className="overlay-shape shape1"></div>
            <div className="overlay-shape shape2"></div>
            <div className="overlay-shape shape3"></div>
            <div className="background-vignette"></div>

            {/* Content wrapper */}
            <div className={`relative z-10 min-h-screen ${className}`}>
                {children}
            </div>
        </>
    );
};

export default BackgroundEffects;