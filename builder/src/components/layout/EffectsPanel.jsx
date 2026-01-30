
import React from 'react';

const SliderControl = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = 'px' }) => (
    <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500 font-bold">{label}</span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{value || 0}{unit}</span>
        </div>
        <input
            type="range"
            min={min} max={max} step={step}
            value={value || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
    </div>
);

export const EffectsPanel = ({ selectedId, styles, updateStyles }) => {

    // Helper for Borders
    const handleBorderChange = (corner, val) => {
        const current = styles.borderRadius ? styles.borderRadius.split(' ') : ['4px'];
        let [tl, tr, br, bl] = current.length === 4 ? current : [current[0], current[0], current[0], current[0]]; // Expand shorthand

        // Normalize if single value
        if (current.length === 1) { tl = tr = br = bl = current[0]; }

        switch (corner) {
            case 'tl': tl = `${val}px`; break;
            case 'tr': tr = `${val}px`; break;
            case 'br': br = `${val}px`; break;
            case 'bl': bl = `${val}px`; break;
            case 'all': tl = tr = br = bl = `${val}px`; break;
        }

        updateStyles(selectedId, { borderRadius: `${tl} ${tr} ${br} ${bl}` });
    };

    const getBorderValue = (corner) => {
        const current = styles.borderRadius ? styles.borderRadius.split(' ') : ['4px'];
        if (current.length === 1) return parseInt(current[0]);

        const [tl, tr, br, bl] = current;
        switch (corner) {
            case 'tl': return parseInt(tl);
            case 'tr': return parseInt(tr);
            case 'br': return parseInt(br);
            case 'bl': return parseInt(bl);
            default: return parseInt(current[0]);
        }
    };


    // Helper for Shadows
    const handleShadowChange = (prop, val) => {
        // Parse current shadow: "0px 10px 15px -3px rgba(0,0,0,0.1)"
        // This is complex regex parsing, let's simplify by storing shadow props separately in state if possible, 
        // or just reconstructing. For robust parsing we'd need a utility.
        // Simplified approach: assumed strict format "Xpx Ypx Bpx Spx Color"

        // Use a simpler approach: Store a hidden property "shadowConfig" on the node? 
        // Or just parse loosely. Let's try to parse loosely or default.

        let x = 0, y = 10, blur = 15, spread = -3, color = 'rgba(0,0,0,0.1)';

        if (styles.boxShadow && styles.boxShadow !== 'none') {
            const parts = styles.boxShadow.match(/(-?\d+px)|(rgba?\(.+?\))|(#\w+)/g);
            // Basic fallback if regex fails
            if (parts && parts.length >= 4) {
                x = parseInt(parts[0]);
                y = parseInt(parts[1]);
                blur = parseInt(parts[2]);
                spread = parseInt(parts[3]);
                // Color is usually the rest or last
                const colorMatch = styles.boxShadow.match(/(rgba?\(.+?\))|(#\w{3,6})/);
                if (colorMatch) color = colorMatch[0];
            }
        }

        if (prop === 'x') x = val;
        if (prop === 'y') y = val;
        if (prop === 'blur') blur = val;
        if (prop === 'spread') spread = val;
        if (prop === 'color') color = val; // Assuming hex or rgba string passed

        updateStyles(selectedId, { boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}` });
    };

    // Helper to get current shadow values
    const getShadowValues = () => {
        let x = 0, y = 4, blur = 6, spread = -1, color = 'rgba(0,0,0,0.1)';
        if (styles.boxShadow && styles.boxShadow !== 'none') {
            // Very basic parser, assumes standard order
            const nums = styles.boxShadow.match(/-?\d+px/g);
            if (nums) {
                if (nums[0]) x = parseInt(nums[0]);
                if (nums[1]) y = parseInt(nums[1]);
                if (nums[2]) blur = parseInt(nums[2]);
                if (nums[3]) spread = parseInt(nums[3]);
            }
            // Extract color
            const col = styles.boxShadow.replace(/-?\d+px/g, '').trim();
            if (col) color = col;
        }
        return { x, y, blur, spread, color };
    };

    const shadow = getShadowValues();


    return (
        <div className="space-y-6 pt-2">

            {/* Borders Section */}
            <div className="border-b border-border pb-4 space-y-3">
                <h3 className="text-xs font-bold text-text mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary p-1 rounded"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg></span>
                        Bordes (Radius)
                    </span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                    <SliderControl label="Sup. Izq" value={getBorderValue('tl')} onChange={(v) => handleBorderChange('tl', v)} max={50} />
                    <SliderControl label="Sup. Der" value={getBorderValue('tr')} onChange={(v) => handleBorderChange('tr', v)} max={50} />
                    <SliderControl label="Inf. Izq" value={getBorderValue('bl')} onChange={(v) => handleBorderChange('bl', v)} max={50} />
                    <SliderControl label="Inf. Der" value={getBorderValue('br')} onChange={(v) => handleBorderChange('br', v)} max={50} />
                </div>

                <button
                    onClick={() => handleBorderChange('all', 0)}
                    className="text-[10px] text-red-400 hover:text-red-500 w-full text-right"
                >Resetear Bordes</button>
            </div>

            {/* Shadows Section */}
            <div className="border-b border-border pb-4 space-y-3">
                <h3 className="text-xs font-bold text-text mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary p-1 rounded"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>
                        Sombra (Box Shadow)
                    </span>
                    <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={styles.boxShadow && styles.boxShadow !== 'none'}
                            onChange={(e) => updateStyles(selectedId, { boxShadow: e.target.checked ? '0px 10px 15px -3px rgba(0,0,0,0.1)' : 'none' })}
                        /> Activar
                    </label>
                </h3>

                {styles.boxShadow && styles.boxShadow !== 'none' && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                            <SliderControl label="X (Eje Horizontal)" value={shadow.x} onChange={(v) => handleShadowChange('x', v)} min={-50} max={50} />
                            <SliderControl label="Y (Eje Vertical)" value={shadow.y} onChange={(v) => handleShadowChange('y', v)} min={-50} max={50} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <SliderControl label="Blur (Desenfoque)" value={shadow.blur} onChange={(v) => handleShadowChange('blur', v)} max={100} />
                            <SliderControl label="Spread (Expansión)" value={shadow.spread} onChange={(v) => handleShadowChange('spread', v)} min={-20} max={50} />
                        </div>

                        {/* Color Picker for Shadow */}
                        <div>
                            <label className="text-[10px] text-text-muted font-bold mb-1 block">Color Sombra</label>
                            <div className="flex gap-2 items-center">
                                {/* Simple hex picker won't work perfectly for rgba, strictly requires a color picker component with alpha. 
                                     For now, using basic hex toggle or preset opacities could be easier, 
                                     but let's just stick to a text input for RGBA manual control + Hex picker base */}
                                <input
                                    type="text"
                                    value={shadow.color}
                                    onChange={(e) => handleShadowChange('color', e.target.value)}
                                    className="w-full text-xs p-1.5 border border-border rounded bg-surface-highlight text-text font-mono"
                                />
                            </div>
                            <p className="text-[9px] text-text-muted mt-1">Usa rgba(0,0,0,0.5) para transparencia.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters (Backdrop) */}
            <div className="pb-2 space-y-3">
                <h3 className="text-xs font-bold text-text mb-2 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg></span>
                    Filtros & Efectos
                </h3>
                <SliderControl label="Brightness (Brillo)" value={parseInt(styles.filter?.match(/brightness\((\d+)%\)/)?.[1] || 100)} onChange={(v) => updateStyles(selectedId, { filter: `brightness(${v}%) contrast(${parseInt(styles.filter?.match(/contrast\((\d+)%\)/)?.[1] || 100)}%) saturate(${parseInt(styles.filter?.match(/saturate\((\d+)%\)/)?.[1] || 100)}%) blur(${parseInt(styles.filter?.match(/blur\((\d+)px\)/)?.[1] || 0)}px)` })} max={200} unit="%" />
                <SliderControl label="Contrast (Contraste)" value={parseInt(styles.filter?.match(/contrast\((\d+)%\)/)?.[1] || 100)} onChange={(v) => updateStyles(selectedId, { filter: `brightness(${parseInt(styles.filter?.match(/brightness\((\d+)%\)/)?.[1] || 100)}%) contrast(${v}%) saturate(${parseInt(styles.filter?.match(/saturate\((\d+)%\)/)?.[1] || 100)}%) blur(${parseInt(styles.filter?.match(/blur\((\d+)px\)/)?.[1] || 0)}px)` })} max={200} unit="%" />
                <SliderControl label="Blur (Desenfoque)" value={parseInt(styles.filter?.match(/blur\((\d+)px\)/)?.[1] || 0)} onChange={(v) => updateStyles(selectedId, { filter: `brightness(${parseInt(styles.filter?.match(/brightness\((\d+)%\)/)?.[1] || 100)}%) contrast(${parseInt(styles.filter?.match(/contrast\((\d+)%\)/)?.[1] || 100)}%) saturate(${parseInt(styles.filter?.match(/saturate\((\d+)%\)/)?.[1] || 100)}%) blur(${v}px)` })} max={20} unit="px" />
            </div>

        </div>
    );
};
