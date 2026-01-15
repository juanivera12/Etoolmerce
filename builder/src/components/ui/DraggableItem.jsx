import React from 'react';
import clsx from 'clsx';

export const DraggableItem = ({ type, icon, label, description, preview, variant = 'blue', onClick }) => {
    const handleDragStart = (e) => {
        if (onClick) return; // Optional: disable drag if it's a clickable-only item? Or allow both?
        // Let's allow drag, but onClick fires on click.
        e.dataTransfer.setData('application/react-builder-type', type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const variants = {
        blue: "hover:border-blue-500 hover:bg-blue-50 group-hover:text-blue-600",
        emerald: "hover:border-emerald-500 hover:bg-emerald-50 group-hover:text-emerald-600",
        coral: "hover:border-orange-500 hover:bg-orange-50 group-hover:text-orange-600",
    };

    const textVariants = {
        blue: "group-hover:text-blue-600",
        emerald: "group-hover:text-emerald-600",
        coral: "group-hover:text-orange-600",
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onClick={onClick}
            className={clsx(
                "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-grab active:cursor-grabbing group h-24 w-full",
                "bg-white border border-slate-200",
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

            {/* Rich Guide Tooltip */}
            {(description || preview) && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 p-3 bg-slate-900 border border-slate-700 text-white text-[10px] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none animate-in fade-in slide-in-from-left-2 duration-200">
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
                </div>
            )}
        </div>
    );
};
