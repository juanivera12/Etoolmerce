import React from 'react';
import { MousePointer2, Hand, BoxSelect } from 'lucide-react';
import clsx from 'clsx';
import { useEditorStore } from '../../store/useEditorStore';

const ToolButton = ({ icon: Icon, label, shortcut, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            "p-3 rounded-full transition-all duration-200 relative group",
            isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                : "text-slate-400 hover:text-white hover:bg-white/10"
        )}
        title={`${label} (${shortcut})`}
    >
        <Icon size={20} className={clsx(isActive && "stroke-[2.5px]")} />

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-slate-900 text-white text-xs rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {label} <span className="text-slate-500 ml-1">({shortcut})</span>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
    </button>
);

export const FloatingToolbar = () => {
    const { activeTool, setTool } = useEditorStore();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-2 py-2 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ToolButton
                icon={MousePointer2}
                label="Seleccionar"
                shortcut="V"
                isActive={activeTool === 'select'}
                onClick={() => setTool('select')}
            />
            <ToolButton
                icon={Hand}
                label="Mover Lienzo"
                shortcut="H / Espacio"
                isActive={activeTool === 'hand'}
                onClick={() => setTool('hand')}
            />
            <ToolButton
                icon={BoxSelect}
                label="Multiselección"
                shortcut="S"
                isActive={activeTool === 'multiselect'}
                onClick={() => setTool('multiselect')}
            />
        </div>
    );
};
