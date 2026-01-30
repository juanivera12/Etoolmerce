import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Info } from 'lucide-react';

export const InfoLabel = ({ label, tooltip, icon: Icon = HelpCircle }) => {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top,
                left: rect.left - 200 // Position to the left
            });
            setShow(true);
        }
    };

    return (
        <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] text-text-muted font-bold block capitalize">{label}</span>
            {tooltip && (
                <>
                    <button
                        ref={triggerRef}
                        className="text-text-muted hover:text-primary transition-colors cursor-help"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={() => setShow(false)}
                        onClick={() => setShow(!show)}
                    >
                        <Icon size={12} />
                    </button>
                    {show && createPortal(
                        <div
                            className="fixed z-[9999] bg-surface text-text text-xs p-3 rounded-lg shadow-xl w-48 border border-border leading-normal pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                            style={{
                                top: coords.top,
                                left: coords.left - 10,
                            }}
                        >
                            <strong className="block mb-1 text-indigo-300">{label}</strong>
                            {tooltip}
                            {/* Arrow */}
                            <div className="absolute top-2 -right-1 w-2 h-2 bg-slate-800 transform rotate-45 border-t border-r border-slate-700"></div>
                        </div>,
                        document.body
                    )}
                </>
            )}
        </div>
    );
};
