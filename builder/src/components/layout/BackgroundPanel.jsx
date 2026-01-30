import React from 'react';
import { Palette, Image as ImageIcon, Layout, Type } from 'lucide-react';
import clsx from 'clsx';
import { InfoLabel } from '../ui/InfoLabel';

// Reusing SliderControl if exported, or defining local simple one
const SliderControl = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) => {
    const numericValue = parseInt(value, 10) || 0;
    return (
        <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-500 font-medium capitalize">{label}</span>
                <span className="text-[9px] font-mono text-text-muted bg-surface-highlight px-1.5 py-0.5 rounded border border-border">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={numericValue}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover transition-all"
            />
        </div>
    );
};

export const BackgroundPanel = ({ selectedNode, updateStyles, updateProperty, selectedId }) => {

    const bgConfig = selectedNode.backgroundConfig || { type: 'solid' };

    const handleTypeChange = (type) => {
        updateProperty(selectedId, 'backgroundConfig', { ...bgConfig, type });

        if (type === 'solid') {
            updateStyles(selectedId, { backgroundImage: 'none', backgroundColor: selectedNode.styles.backgroundColor || '#ffffff' });
        } else if (type === 'gradient-linear') {
            // Default Linear
            const start = bgConfig.startColor || '#6366f1';
            const end = bgConfig.endColor || '#a855f7';
            const deg = bgConfig.angle || 135;
            updateStyles(selectedId, { backgroundImage: `linear-gradient(${deg}deg, ${start}, ${end})` });
        } else if (type === 'gradient-radial') {
            // Default Radial
            const start = bgConfig.startColor || '#6366f1';
            const end = bgConfig.endColor || '#a855f7';
            updateStyles(selectedId, { backgroundImage: `radial-gradient(circle, ${start}, ${end})` });
        }
    };

    const updateGradient = (key, val) => {
        const newConfig = { ...bgConfig, [key]: val };
        updateProperty(selectedId, 'backgroundConfig', newConfig);

        const start = newConfig.startColor || '#6366f1';
        const end = newConfig.endColor || '#a855f7';

        if (newConfig.type === 'gradient-linear') {
            const deg = newConfig.angle || 135;
            updateStyles(selectedId, { backgroundImage: `linear-gradient(${deg}deg, ${start}, ${end})` });
        } else if (newConfig.type === 'gradient-radial') {
            updateStyles(selectedId, { backgroundImage: `radial-gradient(circle, ${start}, ${end})` });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Palette size={14} className="text-secondary" />
                <span className="text-xs font-semibold text-text">Fondo & Color</span>
            </div>

            {/* Type Selector */}
            <div className="flex bg-surface-highlight p-1 rounded-lg mb-3">
                <button
                    onClick={() => handleTypeChange('solid')}
                    className={clsx("flex-1 text-[10px] py-1.5 rounded transition-all font-medium", bgConfig.type === 'solid' ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text")}
                >
                    Sólido
                </button>
                <button
                    onClick={() => handleTypeChange('gradient-linear')}
                    className={clsx("flex-1 text-[10px] py-1.5 rounded transition-all font-medium", bgConfig.type === 'gradient-linear' ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text")}
                >
                    Lineal
                </button>
                <button
                    onClick={() => handleTypeChange('gradient-radial')}
                    className={clsx("flex-1 text-[10px] py-1.5 rounded transition-all font-medium", bgConfig.type === 'gradient-radial' ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text")}
                >
                    Radial
                </button>
            </div>

            {/* Controls */}
            {bgConfig.type === 'solid' && (
                <div className="animate-in fade-in slide-in-from-top-1">
                    <label className="text-[10px] text-text-muted font-bold block mb-1">Color de Fondo</label>
                    <div className="flex gap-2">
                        <div
                            className="w-8 h-8 rounded border border-border cursor-pointer shadow-sm relative overflow-hidden"
                            style={{ backgroundColor: selectedNode.styles.backgroundColor || 'transparent' }}
                        >
                            <input
                                type="color"
                                value={selectedNode.styles.backgroundColor || '#ffffff'}
                                onChange={(e) => updateStyles(selectedId, { backgroundColor: e.target.value })}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                        <input
                            type="text"
                            value={selectedNode.styles.backgroundColor || ''}
                            onChange={(e) => updateStyles(selectedId, { backgroundColor: e.target.value })}
                            className="flex-1 p-1.5 text-xs border border-border rounded bg-surface-highlight text-text font-mono"
                            placeholder="#FFFFFF"
                        />
                    </div>
                </div>
            )}

            {(bgConfig.type === 'gradient-linear' || bgConfig.type === 'gradient-radial') && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 p-3 bg-surface-highlight/30 rounded-lg border border-border/50">

                    {bgConfig.type === 'gradient-linear' && (
                        <SliderControl
                            label="Ángulo"
                            value={bgConfig.angle || 135}
                            onChange={(val) => updateGradient('angle', val)}
                            max={360}
                            unit="°"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {/* Start Color */}
                        <div>
                            <span className="text-[10px] text-text-muted mb-1 block">Color Inicial</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-border relative overflow-hidden shadow-sm">
                                    <div className="absolute inset-0" style={{ backgroundColor: bgConfig.startColor || '#6366f1' }} />
                                    <input
                                        type="color"
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        value={bgConfig.startColor || '#6366f1'}
                                        onChange={(e) => updateGradient('startColor', e.target.value)}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={bgConfig.startColor || '#6366f1'}
                                    onChange={(e) => updateGradient('startColor', e.target.value)}
                                    className="w-full min-w-0 p-1 text-[10px] border border-border rounded bg-surface text-text font-mono"
                                />
                            </div>
                        </div>

                        {/* End Color */}
                        <div>
                            <span className="text-[10px] text-text-muted mb-1 block">Color Final</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border border-border relative overflow-hidden shadow-sm">
                                    <div className="absolute inset-0" style={{ backgroundColor: bgConfig.endColor || '#a855f7' }} />
                                    <input
                                        type="color"
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        value={bgConfig.endColor || '#a855f7'}
                                        onChange={(e) => updateGradient('endColor', e.target.value)}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={bgConfig.endColor || '#a855f7'}
                                    onChange={(e) => updateGradient('endColor', e.target.value)}
                                    className="w-full min-w-0 p-1 text-[10px] border border-border rounded bg-surface text-text font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Living Gradient Toggle */}
                    <div className="pt-2 border-t border-border mt-2">
                        <div className="flex items-center justify-between">
                            <InfoLabel
                                label="Animar Fondo"
                                tooltip="Activa un efecto de movimiento líquido o cíclico en los colores (requiere gradiente)."
                            />
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={bgConfig.animated || false}
                                    onChange={(e) => {
                                        const isAnimated = e.target.checked;
                                        const newConfig = { ...bgConfig, animated: isAnimated };
                                        updateProperty(selectedId, 'backgroundConfig', newConfig);

                                        if (isAnimated) {
                                            updateStyles(selectedId, {
                                                animation: 'gradientFlow 15s ease infinite',
                                                backgroundSize: '400% 400%'
                                            });
                                        } else {
                                            updateStyles(selectedId, {
                                                animation: 'none',
                                                backgroundSize: 'cover'
                                            });
                                        }
                                    }}
                                />
                                <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    {/* Presets (Aurora/Mesh) */}
                    <div className="pt-2 border-t border-border mt-2">
                        <div className="mb-2">
                            <InfoLabel
                                label="Presets"
                                tooltip="Configuraciones de color profesionales pre-diseñadas."
                            />
                        </div>
                        <button
                            onClick={() => {
                                // Aurora / Mesh Gradient Preset
                                const meshGradient = "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)";
                                const newConfig = { ...bgConfig, type: 'gradient-radial', animated: true };
                                updateProperty(selectedId, 'backgroundConfig', newConfig);
                                updateStyles(selectedId, {
                                    backgroundImage: meshGradient,
                                    backgroundColor: '#000000', // base
                                    animation: 'gradientFlow 15s ease infinite',
                                    backgroundSize: '400% 400%'
                                });
                            }}
                            className="w-full py-1 px-2 text-[10px] border border-border rounded bg-surface-highlight hover:bg-surface-highlight/80 text-left flex items-center gap-2"
                        >
                            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900"></div>
                            <span>Aurora Mesh (Deep Space)</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
