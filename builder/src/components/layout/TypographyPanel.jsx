import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

const GOOGLE_FONTS = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Oswald', 'Raleway', 'Nunito', 'Merriweather',
    'Playfair Display', 'Rubik', 'Ubuntu', 'PT Sans', 'Lora', 'Work Sans', 'Mukta', 'Quicksand', 'Fira Sans', 'Barlow',
    'Mulish', 'Titillium Web', 'Karla', 'Nunito Sans', 'Josefin Sans', 'Cabin', 'Arimo', 'Anton', 'Oxygen', 'Dosis',
    'Inconsolata', 'Libre Baskerville', 'Bebas Neue', 'Crimson Text', 'Source Sans Pro', 'Dm Sans', 'Manrope', 'Cairo'
];

export const TypographyPanel = ({ selectedId, styles, updateStyles }) => {

    // Inject font into head dynamically for preview
    useEffect(() => {
        if (styles.fontFamily) {
            const fontName = styles.fontFamily.split(',')[0].replace(/['"]/g, '');
            if (GOOGLE_FONTS.includes(fontName)) {
                const link = document.createElement('link');
                link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@100;300;400;500;700;900&display=swap`;
                link.rel = 'stylesheet';
                link.id = `font-${fontName.replace(/ /g, '-')}`;

                if (!document.getElementById(`font-${fontName.replace(/ /g, '-')}`)) {
                    document.head.appendChild(link);
                }
            }
        }
    }, [styles.fontFamily]);

    const handleFontChange = (e) => {
        const font = e.target.value;
        const fallback = font === 'Inter' ? 'sans-serif' : 'serif';
        updateStyles(selectedId, { fontFamily: `'${font}', ${fallback}` });
    };

    return (
        <div className="space-y-4 border-b border-border pb-4">
            <h3 className="text-xs font-bold text-text mb-2 flex items-center gap-2">
                <span className="bg-primary/10 text-primary p-1 rounded">Aa</span> Tipografía
            </h3>

            {/* Font Family Selector */}
            <div className="space-y-1">
                <label className="text-[10px] text-text-muted font-bold">Fuente</label>
                <select
                    value={styles.fontFamily ? styles.fontFamily.split(',')[0].replace(/['"]/g, '') : 'Inter'}
                    onChange={handleFontChange}
                    className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text outline-none focus:border-primary"
                    style={{ fontFamily: styles.fontFamily }}
                >
                    {GOOGLE_FONTS.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                </select>
            </div>

            {/* Font Weight */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <label className="text-[10px] text-text-muted font-bold">Peso</label>
                    <span className="text-[10px] text-text-muted font-mono">{styles.fontWeight || 400}</span>
                </div>
                <input
                    type="range"
                    min="100" max="900" step="100"
                    value={styles.fontWeight || 400}
                    onChange={(e) => updateStyles(selectedId, { fontWeight: e.target.value })}
                    className="w-full accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Size */}
                <div className="space-y-1">
                    <label className="text-[10px] text-text-muted font-bold">Tamaño</label>
                    <div className="flex items-center border border-border rounded bg-surface-highlight">
                        <input
                            type="number"
                            className="w-full bg-transparent p-1 text-xs outline-none text-text"
                            value={parseInt(styles.fontSize) || 16}
                            onChange={(e) => updateStyles(selectedId, { fontSize: `${e.target.value}px` })}
                        />
                        <span className="text-[10px] text-text-muted font-mono pr-2">px</span>
                    </div>
                </div>

                {/* Line Height */}
                <div className="space-y-1">
                    <label className="text-[10px] text-text-muted font-bold">Interlineado</label>
                    <div className="flex items-center border border-border rounded bg-surface-highlight">
                        <input
                            type="number"
                            step="0.1"
                            className="w-full bg-transparent p-1 text-xs outline-none text-text"
                            value={parseFloat(styles.lineHeight) || 1.5}
                            onChange={(e) => updateStyles(selectedId, { lineHeight: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Letter Spacing */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <label className="text-[10px] text-text-muted font-bold">Letter Spacing (Tracking)</label>
                    <span className="text-[10px] text-text-muted font-mono">{styles.letterSpacing || '0px'}</span>
                </div>
                <input
                    type="range"
                    min="-2" max="10" step="0.5"
                    value={parseFloat(styles.letterSpacing) || 0}
                    onChange={(e) => updateStyles(selectedId, { letterSpacing: `${e.target.value}px` })}
                    className="w-full accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Transforms & Align */}
            <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1 bg-surface-highlight p-1 rounded border border-border">
                    <button
                        onClick={() => updateStyles(selectedId, { textAlign: 'left' })}
                        className={`p-1 rounded hover:bg-white hover:shadow-sm ${styles.textAlign === 'left' ? 'bg-white shadow text-primary' : 'text-text-muted'}`}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                    </button>
                    <button
                        onClick={() => updateStyles(selectedId, { textAlign: 'center' })}
                        className={`p-1 rounded hover:bg-white hover:shadow-sm ${styles.textAlign === 'center' ? 'bg-white shadow text-primary' : 'text-text-muted'}`}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
                    </button>
                    <button
                        onClick={() => updateStyles(selectedId, { textAlign: 'right' })}
                        className={`p-1 rounded hover:bg-white hover:shadow-sm ${styles.textAlign === 'right' ? 'bg-white shadow text-primary' : 'text-text-muted'}`}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                    </button>
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => updateStyles(selectedId, { textTransform: 'uppercase' })}
                        className={`text-[10px] font-bold px-2 py-1 rounded border border-border hover:bg-primary/10 ${styles.textTransform === 'uppercase' ? 'bg-primary/10 text-primary border-primary' : 'text-text-muted'}`}
                    >AA</button>
                    <button
                        onClick={() => updateStyles(selectedId, { textTransform: 'lowercase' })}
                        className={`text-[10px] font-bold px-2 py-1 rounded border border-border hover:bg-primary/10 ${styles.textTransform === 'lowercase' ? 'bg-primary/10 text-primary border-primary' : 'text-text-muted'}`}
                    >aa</button>
                    <button
                        onClick={() => updateStyles(selectedId, { textTransform: 'capitalize' })}
                        className={`text-[10px] font-bold px-2 py-1 rounded border border-border hover:bg-primary/10 ${styles.textTransform === 'capitalize' ? 'bg-primary/10 text-primary border-primary' : 'text-text-muted'}`}
                    >Aa</button>
                </div>
            </div>

            {/* Advanced Color / Gradient Control */}
            <div className="pt-2">
                <label className="text-[10px] text-text-muted font-bold mb-1 block">Color & Relleno</label>

                {/* Type Toggle */}
                <div className="flex bg-surface-highlight p-1 rounded-lg mb-2">
                    <button
                        onClick={() => {
                            updateStyles(selectedId, {
                                backgroundImage: 'none',
                                WebkitBackgroundClip: 'unset',
                                WebkitTextFillColor: 'unset',
                                backgroundClip: 'unset',
                                color: styles.color || '#000000'
                            });
                        }}
                        className={`flex-1 text-[10px] py-1 rounded transition-all font-medium ${(!styles.backgroundImage || styles.backgroundImage === 'none') ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text"}`}
                    >
                        Sólido
                    </button>
                    <button
                        onClick={() => {
                            updateStyles(selectedId, {
                                backgroundImage: 'linear-gradient(90deg, #EC1E24, #FBBF24)', // Hot Wheels colors default
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                color: 'transparent'
                            });
                        }}
                        className={`flex-1 text-[10px] py-1 rounded transition-all font-medium ${(styles.backgroundImage && styles.backgroundImage !== 'none') ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text"}`}
                    >
                        Gradiente
                    </button>
                </div>

                {(!styles.backgroundImage || styles.backgroundImage === 'none') ? (
                    /* Solid Color Picker */
                    <div className="flex gap-2">
                        <div className="relative w-8 h-8 rounded border border-border overflow-hidden shadow-sm">
                            <input
                                type="color"
                                value={styles.color || '#000000'}
                                onChange={(e) => updateStyles(selectedId, { color: e.target.value })}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: styles.color || '#000000' }} />
                        </div>
                        <input
                            type="text"
                            value={styles.color || '#000000'}
                            onChange={(e) => updateStyles(selectedId, { color: e.target.value })}
                            className="flex-1 text-xs border border-border rounded px-2 bg-surface-highlight text-text font-mono"
                        />
                    </div>
                ) : (
                    /* Text Gradient Controls */
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 bg-surface-highlight/30 p-2 rounded border border-border/50">
                        {/* We reuse the logic: user must manually edit the gradient string or we provide simple controls.
                            For simplicity/speed/robustness in this snippet, let's provide Angle + 2 Colors.
                            We need to parse the existing gradient string manually or assume a format.
                        */}
                        <p className="text-[9px] text-text-muted mb-1">Configuración Gradiente Texto</p>

                        {/* Simple Linear Gradient Builder for Text */}
                        {/* Note: A proper robust parser is complex. We will provide 2 inputs that overwrite the gradient. 
                             If the user wants complex multi-stop, they might need the advanced panel, but this is Typography.
                         */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[9px] text-text-muted block">Inicio</label>
                                <input
                                    type="color"
                                    className="w-full h-6 rounded cursor-pointer border border-border"
                                    onChange={(e) => {
                                        // Naive update: assumes linear-gradient(deg, start, end)
                                        // Better: just overwrite with new values
                                        const current = styles.backgroundImage || '';
                                        const match = current.match(/(\d+)deg,\s*(.+?),\s*(.+?)\)/);
                                        const angle = match ? match[1] : '90';
                                        const end = match ? match[3] : '#FBBF24';
                                        updateStyles(selectedId, { backgroundImage: `linear-gradient(${angle}deg, ${e.target.value}, ${end})` });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-[9px] text-text-muted block">Fin</label>
                                <input
                                    type="color"
                                    className="w-full h-6 rounded cursor-pointer border border-border"
                                    onChange={(e) => {
                                        const current = styles.backgroundImage || '';
                                        const match = current.match(/(\d+)deg,\s*(.+?),\s*(.+?)\)/);
                                        const angle = match ? match[1] : '90';
                                        const start = match ? match[2] : '#EC1E24';
                                        updateStyles(selectedId, { backgroundImage: `linear-gradient(${angle}deg, ${start}, ${e.target.value})` });
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] text-text-muted block">Ángulo (Deg)</label>
                            <input
                                type="range" min="0" max="360"
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                onChange={(e) => {
                                    const current = styles.backgroundImage || '';
                                    const match = current.match(/(\d+)deg,\s*(.+?),\s*(.+?)\)/);
                                    const start = match ? match[2] : '#EC1E24';
                                    const end = match ? match[3] : '#FBBF24';
                                    updateStyles(selectedId, { backgroundImage: `linear-gradient(${e.target.value}deg, ${start}, ${end})` });
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
