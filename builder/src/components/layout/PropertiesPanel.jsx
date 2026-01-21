import React, { useState } from 'react';
import { useEditorStore, selectActivePageContent } from '../../store/useEditorStore';
import { Trash2, Type, Image, Layout, AlignLeft, AlignCenter, AlignRight, PlayCircle, HelpCircle, Info, Link } from 'lucide-react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

// Simple Tooltip/Popover Component using Portal to avoid clipping
const PropertyHelp = ({ title, description }) => {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = React.useRef(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position to the left of the button
            setCoords({
                top: rect.top, // Align top
                left: rect.left - 200 // 200px approx width to the left
            });
            setShow(true);
        }
    };

    return (
        <>
            <button
                ref={triggerRef}
                className="text-slate-300 hover:text-indigo-500 transition-colors ml-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
            >
                <HelpCircle size={14} />
            </button>
            {show && createPortal(
                <div
                    className="fixed z-[9999] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl w-48 border border-slate-700 leading-normal pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                    style={{
                        top: coords.top,
                        left: coords.left - 10, // Slight gap
                    }}
                >
                    <strong className="block mb-1 text-indigo-300">{title}</strong>
                    {description}
                    {/* Arrow pointing right */}
                    <div className="absolute top-3 -right-1 w-2 h-2 bg-slate-800 transform rotate-45 border-t border-r border-slate-700"></div>
                </div>,
                document.body
            )}
        </>
    );
};

const SliderControl = ({ label, value, onChange, min = 0, max = 100, step = 1, helpTitle, helpDesc, unit = 'px' }) => {
    // Extract numeric value safely
    const numericValue = parseInt(value, 10) || 0;

    const handleChange = (e) => {
        onChange(`${e.target.value}${unit}`);
    };

    return (
        <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-medium block capitalize">{label}</span>
                    {helpTitle && <PropertyHelp title={helpTitle} description={helpDesc} />}
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {value || '0px'}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={numericValue}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
            />
        </div>
    );
};

export const PropertiesPanel = () => {
    // Reactive selection of page content
    const pageData = useEditorStore(selectActivePageContent);
    // Get actions and other state
    const { selectedId, updateStyles, updateContent, removeElement, updateProperty, pages, projectConfig } = useEditorStore();

    const isReact = projectConfig.targetFramework === 'react';

    // Helper to find the selected node
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

    const selectedNode = selectedId ? findNode(pageData, selectedId) : null;

    if (!selectedNode) {
        return (
            <div className="p-6 text-center text-slate-400 flex flex-col items-center gap-4 mt-10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Layout className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm">Selecciona un elemento en el lienzo para editar sus propiedades.</p>
                <div className={clsx(
                    "text-xs px-2 py-1 rounded border",
                    isReact ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"
                )}>
                    Modo: {isReact ? 'React + JSX' : 'HTML Standard'}
                </div>
            </div>
        );
    }

    const handleChangeStyle = (key, value) => {
        updateStyles(selectedId, { [key]: value });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                        {selectedNode.type === 'text' && <Type size={14} />}
                        {selectedNode.type === 'image' && <Image size={14} />}
                        {selectedNode.type === 'video' && <PlayCircle size={14} />}
                        {selectedNode.type === 'section' && <Layout size={14} />}
                        {selectedNode.type.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {isReact ? `<${selectedNode.type === 'section' ? 'Section' : selectedNode.type} />` : `<${selectedNode.type}>`}
                    </span>
                </div>

                {selectedNode.id !== 'root' && (
                    <button
                        onClick={() => removeElement(selectedId)}
                        className="text-red-500 hover:bg-red-100 p-1.5 rounded-md transition-colors border border-red-200 bg-red-50"
                        title="Eliminar elemento"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Interaction / Link Section */}
                {selectedNode.id !== 'root' && (
                    <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                                <Link size={14} /> Configuración de Enlace
                            </label>
                            <PropertyHelp title="Interacción" description="Define el destino del clic (Página interna o URL externa)." />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Acción</span>
                            <select
                                value={selectedNode.interaction?.type || 'none'}
                                onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, type: e.target.value })}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white mb-2"
                            >
                                <option value="none">Ninguna</option>
                                <option value="link">Ir a Página (Interna)</option>
                                <option value="url">Link Externo</option>
                            </select>

                            {selectedNode.interaction?.type === 'link' && (
                                <div className="animate-in fade-in slide-in-from-top-1">
                                    <span className="text-[10px] text-slate-400 mb-1 block">Página Destino</span>
                                    <select
                                        value={selectedNode.interaction?.targetPageId || ''}
                                        onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, targetPageId: e.target.value })}
                                        className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {pages.map(page => (
                                            <option key={page.id} value={page.id}>{page.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedNode.interaction?.type === 'url' && (
                                <div className="animate-in fade-in slide-in-from-top-1">
                                    <span className="text-[10px] text-slate-400 mb-1 block">URL</span>
                                    <input
                                        type="text"
                                        placeholder="https://google.com"
                                        value={selectedNode.interaction?.url || ''}
                                        onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, url: e.target.value })}
                                        className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* Metadata (ID & Class) */}
                <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center">
                        <label className="text-xs font-semibold text-slate-700">
                            {isReact ? 'Props y Atributos' : 'Atributos HTML'}
                        </label>
                        <PropertyHelp title="Identificadores" description="Clases e IDs para estilizado y selección." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">ID</span>
                            <input
                                type="text"
                                value={selectedNode.htmlId || ''}
                                placeholder={selectedNode.id}
                                onChange={(e) => updateProperty(selectedId, 'htmlId', e.target.value)}
                                className="w-full p-2 text-xs border border-slate-200 rounded text-slate-600 focus:outline-none focus:border-indigo-500 placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <span className={clsx("text-[10px] mb-1 block font-mono", isReact ? "text-blue-500 font-bold" : "text-slate-400")}>
                                {isReact ? 'className' : 'class'}
                            </span>
                            <input
                                type="text"
                                value={selectedNode.className || ''}
                                onChange={(e) => useEditorStore.getState().updateProperty(selectedId, 'className', e.target.value)}
                                placeholder={isReact ? "Ej: text-blue-500" : "Ej: mi-clase"}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Background Component Specific Controls */}
                {selectedNode.type === 'background' && (
                    <div className="space-y-4">
                        <label className="text-xs font-semibold text-slate-700">Propiedades de Fondo</label>

                        {/* Type Selector */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => {
                                    updateProperty(selectedId, 'backgroundConfig', { ...selectedNode.backgroundConfig, type: 'solid' });
                                    updateStyles(selectedId, { backgroundImage: 'none', backgroundColor: selectedNode.styles.backgroundColor || '#cbd5e1' });
                                }}
                                className={clsx("flex-1 text-xs py-1.5 rounded-md transition-all font-medium", (!selectedNode.backgroundConfig?.type || selectedNode.backgroundConfig?.type === 'solid') ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700")}
                            >
                                Sólido
                            </button>
                            <button
                                onClick={() => {
                                    const newConfig = {
                                        type: 'gradient',
                                        direction: 135,
                                        startColor: selectedNode.styles.backgroundColor || '#6366f1',
                                        endColor: '#a855f7'
                                    };
                                    updateProperty(selectedId, 'backgroundConfig', { ...selectedNode.backgroundConfig, ...newConfig });
                                    updateStyles(selectedId, { backgroundImage: `linear-gradient(${newConfig.direction}deg, ${newConfig.startColor}, ${newConfig.endColor})` });
                                }}
                                className={clsx("flex-1 text-xs py-1.5 rounded-md transition-all font-medium", selectedNode.backgroundConfig?.type === 'gradient' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700")}
                            >
                                Gradiente
                            </button>
                        </div>

                        {/* Solid Mode */}
                        {(!selectedNode.backgroundConfig?.type || selectedNode.backgroundConfig?.type === 'solid') && (
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold block mb-1">Color Sólido</label>
                                <div className="flex gap-2">
                                    <div
                                        className="w-10 h-10 rounded border border-slate-200 cursor-pointer shadow-sm relative overflow-hidden"
                                        style={{ backgroundColor: selectedNode.styles.backgroundColor || 'transparent' }}
                                    >
                                        <input
                                            type="color"
                                            value={selectedNode.styles.backgroundColor || '#cbd5e1'}
                                            onChange={(e) => updateStyles(selectedId, { backgroundColor: e.target.value })}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={selectedNode.styles.backgroundColor || ''}
                                        placeholder="#cbd5e1"
                                        onChange={(e) => updateStyles(selectedId, { backgroundColor: e.target.value })}
                                        className="flex-1 p-2 text-xs border border-slate-200 rounded"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Gradient Mode */}
                        {selectedNode.backgroundConfig?.type === 'gradient' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                                <SliderControl
                                    label={`Ángulo: ${selectedNode.backgroundConfig?.direction || 135}°`}
                                    value={selectedNode.backgroundConfig?.direction || 135}
                                    onChange={(val) => {
                                        const config = { ...selectedNode.backgroundConfig, direction: val };
                                        updateProperty(selectedId, 'backgroundConfig', config);
                                        updateStyles(selectedId, { backgroundImage: `linear-gradient(${val}deg, ${config.startColor}, ${config.endColor})` });
                                    }}
                                    max={360}
                                    step={5}
                                    unit=""
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Inicio</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded border border-slate-200 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom right, ${selectedNode.backgroundConfig?.startColor}, transparent)` }}>
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                    value={selectedNode.backgroundConfig?.startColor || '#ffffff'}
                                                    onChange={(e) => {
                                                        const config = { ...selectedNode.backgroundConfig, startColor: e.target.value };
                                                        updateProperty(selectedId, 'backgroundConfig', config);
                                                        updateStyles(selectedId, { backgroundImage: `linear-gradient(${config.direction}deg, ${e.target.value}, ${config.endColor})` });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Fin</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded border border-slate-200 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${selectedNode.backgroundConfig?.endColor})` }}>
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                    value={selectedNode.backgroundConfig?.endColor || '#000000'}
                                                    onChange={(e) => {
                                                        const config = { ...selectedNode.backgroundConfig, endColor: e.target.value };
                                                        updateProperty(selectedId, 'backgroundConfig', config);
                                                        updateStyles(selectedId, { backgroundImage: `linear-gradient(${config.direction}deg, ${config.startColor}, ${e.target.value})` });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* Content Editing (Text/Image/Video/Button/Link) */}
                {(selectedNode.type === 'text' || selectedNode.type === 'image' || selectedNode.type === 'video' || selectedNode.type === 'button' || selectedNode.type === 'link') && (
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-700">Contenido / Texto</label>
                        {(selectedNode.type === 'text' || selectedNode.type === 'button' || selectedNode.type === 'link') ? (
                            <textarea
                                value={selectedNode.content}
                                onChange={(e) => updateContent(selectedId, e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                            />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={selectedNode.content}
                                    onChange={(e) => updateContent(selectedId, e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder={selectedNode.type === 'image' ? (isReact ? "src prop" : "src url") : "video src"}
                                />

                                {/* Size & Layout Controls */}
                                <div className="mt-2 space-y-2">
                                    <SliderControl
                                        label="Ancho"
                                        value={selectedNode.styles.width}
                                        onChange={(val) => updateStyles(selectedId, { width: val })}
                                        max={1200}
                                        step={10}
                                        helpTitle="Ancho"
                                        helpDesc="Ancho de la imagen/video en píxeles."
                                    />
                                    <SliderControl
                                        label="Alto"
                                        value={selectedNode.styles.height}
                                        onChange={(val) => updateStyles(selectedId, { height: val })}
                                        max={800}
                                        step={10}
                                        helpTitle="Alto"
                                        helpDesc="Alto de la imagen/video en píxeles."
                                    />

                                    {/* Layout Mode Toggle */}
                                    {(selectedNode.type === 'container' || selectedNode.type === 'section') && (
                                        <div className="col-span-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-[10px] uppercase font-bold text-indigo-700 flex items-center gap-1">
                                                    Modo de Diseño <PropertyHelp title="Modo de Diseño" description="Flex (Apilado): Elementos uno tras otro. Libre (Absoluto): Mueve elementos a cualquier pixel." />
                                                </label>
                                                <div className="flex bg-white rounded border border-indigo-200 p-0.5">
                                                    <button
                                                        onClick={() => useEditorStore.getState().updateProperty(selectedId, 'layoutMode', 'stack')}
                                                        className={clsx("px-2 py-1 text-[10px] rounded", selectedNode.layoutMode !== 'free' ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-50")}
                                                    >
                                                        Flex
                                                    </button>
                                                    <button
                                                        onClick={() => useEditorStore.getState().updateProperty(selectedId, 'layoutMode', 'free')}
                                                        className={clsx("px-2 py-1 text-[10px] rounded", selectedNode.layoutMode === 'free' ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-50")}
                                                    >
                                                        Libre
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-indigo-600/70 leading-tight">
                                                {selectedNode.layoutMode === 'free' ? 'Arrastra elementos libremente.' : 'Los elementos se ordenan automáticamente.'}
                                            </p>
                                        </div>
                                    )}

                                    <div className="col-span-2 mt-2">
                                        <label className="text-[10px] text-slate-500 font-bold block mb-1 flex items-center gap-1">
                                            Fondo <PropertyHelp title="Color de Fondo" description="Cambia el color de fondo del elemento. Usa códigos Hex (#fff) o nombres (red)." />
                                        </label>
                                        <div className="flex gap-2">
                                            <div
                                                className="w-8 h-8 rounded border border-slate-200 cursor-pointer shadow-sm"
                                                style={{ backgroundColor: selectedNode.styles.backgroundColor || 'transparent' }}
                                                onClick={() => {
                                                    const input = document.getElementById('bg-color-picker');
                                                    if (input) input.click();
                                                }}
                                            />
                                            <input
                                                id="bg-color-picker"
                                                type="color"
                                                value={selectedNode.styles.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChangeStyle('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={selectedNode.styles.backgroundColor || ''}
                                                placeholder="#ffffff"
                                                onChange={(e) => handleChangeStyle('backgroundColor', e.target.value)}
                                                className="flex-1 p-1.5 text-xs border border-slate-200 rounded"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Modo de Visualización</label>
                                    <select
                                        className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white outline-none"
                                        value={selectedNode.styles.objectFit === 'cover' && selectedNode.styles.position === 'absolute' ? 'cover' : 'normal'}
                                        onChange={(e) => {
                                            const mode = e.target.value;
                                            if (mode === 'cover') {
                                                updateStyles(selectedId, {
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    zIndex: '0'
                                                });
                                            } else {
                                                updateStyles(selectedId, {
                                                    position: 'static',
                                                    width: '', // revert to default/auto
                                                    height: '',
                                                    objectFit: 'contain',
                                                    top: '',
                                                    left: '',
                                                    zIndex: ''
                                                });
                                            }
                                        }}
                                    >
                                        <option value="normal">Normal (Contenido en caja)</option>
                                        <option value="cover">Full Screen / Fondo (Cubrir todo)</option>
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        "Full Screen" cubrirá todo el contenedor padre (ideal para fondos).
                                    </p>
                                </div>

                                {selectedNode.type === 'image' && (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        updateContent(selectedId, ev.target.result);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <div className="w-full p-2 text-sm bg-slate-50 border border-slate-200 border-dashed rounded-lg text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                                            <Image size={16} />
                                            <span>Subir imagen {isReact ? '(local)' : ''}</span>
                                        </div>
                                    </div>
                                )}

                                {selectedNode.type === 'video' && (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    updateContent(selectedId, url);
                                                }
                                            }}
                                        />
                                        <div className="w-full p-2 text-sm bg-slate-50 border border-slate-200 border-dashed rounded-lg text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                                            <PlayCircle size={16} />
                                            <span>Subir video {isReact ? '(local import)' : ''}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNode.styles.controls !== false}
                                                    onChange={(e) => handleChangeStyle('controls', e.target.checked)}
                                                />
                                                Controles
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNode.styles.autoPlay || false}
                                                    onChange={(e) => handleChangeStyle('autoPlay', e.target.checked)}
                                                />
                                                Autoplay
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNode.styles.loop || false}
                                                    onChange={(e) => handleChangeStyle('loop', e.target.checked)}
                                                />
                                                Loop
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNode.styles.muted || false}
                                                    onChange={(e) => handleChangeStyle('muted', e.target.checked)}
                                                />
                                                Muted
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Specific Controls for New Components */}
                {selectedNode.type === 'icon' && (
                    <div className="space-y-3 pb-4 border-b border-slate-100">
                        <label className="text-xs font-semibold text-slate-700">Configuración de Icono</label>

                        {/* Icon Name */}
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Nombre (Lucide)</span>
                            <input
                                type="text"
                                value={!selectedNode.content?.startsWith('<svg') ? selectedNode.content : ''}
                                onChange={(e) => updateContent(selectedId, e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                placeholder="Ej: Star, Home, ShoppingCart..."
                            />
                        </div>

                        {/* Icon Size */}
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Tamaño del Icono</span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="12" max="128" step="4"
                                    value={parseInt(selectedNode.styles.fontSize) || 24}
                                    onChange={(e) => handleChangeStyle('fontSize', `${e.target.value}px`)}
                                    className="flex-1"
                                />
                                <span className="text-xs font-mono text-slate-500 w-12 text-right">{selectedNode.styles.fontSize || '24px'}</span>
                            </div>
                        </div>

                        {/* Custom SVG Import */}
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Importar SVG (Opcional)</span>
                            <textarea
                                value={selectedNode.content?.startsWith('<svg') ? selectedNode.content : ''}
                                onChange={(e) => updateContent(selectedId, e.target.value)}
                                className="w-full p-2 text-[10px] font-mono border border-slate-200 rounded-lg h-20"
                                placeholder="<svg ...>...</svg>"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Pega aquí el código SVG para usar un icono personalizado.</p>
                        </div>
                    </div>
                )}


                {
                    selectedNode.type === 'spacer' && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Altura del Espaciador</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="10" max="300" step="10"
                                    value={parseInt(selectedNode.styles.height) || 50}
                                    onChange={(e) => handleChangeStyle('height', `${e.target.value}px`)}
                                    className="flex-1"
                                />
                                <span className="text-xs font-mono text-slate-500 w-12 text-right">{selectedNode.styles.height}</span>
                            </div>
                        </div>
                    )
                }

                {
                    selectedNode.type === 'productGrid' && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Columnas</label>
                            <div className="flex gap-2">
                                {[2, 3, 4].map(cols => (
                                    <button
                                        key={cols}
                                        onClick={() => handleChangeStyle('gridTemplateColumns', `repeat(${cols}, 1fr)`)}
                                        className={clsx(
                                            "px-3 py-1.5 text-xs rounded border transition-colors flex-1",
                                            selectedNode.styles.gridTemplateColumns?.includes(cols)
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {cols} Cols
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }

                {
                    selectedNode.type === 'countdown' && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Fecha Objetivo</label>
                            <input
                                type="datetime-local"
                                value={selectedNode.targetDate ? selectedNode.targetDate.substring(0, 16) : ''}
                                onChange={(e) => updateProperty(selectedId, 'targetDate', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                    )
                }

                {
                    (selectedNode.type === 'input' || selectedNode.type === 'textarea') && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Propiedades de Input</label>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-[10px] text-slate-400 mb-1 block">Placeholder</span>
                                    <input
                                        type="text"
                                        value={selectedNode.placeholder || ''}
                                        onChange={(e) => updateProperty(selectedId, 'placeholder', e.target.value)}
                                        className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                    />
                                </div>
                                {selectedNode.type === 'input' && (
                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Tipo</span>
                                        <select
                                            value={selectedNode.inputType || 'text'}
                                            onChange={(e) => updateProperty(selectedId, 'inputType', e.target.value)}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                                        >
                                            <option value="text">Texto</option>
                                            <option value="email">Email</option>
                                            <option value="password">Password</option>
                                            <option value="number">Número</option>
                                            <option value="date">Fecha</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {
                    (selectedNode.type === 'button' || selectedNode.type === 'label' || selectedNode.type === 'link' || selectedNode.type === 'checkbox') && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Texto / Etiqueta</label>
                            <input
                                type="text"
                                value={selectedNode.content}
                                onChange={(e) => updateContent(selectedId, e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                    )
                }

                {
                    selectedNode.type === 'link' && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Link Destino</label>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Href (URL)</span>
                                <input
                                    type="text"
                                    value={selectedNode.href || '#'}
                                    onChange={(e) => updateProperty(selectedId, 'href', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>
                    )
                }

                {
                    selectedNode.type === 'select' && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700">Opciones</label>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Lista (separada por comas)</span>
                                <textarea
                                    value={selectedNode.options || ''}
                                    onChange={(e) => updateProperty(selectedId, 'options', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg h-20"
                                    placeholder="Opción 1, Opción 2..."
                                />
                            </div>
                        </div>
                    )
                }

                {/* Checkbox State */}
                {
                    selectedNode.type === 'checkbox' && (
                        <div className="space-y-3 pb-4 border-b border-slate-100">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedNode.checked || false}
                                    onChange={(e) => updateProperty(selectedId, 'checked', e.target.checked)}
                                />
                                Marcado por defecto
                            </label>
                        </div>
                    )
                }

                {/* Premium Header Features */}
                {selectedNode.type === 'header' && (
                    <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-700">Efecto Glass (Liquid)</label>
                            <input
                                type="checkbox"
                                checked={selectedNode.styles.backdropFilter === 'blur(12px)'}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        updateStyles(selectedId, {
                                            position: 'sticky',
                                            top: '0',
                                            zIndex: '50',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(12px)',
                                            WebkitBackdropFilter: 'blur(12px)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                                        });
                                    } else {
                                        updateStyles(selectedId, {
                                            position: 'relative',
                                            top: 'auto',
                                            zIndex: 'auto',
                                            backgroundColor: '#ffffff',
                                            backdropFilter: 'none',
                                            WebkitBackdropFilter: 'none',
                                            borderBottom: '1px solid #e2e8f0',
                                            boxShadow: 'none'
                                        });
                                    }
                                }}
                                className="accent-indigo-600"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">
                            Hace que el header sea pegajoso y borroso al hacer scroll.
                        </p>
                    </div>
                )}

                {/* Advanced Background Manager */}
                {(['section', 'container', 'header', 'footer'].includes(selectedNode.type) || selectedNode.id === 'root') && (
                    <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center">
                            <label className="text-xs font-semibold text-slate-700">Fondo Avanzado</label>
                            <PropertyHelp title="Backgrounds" description="Elige entre Sólido, Gradiente o Imagen con Parallax." />
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {['solid', 'gradient', 'image'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => updateProperty(selectedId, 'bgMode', mode)}
                                    className={clsx(
                                        "flex-1 text-[10px] font-medium py-1 rounded capitalize transition-all",
                                        (selectedNode.bgMode || 'solid') === mode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {mode === 'solid' ? 'Sólido' : mode === 'gradient' ? 'Gradiente' : 'Imagen'}
                                </button>
                            ))}
                        </div>

                        {/* Solid Mode */}
                        {(!selectedNode.bgMode || selectedNode.bgMode === 'solid') && (
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Color Sólido</span>
                                <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                                    <input
                                        type="color"
                                        value={selectedNode.styles.backgroundColor || '#ffffff'}
                                        onChange={(e) => handleChangeStyle('backgroundColor', e.target.value)}
                                        className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                    />
                                    <input
                                        type="text"
                                        value={selectedNode.styles.backgroundColor || ''}
                                        onChange={(e) => handleChangeStyle('backgroundColor', e.target.value)}
                                        className="w-full text-xs outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Gradient Mode */}
                        {selectedNode.bgMode === 'gradient' && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Inicio</span>
                                        <input type="color" className="w-full h-8 cursor-pointer rounded"
                                            onChange={(e) => {
                                                const end = selectedNode.styles.backgroundImage?.includes('to right') ? selectedNode.styles.backgroundImage.split(',')[2].trim().slice(0, -1) : '#000000';
                                                handleChangeStyle('backgroundImage', `linear-gradient(to right, ${e.target.value}, ${end || '#000000'})`);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Fin</span>
                                        <input type="color" className="w-full h-8 cursor-pointer rounded"
                                            onChange={(e) => {
                                                const start = selectedNode.styles.backgroundImage?.includes('to right') ? selectedNode.styles.backgroundImage.split(',')[1].trim() : '#ffffff';
                                                handleChangeStyle('backgroundImage', `linear-gradient(to right, ${start || '#ffffff'}, ${e.target.value})`);
                                            }}
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-400">Selecciona dos colores para crear el degradado.</p>
                            </div>
                        )}

                        {/* Image Mode */}
                        {selectedNode.bgMode === 'image' && (
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[10px] text-slate-400 mb-1 block">URL Imagen</span>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full p-2 text-xs border border-slate-200 rounded"
                                        value={selectedNode.styles.backgroundImage?.replace('url("', '').replace('")', '') || ''}
                                        onChange={(e) => handleChangeStyle('backgroundImage', `url("${e.target.value}")`)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-600">Cubrir Todo (Cover)</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedNode.styles.backgroundSize === 'cover'}
                                        onChange={(e) => handleChangeStyle('backgroundSize', e.target.checked ? 'cover' : 'auto')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-600">Efecto Parallax</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedNode.styles.backgroundAttachment === 'fixed'}
                                        onChange={(e) => handleChangeStyle('backgroundAttachment', e.target.checked ? 'fixed' : 'scroll')}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Typography */}
                {
                    (selectedNode.type === 'text' || selectedNode.id === 'root') && (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <label className="text-xs font-semibold text-slate-700">Tipografía</label>
                                <PropertyHelp title="Texto" description="Ajusta el tamaño, color y alineación." />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className={clsx("text-[10px] mb-1 block", isReact ? "font-mono text-slate-500" : "text-slate-400")}>
                                        {isReact ? 'fontSize' : 'Tamaño'}
                                    </span>
                                    <input
                                        type="text"
                                        value={selectedNode.styles.fontSize || ''}
                                        onChange={(e) => handleChangeStyle('fontSize', e.target.value)}
                                        className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <span className={clsx("text-[10px] mb-1 block", isReact ? "font-mono text-slate-500" : "text-slate-400")}>
                                        {isReact ? 'color' : 'Color'}
                                    </span>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                                        <input
                                            type="color"
                                            value={selectedNode.styles.color || '#000000'}
                                            onChange={(e) => handleChangeStyle('color', e.target.value)}
                                            className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                        />
                                        <input
                                            type="text"
                                            value={selectedNode.styles.color || ''}
                                            onChange={(e) => handleChangeStyle('color', e.target.value)}
                                            className="w-full text-xs outline-none bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleChangeStyle('textAlign', align)}
                                        className={`flex-1 p-1 rounded flex justify-center ${selectedNode.styles.textAlign === align ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {align === 'left' && <AlignLeft size={14} />}
                                        {align === 'center' && <AlignCenter size={14} />}
                                        {align === 'right' && <AlignRight size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Layout & Spacing */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <label className="text-xs font-semibold text-slate-700">Diseño</label>
                        <PropertyHelp title="Layout" description="Controla cómo se ubica este elemento (position) y sus dimensiones." />
                    </div>

                    {/* Semantic Class Name */}
                    <div>
                        <span className="text-[10px] text-slate-400 mb-1 block">Nombre de Capa (Clase CSS)</span>
                        <input
                            type="text"
                            value={selectedNode.className || ''}
                            placeholder={`Ej: ${selectedNode.type}-hero`}
                            onChange={(e) => {
                                // Basic sanitization for display, full sanitization happens on export
                                const val = e.target.value.replace(/[^a-zA-Z0-9-_ ]/g, '');
                                updateProperty(selectedId, 'className', val);
                            }}
                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 outline-none transition-colors"
                        />
                        <span className="text-[9px] text-slate-400 mt-0.5 block">
                            Se usará como class="{selectedNode.className?.toLowerCase().replace(/\s+/g, '-') || '...'}"
                        </span>
                    </div>

                    {/* Position (Free Layout) - Hide for Page/Background */}
                    {selectedNode.type !== 'background' && selectedNode.type !== 'page' && (
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Posición</span>
                            <select
                                value={selectedNode.styles.position || 'static'}
                                onChange={(e) => handleChangeStyle('position', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                            >
                                <option value="static">Automático (Static)</option>
                                <option value="relative">Relativo</option>
                                <option value="absolute">Libre (Absolute)</option>
                                <option value="fixed">Fijo (Fixed)</option>
                            </select>
                        </div>
                    )}

                    {(selectedNode.styles.position === 'absolute' || selectedNode.styles.position === 'fixed' || selectedNode.styles.position === 'relative') && selectedNode.type !== 'background' && selectedNode.type !== 'page' && (
                        <div className="space-y-4 pt-2 border-t border-slate-50 mt-2">
                            <div className="flex items-center">
                                <label className="text-xs font-semibold text-slate-700">Coordenadas</label>
                                <PropertyHelp title="Posición" description="Mueve el elemento en píxeles desde los bordes." />
                            </div>
                            <div className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm space-y-2">
                                <SliderControl
                                    label="Top (Arriba)"
                                    value={selectedNode.styles.top}
                                    onChange={(val) => handleChangeStyle('top', val)}
                                    max={1000}
                                    helpTitle="Top"
                                    helpDesc="Distancia desde arriba."
                                />
                                <SliderControl
                                    label="Left (Izquierda)"
                                    value={selectedNode.styles.left}
                                    onChange={(val) => handleChangeStyle('left', val)}
                                    max={1000}
                                    helpTitle="Left"
                                    helpDesc="Distancia desde la izquierda."
                                />
                                <SliderControl
                                    label="Right (Derecha)"
                                    value={selectedNode.styles.right}
                                    onChange={(val) => handleChangeStyle('right', val)}
                                    max={1000}
                                    helpTitle="Right"
                                    helpDesc="Distancia desde la derecha."
                                />
                                <SliderControl
                                    label="Bottom (Abajo)"
                                    value={selectedNode.styles.bottom}
                                    onChange={(val) => handleChangeStyle('bottom', val)}
                                    max={1000}
                                    helpTitle="Bottom"
                                    helpDesc="Distancia desde abajo."
                                />

                                <div className="pt-2 border-t border-slate-50">
                                    <span className="text-[10px] text-slate-400 mb-1 block">Z-Index (Capas)</span>
                                    <input
                                        type="number"
                                        value={selectedNode.styles.zIndex || ''}
                                        onChange={(e) => handleChangeStyle('zIndex', e.target.value)}
                                        className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Background & Gradient */}
                    {selectedNode.type !== 'background' && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className={clsx("text-[10px] block", isReact ? "font-mono text-slate-500" : "text-slate-400")}>
                                    {isReact ? 'background' : 'Fondo'}
                                </span>
                                <div className="flex bg-slate-100 rounded p-0.5">
                                    <button
                                        className={`px-2 py-0.5 text-[10px] rounded ${!selectedNode.styles.backgroundImage ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
                                        onClick={() => {
                                            handleChangeStyle('backgroundImage', '');
                                            handleChangeStyle('backgroundColor', '#ffffff');
                                        }}
                                    >
                                        Color
                                    </button>
                                    <button
                                        className={`px-2 py-0.5 text-[10px] rounded ${selectedNode.styles.backgroundImage ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
                                        onClick={() => handleChangeStyle('backgroundImage', 'linear-gradient(to bottom, #ffffff, #f1f5f9)')}
                                    >
                                        Gradiente
                                    </button>
                                </div>
                            </div>

                            {!selectedNode.styles.backgroundImage ? (
                                <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                                    <input
                                        type="color"
                                        value={selectedNode.styles.backgroundColor || '#ffffff'}
                                        onChange={(e) => handleChangeStyle('backgroundColor', e.target.value)}
                                        className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                    />
                                    <input
                                        type="text"
                                        value={selectedNode.styles.backgroundColor || ''}
                                        onChange={(e) => handleChangeStyle('backgroundColor', e.target.value)}
                                        className="w-full text-xs outline-none bg-transparent"
                                    />
                                    {window.EyeDropper && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const eyeDropper = new window.EyeDropper();
                                                    const result = await eyeDropper.open();
                                                    handleChangeStyle('backgroundColor', result.sRGBHex);
                                                } catch (e) { }
                                            }}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="Gotero"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 22 1-1h3l9-9" /><path d="M3 21v-3l9-9" /><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.9.9" /><path d="m22 19-3 3-3-3" /></svg>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2 p-2 bg-slate-50 rounded border border-slate-200">
                                    <div className="flex gap-2">
                                        <select
                                            className="text-[10px] p-1 border rounded w-1/2"
                                            onChange={(e) => {
                                                const isRadial = e.target.value === 'radial';
                                                const current = selectedNode.styles.backgroundImage || '';
                                                // Extract colors if possible or defaults
                                                const colors = current.match(/#[0-9a-fA-F]{3,6}|rgba?\(.*?\)/g) || ['#ffffff', '#000000'];
                                                const newGrad = isRadial
                                                    ? `radial-gradient(circle, ${colors[0] || '#ffffff'} 0%, ${colors[1] || '#000000'} 100%)`
                                                    : `linear-gradient(to bottom, ${colors[0] || '#ffffff'}, ${colors[1] || '#000000'})`;
                                                handleChangeStyle('backgroundImage', newGrad);
                                            }}
                                        >
                                            <option value="linear">Lineal</option>
                                            <option value="radial">Radial</option>
                                        </select>
                                        <button className="text-[10px] text-red-400 hover:text-red-500 underline" onClick={() => handleChangeStyle('backgroundImage', '')}>Quitar</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Valid gradient editing is complex, simplification: 2 colors picker that rewrites the string */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] text-slate-400">Inicio (Centro/Top)</span>
                                            <input
                                                type="color"
                                                className="w-full h-6 rounded cursor-pointer"
                                                onChange={(e) => {
                                                    const current = selectedNode.styles.backgroundImage || '';
                                                    const isRadial = current.includes('radial');
                                                    const colors = current.match(/#[0-9a-fA-F]{3,6}|rgba?\(.*?\)/g) || ['#ffffff', '#000000'];
                                                    const newGrad = isRadial
                                                        ? `radial-gradient(circle, ${e.target.value} 0%, ${colors[1] || '#000000'} 100%)`
                                                        : `linear-gradient(to bottom, ${e.target.value}, ${colors[1] || '#000000'})`;
                                                    handleChangeStyle('backgroundColor', e.target.value); // Fallback
                                                    handleChangeStyle('backgroundImage', newGrad);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] text-slate-400">Fin (Borde/Bottom)</span>
                                            <input
                                                type="color"
                                                className="w-full h-6 rounded cursor-pointer"
                                                onChange={(e) => {
                                                    const current = selectedNode.styles.backgroundImage || '';
                                                    const isRadial = current.includes('radial');
                                                    const colors = current.match(/#[0-9a-fA-F]{3,6}|rgba?\(.*?\)/g) || ['#ffffff', '#000000'];
                                                    const newGrad = isRadial
                                                        ? `radial-gradient(circle, ${colors[0] || '#ffffff'} 0%, ${e.target.value} 100%)`
                                                        : `linear-gradient(to bottom, ${colors[0] || '#ffffff'}, ${e.target.value})`;
                                                    handleChangeStyle('backgroundImage', newGrad);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedNode.type !== 'background' && selectedNode.type !== 'page' && (
                        <div className="space-y-4 pt-2 border-t border-slate-50">
                            <div className="flex items-center">
                                <label className="text-xs font-semibold text-slate-700">Espaciado</label>
                                <PropertyHelp title="Modelo de Caja" description="Ajusta el espacio interno (Padding) y externo (Margin) usando los deslizadores." />
                            </div>

                            <div className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm">
                                <SliderControl
                                    label={isReact ? 'margin' : 'Margen'}
                                    value={selectedNode.styles.margin}
                                    onChange={(val) => handleChangeStyle('margin', val)}
                                    max={100}
                                    helpTitle="Margen"
                                    helpDesc="Espacio exterior alrededor del elemento."
                                />

                                <SliderControl
                                    label={isReact ? 'padding' : 'Padding'}
                                    value={selectedNode.styles.padding}
                                    onChange={(val) => handleChangeStyle('padding', val)}
                                    max={100}
                                    helpTitle="Padding"
                                    helpDesc="Espacio interior entre el borde y el contenido."
                                />

                                <div className="pt-2 mt-2 border-t border-slate-50">
                                    <SliderControl
                                        label={isReact ? 'gap' : 'Gap (Espacio Hijos)'}
                                        value={selectedNode.styles.gap}
                                        onChange={(val) => handleChangeStyle('gap', val)}
                                        max={64}
                                        helpTitle="Gap"
                                        helpDesc="Espacio entre elementos hijos (solo Flex/Grid)."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dimensions */}
                    {selectedNode.type !== 'background' && selectedNode.type !== 'page' && (
                        <div className="space-y-4 pt-2 border-t border-slate-50">
                            <div className="flex items-center">
                                <label className="text-xs font-semibold text-slate-700">Dimensiones</label>
                                <PropertyHelp title="Tamaño" description="Define el ancho y alto en píxeles." />
                            </div>
                            <div className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm">
                                <SliderControl
                                    label={isReact ? 'width' : 'Ancho'}
                                    value={selectedNode.styles.width}
                                    onChange={(val) => handleChangeStyle('width', val)}
                                    max={1200}
                                    step={10}
                                    helpTitle="Ancho"
                                    helpDesc="Ancho del elemento."
                                />
                                <SliderControl
                                    label={isReact ? 'height' : 'Alto'}
                                    value={selectedNode.styles.height}
                                    onChange={(val) => handleChangeStyle('height', val)}
                                    max={800}
                                    step={10}
                                    helpTitle="Alto"
                                    helpDesc="Alto del elemento."
                                />
                            </div>
                        </div>
                    )}

                    {/* Flex Direction (for containers) */}
                    {(selectedNode.type === 'section' || selectedNode.type === 'container' || selectedNode.id === 'root') && (
                        <div>
                            <div className="flex items-center gap-1">
                                <span className={clsx("text-[10px] mb-1 block", isReact ? "font-mono text-slate-500" : "text-slate-400")}>
                                    {isReact ? 'flexDirection' : 'Dirección Flex'}
                                </span>
                                <PropertyHelp title="Flex Direction" description="Dirección en la que se apilan los hijos." />
                            </div>
                            <select
                                value={selectedNode.styles.flexDirection || 'column'}
                                onChange={(e) => handleChangeStyle('flexDirection', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                            >
                                <option value="column">Columna (Vertical)</option>
                                <option value="row">Fila (Horizontal)</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Borders */}
                {selectedNode.type !== 'background' && selectedNode.type !== 'page' && (
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <label className="text-xs font-semibold text-slate-700">Bordes</label>
                            <PropertyHelp title="Bordes" description="Estiliza el contorno del elemento." />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <SliderControl
                                    label={isReact ? 'borderRadius' : 'Radio (Redondez)'}
                                    value={selectedNode.styles.borderRadius}
                                    onChange={(val) => handleChangeStyle('borderRadius', val)}
                                    max={50}
                                    helpTitle="Radio"
                                    helpDesc="Suaviza las esquinas del elemento."
                                />
                            </div>
                            <div className="pt-2 border-t border-slate-50 mt-2">
                                <span className="text-[10px] text-slate-400 mb-2 block font-semibold">Estilo de Borde</span>

                                <div className="space-y-3">
                                    <SliderControl
                                        label="Grosor"
                                        value={selectedNode.styles.borderWidth || '0px'}
                                        onChange={(val) => handleChangeStyle('borderWidth', val)}
                                        max={20}
                                        helpTitle="Grosor"
                                        helpDesc="Ancho del borde en píxeles."
                                    />

                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Tipo de Borde</span>
                                        <select
                                            value={selectedNode.styles.borderStyle || 'none'}
                                            onChange={(e) => handleChangeStyle('borderStyle', e.target.value)}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                                        >
                                            <option value="none">Ninguno</option>
                                            <option value="solid">Sólido (Solid)</option>
                                            <option value="dashed">Guiones (Dashed)</option>
                                            <option value="dotted">Puntos (Dotted)</option>
                                            <option value="double">Doble</option>
                                        </select>
                                    </div>

                                    <div>
                                        <span className="text-[10px] text-slate-400 mb-1 block">Color del Borde</span>
                                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                                            <input
                                                type="color"
                                                value={selectedNode.styles.borderColor || '#000000'}
                                                onChange={(e) => handleChangeStyle('borderColor', e.target.value)}
                                                className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                            />
                                            <input
                                                type="text"
                                                value={selectedNode.styles.borderColor || ''}
                                                onChange={(e) => handleChangeStyle('borderColor', e.target.value)}
                                                className="w-full text-xs outline-none bg-transparent"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visual Effects & Blending */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <label className="text-xs font-semibold text-slate-700">Efectos</label>
                        <PropertyHelp title="Fusión y Opacidad" description="Controla cómo se mezcla este elemento con el fondo." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Opacidad</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={selectedNode.styles.opacity || '1'}
                                    onChange={(e) => handleChangeStyle('opacity', e.target.value)}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-xs text-slate-500 w-8 text-right">{Math.round((selectedNode.styles.opacity || 1) * 100)}%</span>
                            </div>
                        </div>
                        <div>
                            <span className={clsx("text-[10px] mb-1 block", isReact ? "font-mono text-slate-500" : "text-slate-400")}>
                                {isReact ? 'mixBlendMode' : 'Modo Fusión'}
                            </span>
                            <select
                                value={selectedNode.styles.mixBlendMode || 'normal'}
                                onChange={(e) => handleChangeStyle('mixBlendMode', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                            >
                                <option value="normal">Normal</option>
                                <option value="multiply">Multiplicar</option>
                                <option value="screen">Pantalla</option>
                                <option value="overlay">Superponer</option>
                                <option value="darken">Darken</option>
                                <option value="lighten">Lighten</option>
                                <option value="difference">Diferencia</option>
                            </select>
                        </div>
                    </div>

                    {/* Masking / Fade Edges */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-semibold">Suavizar Bordes</span>
                                <span className="text-[9px] text-slate-300">Haz que parezca un PNG</span>
                            </div>
                            <PropertyHelp title="Máscara / Fusión" description="Oculta los bordes rectangulares. 'Smart Blend' aplica máscara + modo Multiplicar automáticamente." />
                        </div>

                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => {
                                    // Smart Blend Recipe: Vignette + Multiply
                                    handleChangeStyle('maskImage', 'radial-gradient(ellipse at center, black 40%, transparent 85%)');
                                    handleChangeStyle('WebkitMaskImage', 'radial-gradient(ellipse at center, black 40%, transparent 85%)');
                                    handleChangeStyle('mixBlendMode', 'multiply');
                                }}
                                className="flex-1 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-medium rounded hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                            >
                                Fusión Mágica
                            </button>
                        </div>

                        <select
                            value={selectedNode.styles.maskImage ? 'radial' : 'none'}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'radial') {
                                    // Ellipse fits 16:9 video better than circle
                                    const gradient = 'radial-gradient(ellipse at center, black 50%, transparent 90%)';
                                    handleChangeStyle('maskImage', gradient);
                                    handleChangeStyle('WebkitMaskImage', gradient);
                                } else {
                                    handleChangeStyle('maskImage', '');
                                    handleChangeStyle('WebkitMaskImage', '');
                                }
                            }}
                            className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="none">Sin Máscara</option>
                            <option value="radial">Desvanecer Bordes</option>
                        </select>
                    </div>
                </div>

                {/* Animations Panel (Premium) */}
                {['image', 'video', 'icon', 'container', 'button'].includes(selectedNode.type) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">⚡ Animaciones</span>
                            <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Nuevo</span>
                        </div>

                        {/* Hover Effects */}
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block uppercase font-bold tracking-wider">Efecto Hover (Al pasar mouse)</span>
                            <select
                                value={
                                    (selectedNode.className || '').includes('hover:scale-105') ? 'zoom' :
                                        (selectedNode.className || '').includes('hover:-translate-y-1') ? 'elevation' :
                                            (selectedNode.className || '').includes('hover:brightness-110') ? 'brightness' :
                                                (selectedNode.className || '').includes('grayscale') ? 'grayscale' : 'none'
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    let currentClass = selectedNode.className || '';

                                    // Remove existing specific hover classes to avoid conflicts
                                    currentClass = currentClass
                                        .replace(/hover:scale-105|transition-transform|duration-300|ease-out/g, '')
                                        .replace(/hover:-translate-y-1|hover:shadow-xl|transition-all/g, '')
                                        .replace(/hover:brightness-110/g, '')
                                        .replace(/grayscale|hover:grayscale-0|duration-500/g, '')
                                        .trim();

                                    let newClass = currentClass;

                                    // Always add base transition for smoothness if any effect is selected
                                    const baseTransition = ' transition-all duration-300';

                                    switch (val) {
                                        case 'zoom':
                                            newClass += `${baseTransition} hover:scale-105 ease-out`;
                                            break;
                                        case 'elevation':
                                            newClass += `${baseTransition} hover:-translate-y-1 hover:shadow-xl`;
                                            break;
                                        case 'brightness':
                                            newClass += `${baseTransition} hover:brightness-110`;
                                            break;
                                        case 'grayscale':
                                            newClass += `${baseTransition} duration-500 grayscale hover:grayscale-0`;
                                            break;
                                        default:
                                            // 'none' - clean state (already cleaned above)
                                            break;
                                    }

                                    updateProperty(selectedId, 'className', newClass.trim());
                                }}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="none">Ninguno</option>
                                <option value="zoom">Zoom Suave</option>
                                <option value="elevation">Elevación (Sombra)</option>
                                <option value="brightness">Brillo</option>
                                <option value="grayscale">Blanco y Negro a Color</option>
                            </select>
                        </div>

                        {/* Click Effects */}
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block uppercase font-bold tracking-wider">Efecto Click (Al presionar)</span>
                            <select
                                value={
                                    (selectedNode.className || '').includes('active:scale-95') ? 'clicky' :
                                        (selectedNode.className || '').includes('active:animate-bounce') ? 'bounce' : 'none'
                                }
                                onChange={(e) => {
                                    const val = e.target.value;
                                    let currentClass = selectedNode.className || '';

                                    // Remove existing click classes
                                    currentClass = currentClass
                                        .replace(/active:scale-95|transition-transform|duration-100/g, '')
                                        .replace(/active:animate-bounce/g, '')
                                        .trim();

                                    let newClass = currentClass;

                                    switch (val) {
                                        case 'clicky':
                                            // Ensure transition exists if not already (though usually handled by hover)
                                            if (!newClass.includes('transition')) newClass += ' transition-transform duration-100';
                                            newClass += ' active:scale-95';
                                            break;
                                        case 'bounce':
                                            newClass += ' active:animate-bounce';
                                            break;
                                        default:
                                            break;
                                    }

                                    updateProperty(selectedId, 'className', newClass.trim());
                                }}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="none">Ninguno</option>
                                <option value="clicky">Hundir (Clicky)</option>
                                <option value="bounce">Rebote</option>
                            </select>
                        </div>

                        {/* Scroll Reveal */}
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-700">Animar al aparecer</span>
                                <span className="text-[10px] text-slate-400">Efecto de entrada al hacer scroll</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={(selectedNode.className || '').includes('animate-in')}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    let currentClass = selectedNode.className || '';

                                    // Using Tailwind Animate presets
                                    const revealClasses = 'animate-in fade-in slide-in-from-bottom-4 duration-700';

                                    if (isChecked) {
                                        updateProperty(selectedId, 'className', `${currentClass} ${revealClasses}`.trim());
                                    } else {
                                        // Remove all parts of the animation string
                                        const cleanClass = currentClass.replace(/animate-in|fade-in|slide-in-from-bottom-4|duration-700/g, '').trim();
                                        updateProperty(selectedId, 'className', cleanClass);
                                    }
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                )}

            </div >
        </div >
    );
};
