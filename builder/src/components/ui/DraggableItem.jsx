import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditorStore } from '../../store/useEditorStore';
import clsx from 'clsx';

export const DraggableItem = ({ type, icon, label, description, preview, variant = 'blue', onClick }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    const { setIsDragging } = useEditorStore();

    const handleDragStart = (e) => {
        if (onClick) return;
        setIsDragging(true, 'new-item'); // Enable Global Drag State
        e.dataTransfer.setData('application/react-builder-type', type);
        e.dataTransfer.effectAllowed = 'copy';
        setShowTooltip(false); // Hide tooltip on drag start
    };

    const handleDragEnd = () => {
        setIsDragging(false); // Disable Global Drag State
    };

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({
            top: rect.top + (rect.height / 2),
            left: rect.right + 12
        });
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const variants = {
        blue: "hover:border-primary hover:bg-surface-highlight group-hover:text-primary",
        emerald: "hover:border-primary hover:bg-surface-highlight group-hover:text-primary",
        coral: "hover:border-primary hover:bg-surface-highlight group-hover:text-primary",
    };

    const textVariants = {
        blue: "group-hover:text-primary",
        emerald: "group-hover:text-primary",
        coral: "group-hover:text-primary",
    };

    return (
        <>
            <div
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} // Disable dragging state when drop is incomplete or cancelled
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={clsx(
                    "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-grab active:cursor-grabbing group h-24 w-full",
                    "bg-surface border border-border",
                    "hover:shadow-md hover:-translate-y-0.5",
                    variants[variant] || variants.blue
                )}
            >
                <div className={clsx("text-slate-400 mb-2 transition-colors", textVariants[variant] || textVariants.blue)}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
                <span className={clsx("text-[10px] text-slate-500 font-medium transition-colors text-center leading-tight px-1 line-clamp-2", textVariants[variant] || textVariants.blue)}>
                    {label}
                </span>
            </div>

            {/* Rich Guide Tooltip via Portal */}
            {showTooltip && (description || preview) && createPortal(
                <div
                    className="fixed w-64 p-3 bg-slate-900 border border-slate-700 text-white text-[10px] rounded-xl shadow-2xl z-[9999] pointer-events-none animate-in fade-in slide-in-from-left-2 duration-200"
                    style={{
                        top: tooltipPos.top,
                        left: tooltipPos.left,
                        transform: 'translateY(-50%)'
                    }}
                >
                    {/* Arrow Pointer */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900"></div>

                    {preview && (
                        <div className="w-full h-32 bg-slate-800 rounded-lg mb-2 overflow-hidden border border-slate-700/50">
                            <img src={preview} alt={label} className="w-full h-full object-cover opacity-90" />
                        </div>
                    )}

                    <div className="space-y-1">
                        <strong className={clsx("block text-xs uppercase tracking-wider",
                            variant === 'emerald' ? 'text-emerald-400' :
                                variant === 'coral' ? 'text-orange-400' : 'text-blue-400'
                        )}>
                            {label}
                        </strong>
                        <p className="text-slate-300 leading-relaxed">{description || "Arrastra este componente a tu lienzo."}</p>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
