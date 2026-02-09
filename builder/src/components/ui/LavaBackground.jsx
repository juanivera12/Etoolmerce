import React from 'react';
import './LavaBackground.css';

const LavaBackground = ({ config }) => {
    const {
        colors = ['#A855F7', '#3B82F6', '#EC4899', '#06B6D4', '#F97316'], // Default colors
        blur = 100, // Default blur in px
        speed = 20, // Default duration in seconds
    } = config || {};

    const blobStyle = (color, delay, top, left, size) => ({
        backgroundColor: color,
        animationDelay: `${delay}s`,
        animationDuration: `${speed}s`,
        top: top,
        left: left,
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
    });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Blob 1 */}
            <div
                className="absolute rounded-full mix-blend-multiply opacity-70 animate-blob"
                style={blobStyle(colors[0], 0, '0%', '0%', '40%')}
            ></div>
            {/* Blob 2 */}
            <div
                className="absolute rounded-full mix-blend-multiply opacity-70 animate-blob"
                style={blobStyle(colors[1], -2, '10%', '60%', '35%')}
            ></div>
            {/* Blob 3 */}
            <div
                className="absolute rounded-full mix-blend-multiply opacity-70 animate-blob"
                style={blobStyle(colors[2], -4, '60%', '-10%', '45%')}
            ></div>
            {/* Blob 4 */}
            <div
                className="absolute rounded-full mix-blend-multiply opacity-70 animate-blob"
                style={blobStyle(colors[3], -6, '50%', '50%', '30%')}
            ></div>
            {/* Blob 5 */}
            <div
                className="absolute rounded-full mix-blend-multiply opacity-70 animate-blob"
                style={blobStyle(colors[4] || colors[0], -8, '30%', '30%', '25%')}
            ></div>

            {/* Glassmorphism Overlay (Optional, enhances effect) */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        </div>
    );
};

export default LavaBackground;
