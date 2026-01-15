import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { X, Palette, Type, Check, Globe, DownloadCloud } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';

export const GlobalSettingsPanel = ({ onClose }) => {
    const { updateStyles } = useEditorStore();

    const colorPalettes = [
        { name: 'Modern Dark', bg: '#0f172a', text: '#f8fafc', primary: '#6366f1' },
        { name: 'Clean Light', bg: '#ffffff', text: '#1e293b', primary: '#4f46e5' },
        { name: 'Elegant Serif', bg: '#fdfbf7', text: '#44403c', primary: '#d97706' },
        { name: 'Forest Vibe', bg: '#f0fdf4', text: '#14532d', primary: '#16a34a' },
    ];

    const fonts = [
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Playfair Display', value: '"Playfair Display", serif' },
        { name: 'Courier Prime', value: '"Courier Prime", monospace' },
    ];

    const applyPalette = (palette) => {
        updateStyles('root', {
            backgroundColor: palette.bg,
            color: palette.text,
        });
        // Ideally we would update a "theme" object in store, but updating root styles works for now
        // We could also inject CSS variables here
    };

    const applyFont = (font) => {
        updateStyles('root', {
            fontFamily: font.value
        });
    };

    return (
        <div className="w-[300px] border-l border-border bg-surface h-full flex flex-col animate-in slide-in-from-right-10 duration-300 shadow-xl z-20">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                    <Palette size={18} className="text-indigo-600" />
                    <h2 className="font-bold text-text text-sm uppercase tracking-wide">Diseño Global</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Brand Logo Fetcher */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                        Marca & Branding
                    </h3>
                    <div className="bg-slate-50 p-3 rounded-xl border border-border">
                        <label className="text-xs font-semibold text-slate-600 mb-2 block">Importar Logo Web</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <LucideIcons.Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="ej. nike.com"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const domain = e.target.value.replace(/^https?:\/\//, '').split('/')[0];
                                            if (!domain) return;
                                            const logoUrl = `https://logo.clearbit.com/${domain}`;
                                            // Add Logo to Page
                                            useEditorStore.getState().addElement(null, 'image', {
                                                content: logoUrl,
                                                styles: { width: '150px', height: 'auto', borderRadius: '0' }
                                            });
                                            onClose();
                                        }
                                    }}
                                />
                            </div>
                            <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                <LucideIcons.DownloadCloud size={16} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Escribe un dominio y presiona Enter para añadir su logo.</p>
                    </div>
                </section>

                <div className="h-px bg-slate-100 w-full" />

                {/* Palettes */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                        Paleta de Colores
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {colorPalettes.map((palette) => (
                            <button
                                key={palette.name}
                                onClick={() => applyPalette(palette)}
                                className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all group text-left w-full"
                            >
                                <div className="flex gap-1">
                                    <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: palette.bg }} />
                                    <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm -ml-2" style={{ backgroundColor: palette.primary }} />
                                    <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm -ml-2" style={{ backgroundColor: palette.text }} />
                                </div>
                                <span className="text-sm text-slate-600 font-medium group-hover:text-indigo-600">{palette.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-slate-100 w-full" />

                {/* Typography */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                        Tipografía
                    </h3>
                    <div className="space-y-2">
                        {fonts.map((font) => (
                            <button
                                key={font.name}
                                onClick={() => applyFont(font)}
                                className="w-full text-left p-3 rounded-lg border border-slate-100 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex justify-between items-center group"
                            >
                                <span className="text-lg text-slate-700" style={{ fontFamily: font.value }}>Aa</span>
                                <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium">{font.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="p-4 bg-slate-50 border-t border-border text-xs text-slate-400 text-center">
                Aplica estilos a toda la tienda
            </div>
        </div>
    );
};
