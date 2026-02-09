import React from 'react';
import { ChevronsUp, ChevronUp, ChevronDown, ChevronsDown } from 'lucide-react';
import { useLayerManager } from '../../hooks/useLayerManager';

export const QuickLayerToolbar = ({ selectedId }) => {
    const layerManager = useLayerManager();

    if (!selectedId) return null;

    const actions = [
        {
            label: "Traer al Frente",
            icon: ChevronsUp,
            action: () => layerManager.bringToFront(selectedId)
        },
        {
            label: "Subir Capa",
            icon: ChevronUp,
            action: () => layerManager.moveForward(selectedId)
        },
        {
            label: "Bajar Capa",
            icon: ChevronDown,
            action: () => layerManager.moveBackward(selectedId)
        },
        {
            label: "Enviar al Fondo",
            icon: ChevronsDown,
            action: () => layerManager.sendToBack(selectedId)
        }
    ];

    return (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-md shadow-lg flex items-center p-1 gap-1 z-[100] animate-in fade-in zoom-in duration-200">
            {actions.map((btn, idx) => (
                <button
                    key={idx}
                    onClick={(e) => {
                        e.stopPropagation();
                        btn.action();
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors relative group"
                    title={btn.label}
                >
                    <btn.icon size={14} />

                    {/* Tooltip Custom */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {btn.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                    </div>
                </button>
            ))}

            {/* Arrow pointing down to element */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    );
};
