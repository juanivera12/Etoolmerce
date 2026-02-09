import React, { useState, useEffect } from 'react';

export const CountdownBlock = ({ targetDate, styles, labels = { days: 'Días', hours: 'Horas', minutes: 'Min', seconds: 'Seg' } }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <span className="text-3xl font-bold leading-tight tabular-nums text-orange-600">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider opacity-70 text-gray-800">{label}</span>
        </div>
    );

    const Separator = () => (
        <span className="text-2xl font-bold -mt-4 opacity-50 text-orange-400">:</span>
    );

    return (
        <div className="flex items-center justify-center gap-4 w-full h-full min-h-[inherit]">
            <TimeUnit value={timeLeft.days} label={labels.days} />
            <Separator />
            <TimeUnit value={timeLeft.hours} label={labels.hours} />
            <Separator />
            <TimeUnit value={timeLeft.minutes} label={labels.minutes} />
            <Separator />
            <TimeUnit value={timeLeft.seconds} label={labels.seconds} />
        </div>
    );
};
