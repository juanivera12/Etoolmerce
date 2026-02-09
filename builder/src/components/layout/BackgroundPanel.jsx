import React from 'react';
import { Palette, Image as ImageIcon, Layout, Type, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { InfoLabel } from '../ui/InfoLabel';

// Reusing SliderControl if exported, or defining local simple one
const SliderControl = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) => {
    const numericValue = parseFloat(value) || 0; // Support floats
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
    const [activeTab, setActiveTab] = React.useState('color'); // 'color' | 'texture' | 'ambient'

    const handleTypeChange = (type) => {
        const defaults = {
            startColor: bgConfig.startColor || '#6366f1',
            endColor: bgConfig.endColor || '#a855f7',
            angle: bgConfig.angle || 135
        };

        const newConfig = { ...bgConfig, type, ...defaults };
        // Save defaults immediately so they persist
        updateProperty(selectedId, 'backgroundConfig', newConfig);

        if (type === 'solid') {
            updateStyles(selectedId, {
                backgroundImage: 'none',
                backgroundColor: selectedNode.styles.backgroundColor || '#ffffff'
            });
        } else if (type === 'gradient-linear') {
            updateStyles(selectedId, {
                backgroundImage: `linear-gradient(${defaults.angle}deg, ${defaults.startColor}, ${defaults.endColor})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            });
        } else if (type === 'gradient-radial') {
            updateStyles(selectedId, {
                backgroundImage: `radial-gradient(circle at center, ${defaults.startColor}, ${defaults.endColor})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            });
        }
    };

    const updateGradient = (key, val) => {
        const newConfig = { ...bgConfig, [key]: val };
        updateProperty(selectedId, 'backgroundConfig', newConfig);

        const start = newConfig.startColor || '#6366f1';
        const end = newConfig.endColor || '#a855f7';

        if (newConfig.type === 'gradient-linear') {
            const deg = newConfig.angle || 135;
            updateStyles(selectedId, {
                backgroundImage: `linear-gradient(${deg}deg, ${start}, ${end})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            });
        } else if (newConfig.type === 'gradient-radial') {
            updateStyles(selectedId, {
                backgroundImage: `radial-gradient(circle at center, ${start}, ${end})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            });
        }
    };

    // --- Ambient Animation Handlers ---
    const handleAmbientChange = (ambientType) => {
        updateProperty(selectedId, 'backgroundConfig', { ...bgConfig, ambientType });
    };

    const toggleSpotlight = (enabled) => {
        updateProperty(selectedId, 'backgroundConfig', { ...bgConfig, spotlightEnabled: enabled });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 border-b border-border pb-2">
                <div className="flex items-center gap-2">
                    <Palette size={14} className="text-secondary" />
                    <span className="text-xs font-semibold text-text">Fondo</span>
                </div>
                {/* Tabs */}
                <div className="flex bg-surface-highlight rounded p-0.5">
                    <button
                        onClick={() => setActiveTab('color')}
                        className={clsx("px-2 py-0.5 text-[10px] rounded transition-all", activeTab === 'color' ? "bg-white shadow text-primary font-medium" : "text-text-muted hover:text-text")}
                    >
                        Color
                    </button>
                    <button
                        onClick={() => setActiveTab('ambient')}
                        className={clsx("px-2 py-0.5 text-[10px] rounded transition-all flex items-center gap-1", activeTab === 'ambient' ? "bg-white shadow text-primary font-medium" : "text-text-muted hover:text-text")}
                    >
                        <Sparkles size={10} /> Amb.
                    </button>
                </div>
            </div>

            {activeTab === 'color' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
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
                                    </div>
                                </div>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'ambient' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                    {/* Visual Ambient Selector */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleAmbientChange('none')}
                            className={clsx("h-16 rounded border transition-all flex items-center justify-center bg-gray-50", (!bgConfig.ambientType || bgConfig.ambientType === 'none') ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50")}
                        >
                            <span className="text-[10px] text-gray-500">Ninguna</span>
                        </button>

                        <button
                            onClick={() => handleAmbientChange('pulse')}
                            className={clsx("h-16 rounded border transition-all relative overflow-hidden bg-slate-900 group", bgConfig.ambientType === 'pulse' ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50")}
                        >
                            <div className="absolute inset-0 opacity-60 animate-radial-pulse" style={{ '--ambient-duration': '3s' }}></div>
                            <span className="relative z-10 text-[10px] text-white font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-[1px]">Radial (Aurora)</span>
                        </button>
                    </div>

                    {/* Ambient Controls */}
                    {bgConfig.ambientType && bgConfig.ambientType !== 'none' && (
                        <div className="p-3 bg-surface-highlight/30 rounded-lg border border-border/50 space-y-2">
                            <span className="text-[10px] text-text font-bold mb-2 block">Ajustes de Ambiente</span>

                            <SliderControl
                                label="Notoriedad (Opacidad)"
                                value={bgConfig.ambientOpacity || 1}
                                onChange={(val) => updateProperty(selectedId, 'backgroundConfig', { ...bgConfig, ambientOpacity: val })}
                                min={0.1}
                                max={1}
                                step={0.1}
                            />
                            <SliderControl
                                label="Velocidad (s)"
                                value={bgConfig.ambientDuration || 15}
                                onChange={(val) => updateProperty(selectedId, 'backgroundConfig', { ...bgConfig, ambientDuration: val })}
                                min={0.1}
                                max={60}
                                step={0.1}
                                unit="s"
                            />
                        </div>
                    )}

                    {/* Spotlight Toggle */}
                    <div className="p-3 bg-gradient-to-r from-surface-highlight to-surface rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-text flex items-center gap-1">
                                    <Sparkles size={12} className="text-primary" /> Luz Interactiva
                                </span>
                                <span className="text-[9px] text-text-muted">El fondo sigue al mouse.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={bgConfig.spotlightEnabled || false}
                                    onChange={(e) => toggleSpotlight(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
