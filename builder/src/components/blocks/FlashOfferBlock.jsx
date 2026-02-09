import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export const FlashOfferBlock = ({ endDate, message, styles }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                h: Math.floor((difference / (1000 * 60 * 60)) % 24 + (Math.floor(difference / (1000 * 60 * 60 * 24)) * 24)), // Hours including days
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { h: 0, m: 0, s: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <div style={{
            ...styles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '12px 24px' // Ensure some padding override if needed
        }}>
            <div className="flex items-center gap-2">
                <Zap size={20} className="animate-pulse" />
                <span className="font-bold">{message || "¡Oferta Relámpago!"}</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-lg bg-black/20 px-3 py-1 rounded-md">
                <span>{String(timeLeft.h).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(timeLeft.m).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(timeLeft.s).padStart(2, '0')}</span>
            </div>
        </div>
    );
};
