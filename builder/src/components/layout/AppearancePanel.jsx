import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Image, Layers, Droplet, Type, Sliders, CheckSquare } from 'lucide-react';
import clsx from 'clsx';

export const AppearancePanel = ({ selectedNode: propSelectedNode }) => {
    const { selectedId, updateStyles, updateProperty, activePageContent } = useEditorStore();

    // Helper to find node
    const findNode = (node, id) => {
        if (!node) return null;
        if (node.id === id) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNode(child, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedNode = propSelectedNode || (selectedId ? findNode(activePageContent, selectedId) : null);
    if (!selectedNode) return null;

    // Local state for tabs
    const [activeTab, setActiveTab] = useState(selectedNode.bgMode || 'solid');

    useEffect(() => {
        if (selectedNode.bgMode) {
            setActiveTab(selectedNode.bgMode);
        }
    }, [selectedNode.bgMode]);

    const handleTabChange = (mode) => {
        setActiveTab(mode);
        updateProperty(selectedId, 'bgMode', mode);

        // Reset styles slightly when switching to ensure clean state if needed
        if (mode === 'solid') {
            updateStyles(selectedId, { backgroundImage: 'none' });
        } else if (mode === 'gradient') {
            const config = selectedNode.backgroundConfig || {
                direction: 135,
                startColor: '#ffffff',
                endColor: '#000000'
            };
            updateStyles(selectedId, { backgroundImage: `linear-gradient(${config.direction}deg, ${config.startColor}, ${config.endColor})` });
        }
    };

    const isHeaderOrNavbar = ['header', 'navbar'].includes(selectedNode.type?.toLowerCase());

    return (
        <div className="space-y-4 border-t border-slate-100 pt-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
                <Layers size={14} className="text-slate-600" />
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Apariencia & Fondo</label>
            </div>

            {/* Glassmorphism Toggle (Special for Header) */}
            {isHeaderOrNavbar && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-indigo-700">Modo Glassmorphism</span>
                            <span className="text-[10px] text-indigo-500">Efecto vidrio borroso</span>
                        </div>
                        <div className="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                checked={selectedNode.styles.backdropFilter === 'blur(10px)'}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        updateStyles(selectedId, {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                        });
                                    } else {
                                        updateStyles(selectedId, {
                                            backgroundColor: '#ffffff', // Default restore
                                            backdropFilter: 'none',
                                            WebkitBackdropFilter: 'none',
                                        });
                                    }
                                }}
                                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-4 checked:border-indigo-600 border-slate-300 transition-all duration-300"
                            />
                            <label className="toggle-label block overflow-hidden h-4 rounded-full bg-slate-300 cursor-pointer checked:bg-indigo-600"></label>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Manager */}
            <div className="bg-surface-highlight border border-border rounded-lg p-1 flex mb-3">
                {['solid', 'gradient', 'image'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => handleTabChange(mode)}
                        className={clsx(
                            "flex-1 text-[10px] font-medium py-1.5 rounded-md capitalize transition-all",
                            activeTab === mode
                                ? "bg-white text-primary shadow-sm font-bold"
                                : "text-text-muted hover:text-text hover:bg-slate-100"
                        )}
                    >
                        {mode === 'solid' ? 'Sólido' : mode === 'gradient' ? 'Gradiente' : 'Imagen'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-border p-3 shadow-sm">

                {/* 1. MODO SÓLIDO */}
                {activeTab === 'solid' && (
                    <div className="space-y-3">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mb-1.5 block">Color de Fondo</span>
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-inner group">
                                    <input
                                        type="color"
                                        value={selectedNode.styles.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateStyles(selectedId, { backgroundColor: e.target.value, backgroundImage: 'none' })}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="w-full h-full"
                                        style={{ backgroundColor: selectedNode.styles.backgroundColor || '#ffffff' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={selectedNode.styles.backgroundColor || ''}
                                    onChange={(e) => updateStyles(selectedId, { backgroundColor: e.target.value })}
                                    className="flex-1 text-xs border border-border rounded p-1.5 font-mono text-slate-600"
                                    placeholder="#RRGGBB"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. MODO GRADIENTE */}
                {activeTab === 'gradient' && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Ángulo ({selectedNode.backgroundConfig?.direction || 135}°)</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="360" step="1"
                                value={selectedNode.backgroundConfig?.direction || 135}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const config = { ...selectedNode.backgroundConfig, direction: val };
                                    updateProperty(selectedId, 'backgroundConfig', config);
                                    updateStyles(selectedId, {
                                        backgroundImage: `linear-gradient(${val}deg, ${config.startColor || '#ffffff'}, ${config.endColor || '#000000'})`
                                    });
                                }}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="text-[9px] text-slate-400 mb-1 block font-semibold">Inicio</span>
                                <div className="flex gap-1 items-center bg-slate-50 p-1 rounded border border-slate-100">
                                    <input
                                        type="color"
                                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                                        value={selectedNode.backgroundConfig?.startColor || '#ffffff'}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const config = { ...selectedNode.backgroundConfig, startColor: val };
                                            updateProperty(selectedId, 'backgroundConfig', config);
                                            updateStyles(selectedId, {
                                                backgroundImage: `linear-gradient(${config.direction || 135}deg, ${val}, ${config.endColor || '#000000'})`
                                            });
                                        }}
                                    />
                                    <span className="text-[9px] font-mono text-slate-500">{selectedNode.backgroundConfig?.startColor}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[9px] text-slate-400 mb-1 block font-semibold">Fin</span>
                                <div className="flex gap-1 items-center bg-slate-50 p-1 rounded border border-slate-100">
                                    <input
                                        type="color"
                                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                                        value={selectedNode.backgroundConfig?.endColor || '#000000'}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const config = { ...selectedNode.backgroundConfig, endColor: val };
                                            updateProperty(selectedId, 'backgroundConfig', config);
                                            updateStyles(selectedId, {
                                                backgroundImage: `linear-gradient(${config.direction || 135}deg, ${config.startColor || '#ffffff'}, ${val})`
                                            });
                                        }}
                                    />
                                    <span className="text-[9px] font-mono text-slate-500">{selectedNode.backgroundConfig?.endColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. MODO IMAGEN */}
                {activeTab === 'image' && (
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mb-1.5 block">URL de Imagen</span>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="https://"
                                    className="w-full text-xs p-2 border border-border rounded bg-slate-50"
                                    value={selectedNode.styles.backgroundImage?.includes('url')
                                        ? selectedNode.styles.backgroundImage.match(/url\("?(.*?)"?\)/)?.[1]
                                        : ''}
                                    onChange={(e) => updateStyles(selectedId, { backgroundImage: `url("${e.target.value}")` })}
                                />
                            </div>
                        </div>
                        <div className="flex items-start gap-2 pt-2 border-t border-slate-50">
                            <input
                                type="checkbox"
                                id="bg-cover"
                                checked={selectedNode.styles.backgroundSize === 'cover'}
                                onChange={(e) => updateStyles(selectedId, { backgroundSize: e.target.checked ? 'cover' : 'contain' })}
                                className="mt-0.5"
                            />
                            <div className="flex flex-col">
                                <label htmlFor="bg-cover" className="text-xs font-semibold text-slate-700 cursor-pointer">Cubrir Todo (Cover)</label>
                                <span className="text-[9px] text-slate-400">Escala la imagen para llenar el contenedor.</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
