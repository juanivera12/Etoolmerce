import React, { useState } from 'react';
import { useEditorStore, selectActivePageContent } from '../../store/useEditorStore';
import { Trash2, Type, Image, Layout, AlignLeft, AlignCenter, AlignRight, PlayCircle, HelpCircle, Info, Link, Palette, Sparkles, Monitor } from 'lucide-react';
import clsx from 'clsx';
import { BackgroundPanel } from './BackgroundPanel';
import { TypographyPanel } from './TypographyPanel';
import { EffectsPanel } from './EffectsPanel';
import { InfoLabel } from '../ui/InfoLabel';
import { MercadoPagoSettings } from './MercadoPagoSettings';
import { SchemaForm } from './SchemaRenderer';
import { CarouselSchema } from '../../data/carouselSchema';
import { ThreeDGallerySchema } from '../../data/threeDGallerySchema';
import { TypewriterSchema } from '../../data/typewriterSchema';

const SliderControl = ({ label, value, onChange, min = 0, max = 100, step = 1, helpTitle, helpDesc, unit = 'px' }) => {
    // Extract numeric value safely
    const numericValue = parseInt(value, 10) || 0;

    const handleChange = (e) => {
        onChange(`${e.target.value}${unit}`);
    };

    return (
        <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
                <div className="flex-1">
                    <InfoLabel label={label} tooltip={helpDesc} />
                </div>
                <span className="text-[9px] font-mono text-text-muted bg-surface-highlight px-1.5 py-0.5 rounded border border-border">
                    {numericValue}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={numericValue}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover transition-all"
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
    const [activeTab, setActiveTab] = useState('styles'); // styles, effects, interactions

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

    const selectedNodeRaw = selectedId ? findNode(pageData, selectedId) : null;
    // Safeguard to prevent crashes if styles is undefined
    const selectedNode = selectedNodeRaw ? { ...selectedNodeRaw, styles: selectedNodeRaw.styles || {} } : null;

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
        <div className="flex flex-col h-full bg-surface">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface sticky top-0 z-10">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        {selectedNode.type === 'text' && <Type size={14} />}
                        {selectedNode.type === 'image' && <Image size={14} />}
                        {selectedNode.type === 'video' && <PlayCircle size={14} />}
                        {selectedNode.type === 'section' && <Layout size={14} />}
                        {selectedNode.type.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-text-muted font-mono mt-0.5">
                        {isReact ? `<${selectedNode.type === 'section' ? 'Section' : selectedNode.type} />` : `<${selectedNode.type}>`}
                    </span>
                </div>

                {selectedNode.id !== 'root' && (
                    <button
                        onClick={() => removeElement(selectedId)}
                        className="text-red-400 hover:bg-red-900/20 p-1.5 rounded-md transition-colors border border-red-900/30 bg-red-900/10"
                        title="Eliminar elemento"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Tabs for Organization */}
            <div className="flex border-b border-border bg-surface-highlight/20">
                <button
                    onClick={() => setActiveTab('styles')}
                    className={clsx("flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 border-b-2 transition-colors", activeTab === 'styles' ? "border-primary text-primary bg-primary/5" : "border-transparent text-text-muted hover:text-text")}
                >
                    <Palette size={14} /> Estilos
                </button>
                <button
                    onClick={() => setActiveTab('effects')}
                    className={clsx("flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 border-b-2 transition-colors", activeTab === 'effects' ? "border-primary text-primary bg-primary/5" : "border-transparent text-text-muted hover:text-text")}
                >
                    <Sparkles size={14} /> Efectos
                </button>
                <button
                    onClick={() => setActiveTab('interactions')}
                    className={clsx("flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 border-b-2 transition-colors", activeTab === 'interactions' ? "border-primary text-primary bg-primary/5" : "border-transparent text-text-muted hover:text-text")}
                >
                    <Link size={14} /> Props
                </button>
                <button
                    onClick={() => setActiveTab('animations')}
                    className={clsx("flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 border-b-2 transition-colors", activeTab === 'animations' ? "border-primary text-primary bg-primary/5" : "border-transparent text-text-muted hover:text-text")}
                >
                    <PlayCircle size={14} /> Anim
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* --- TAB: ANIMATIONS --- */}
                {activeTab === 'animations' && (
                    <div className="space-y-6">
                        <div className="border-b border-border pb-4">
                            <label className="text-xs font-semibold text-text flex items-center gap-2 mb-3">
                                <PlayCircle size={14} className="text-secondary" /> Configuración de Entrada
                            </label>

                            {/* Animation Type */}
                            <div className="mb-4">
                                <InfoLabel label="Tipo de Animación" tooltip="El efecto visual con el que aparecerá el elemento al hacer scroll." />
                                <select
                                    value={selectedNode.animation?.type || ''}
                                    onChange={(e) => updateProperty(selectedId, 'animation', { ...selectedNode.animation, type: e.target.value })}
                                    className="w-full text-xs p-2 border border-border rounded bg-surface-highlight text-text"
                                >
                                    <option value="">Ninguna</option>
                                    <optgroup label="Fade">
                                        <option value="fade-up">Fade Up</option>
                                        <option value="fade-down">Fade Down</option>
                                        <option value="fade-left">Fade Left</option>
                                        <option value="fade-right">Fade Right</option>
                                    </optgroup>
                                    <optgroup label="Efectos Especiales">
                                        <option value="pulse">Latir (Pulse)</option>
                                        <option value="bounce">Rebotar (Bounce)</option>
                                        <option value="shake">Sacudir (Shake)</option>
                                        <option value="heartBeat">Latido Fuerte</option>
                                    </optgroup>
                                    <optgroup label="Zoom">
                                        <option value="zoom-in">Zoom In</option>
                                        <option value="zoom-out">Zoom Out</option>
                                        <option value="zoom-in-up">Zoom In Up</option>
                                    </optgroup>
                                    <optgroup label="Flip">
                                        <option value="flip-left">Flip Left</option>
                                        <option value="flip-right">Flip Right</option>
                                        <option value="flip-up">Flip Up</option>
                                    </optgroup>
                                    <optgroup label="Slide">
                                        <option value="slide-up">Slide Up</option>
                                        <option value="slide-down">Slide Down</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* Duration Slider (0 - 3000ms) */}
                            <SliderControl
                                label="Duración (ms)"
                                value={selectedNode.animation?.duration || 1000}
                                onChange={(val) => updateProperty(selectedId, 'animation', { ...selectedNode.animation, duration: parseInt(val) })}
                                min={0}
                                max={3000}
                                step={100}
                                unit="ms"
                            />

                            {/* Delay Slider (0 - 3000ms) */}
                            <SliderControl
                                label="Delay (ms)"
                                helpDesc="Tiempo de espera antes de iniciar la animación (útil para efectos en cascada)."
                                value={selectedNode.animation?.delay || 0}
                                onChange={(val) => updateProperty(selectedId, 'animation', { ...selectedNode.animation, delay: parseInt(val) })}
                                min={0}
                                max={3000}
                                step={50}
                                unit="ms"
                            />
                        </div>

                        {/* Test Button & Validation */}
                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    // Hack to re-trigger animation in editor: 
                                    const currentAnim = selectedNode.animation;
                                    updateProperty(selectedId, 'animation', { ...currentAnim, _replay: Date.now() });
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors text-xs font-bold shadow-sm"
                            >
                                <PlayCircle size={14} /> PROBAR ANIMACIÓN
                            </button>
                            <p className="text-[10px] text-text-muted mt-2 text-center">
                                Se requiere modo "Vista Previa" o reinicio para ver efecto completo.
                            </p>
                        </div>
                    </div>
                )}

                {/* --- TAB: STYLES --- */}
                {activeTab === 'styles' && (
                    <>
                        {/* Typography Panel Integration */}
                        {(selectedNode.type === 'text' || selectedNode.type === 'button' || selectedNode.type === 'link' || selectedNode.type === 'label' || selectedNode.type === 'header' || selectedNode.type === 'footer') && (
                            <TypographyPanel
                                selectedId={selectedId}
                                styles={selectedNode.styles}
                                updateStyles={updateStyles}
                            />
                        )}

                        {/* Mercado Pago Checkout Settings */}
                        {selectedNode.type === 'checkout' && (
                            <div className="pb-4 border-b border-border">
                                <MercadoPagoSettings
                                    selectedNode={selectedNode}
                                    updateProperty={updateProperty}
                                    selectedId={selectedId}
                                />
                            </div>
                        )}

                        {/* Layout Mode (Stack vs Free) */}
                        {(selectedNode.type === 'section' || selectedNode.type === 'container' || selectedNode.type === 'header' || selectedNode.type === 'footer' || selectedNode.type === 'hero' || selectedNode.type === 'page') && (
                            <div className="space-y-3 pb-4 border-b border-border">
                                <label className="text-xs font-semibold text-text flex items-center gap-2">
                                    <Layout size={14} /> Sistema de Diseño
                                </label>
                                <div className="flex gap-2 bg-surface-highlight p-1 rounded-lg border border-border">
                                    <button
                                        onClick={() => updateProperty(selectedId, 'layoutMode', 'stack')}
                                        className={clsx(
                                            "flex-1 py-1.5 text-[10px] font-medium rounded transition-all flex items-center justify-center gap-1",
                                            (!selectedNode.layoutMode || selectedNode.layoutMode === 'stack') ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text"
                                        )}
                                    >
                                        <AlignLeft size={12} /> Bloques (Stack)
                                    </button>
                                    <button
                                        onClick={() => updateProperty(selectedId, 'layoutMode', 'free')}
                                        className={clsx(
                                            "flex-1 py-1.5 text-[10px] font-medium rounded transition-all flex items-center justify-center gap-1",
                                            selectedNode.layoutMode === 'free' ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text"
                                        )}
                                    >
                                        <Layout size={12} /> Libre (Canvas)
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted leading-tight">
                                    <strong>Bloques:</strong> Orden automático (columnas/filas). <br />
                                    <strong>Libre:</strong> Arrastra y suelta en cualquier coordenada (X, Y). ideal para diseños superpuestos.
                                </p>
                            </div>
                        )}

                        {/* Dimensions & Layout */}
                        <div className="space-y-3 pb-4 border-b border-border">
                            <label className="text-xs font-semibold text-text flex items-center gap-2">
                                <Layout size={14} /> Dimensiones
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-[10px] text-text-muted font-bold mb-1 block">Ancho</span>
                                    <input
                                        type="text"
                                        value={selectedNode.styles.width || 'auto'}
                                        onChange={(e) => updateStyles(selectedId, { width: e.target.value })}
                                        className="w-full text-xs p-1.5 border border-border rounded bg-surface-highlight text-text"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] text-text-muted font-bold mb-1 block">Alto</span>
                                    <input
                                        type="text"
                                        value={selectedNode.styles.height || 'auto'}
                                        onChange={(e) => updateStyles(selectedId, { height: e.target.value })}
                                        className="w-full text-xs p-1.5 border border-border rounded bg-surface-highlight text-text"
                                    />
                                </div>
                            </div>

                            {/* Padding & Margin */}
                            <div className="pt-2">
                                <SliderControl
                                    label="Padding"
                                    helpDesc="Espacio interno entre el borde y el contenido."
                                    value={parseInt(selectedNode.styles.padding) || 0}
                                    onChange={(v) => updateStyles(selectedId, { padding: v })}
                                    max={100}
                                />
                                <SliderControl
                                    label="Margin"
                                    helpDesc="Espacio externo que separa este elemento de los demás."
                                    value={parseInt(selectedNode.styles.margin) || 0}
                                    onChange={(v) => updateStyles(selectedId, { margin: v })}
                                    max={100}
                                />
                            </div>
                        </div>

                        {/* Transform (Rotation & Layout) */}
                        <div className="space-y-3 pb-4 border-b border-border pt-4">
                            <label className="text-xs font-semibold text-text flex items-center gap-2">
                                <Monitor size={14} /> Transformación
                            </label>

                            {/* Rotation */}
                            <SliderControl
                                label="Rotación (°)"
                                value={parseInt(selectedNode.styles.transform?.replace('rotate(', '').replace('deg)', '') || 0)}
                                onChange={(v) => updateStyles(selectedId, { transform: `rotate(${v}deg)` })}
                                min={0}
                                max={360}
                                unit="°"
                                helpDesc="Gira el elemento. Útil para textos diagonales o estilos creativos."
                            />

                            {/* Text Orientation (Only for text-like elements) */}
                            {(selectedNode.type === 'text' || selectedNode.type === 'header' || selectedNode.type === 'label' || selectedNode.type === 'typewriter') && (
                                <div className="flex items-center justify-between mt-2">
                                    <InfoLabel label="Texto Vertical" tooltip="Cambia el flujo del texto a vertical (estilo japonés/editorial)." />
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={selectedNode.styles.writingMode === 'vertical-rl'}
                                            onChange={(e) => updateStyles(selectedId, {
                                                writingMode: e.target.checked ? 'vertical-rl' : 'horizontal-tb',
                                                textOrientation: e.target.checked ? 'mixed' : undefined
                                            })}
                                        />
                                        <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Universal Background Panel (Gradients & Solid) */}
                        {(selectedNode.type === 'section' || selectedNode.type === 'container' || selectedNode.type === 'background' || selectedNode.type === 'header' || selectedNode.type === 'footer' || selectedNode.type === 'hero' || selectedNode.type === 'card' || selectedNode.type === 'button' || selectedNode.type === 'product' || selectedNode.type === 'productGrid' || selectedNode.type === 'newsletter' || selectedNode.type === 'accordion' || selectedNode.type === 'tabs' || selectedNode.type === 'page') && (
                            <div className="pt-4 border-t border-border">
                                <BackgroundPanel
                                    selectedNode={selectedNode}
                                    updateStyles={updateStyles}
                                    updateProperty={updateProperty}
                                    selectedId={selectedId}
                                />
                            </div>
                        )}

                    </>
                )}


                {/* --- TAB: EFFECTS --- */}
                {/* --- TAB: EFFECTS --- */}
                {activeTab === 'effects' && (
                    <div className="space-y-6">
                        <EffectsPanel
                            selectedId={selectedId}
                            styles={selectedNode.styles}
                            updateStyles={updateStyles}
                        />

                        {/* Visual Effects (Glassmorphism & Hover) */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={14} className="text-secondary" />
                                <span className="text-xs font-semibold text-text">Efectos Especiales</span>
                            </div>

                            {/* Glassmorphism Control */}
                            <SliderControl
                                label="Backdrop Blur (Glass)"
                                value={parseInt(selectedNode.styles.backdropFilter?.replace('blur(', '').replace('px)', '') || 0)}
                                onChange={(val) => updateStyles(selectedId, { backdropFilter: val > 0 ? `blur(${val}px)` : 'none' })}
                                max={40}
                                unit="px"
                                helpTitle="" // Not needed if helpDesc is enough with new InfoLabel logic? 
                                // Actually SliderControl implementation above uses `label` for InfoLabel label, and `helpDesc` (passed as tooltip)
                                helpDesc="Aplica desenfoque al fondo detrás del elemento. Ideal para Headers flotantes. Requiere fondo semitransparente."
                            />

                            {/* Hover Effects */}
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <Monitor size={14} className="text-secondary" />
                                    <span className="text-xs font-semibold text-text">Interacciones (Hover)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InfoLabel label="Escala al Pasar" />
                                        <select
                                            className="w-full text-xs bg-surface-highlight border border-border rounded p-1.5"
                                            value={selectedNode.styles.hoverScale || '1'}
                                            onChange={(e) => updateStyles(selectedId, { hoverScale: e.target.value })}
                                        >
                                            <option value="1">Ninguno</option>
                                            <option value="1.05">Sutil (1.05)</option>
                                            <option value="1.1">Notorio (1.1)</option>
                                            <option value="0.95">Reducir (0.95)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <InfoLabel label="Brillo al Pasar" />
                                        <select
                                            className="w-full text-xs bg-surface-highlight border border-border rounded p-1.5"
                                            value={selectedNode.styles.hoverBrightness || '1'}
                                            onChange={(e) => updateStyles(selectedId, { hoverBrightness: e.target.value })}
                                        >
                                            <option value="1">Ninguno</option>
                                            <option value="1.2">Brillar (1.2)</option>
                                            <option value="1.5">Destello (1.5)</option>
                                            <option value="0.8">Oscurecer (0.8)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- TAB: INTERACTIONS / PROPS --- */}
                {activeTab === 'interactions' && (
                    <div className="space-y-6">
                        {/* Media Handling (Image/Video) */}
                        {(selectedNode.type === 'image' || selectedNode.type === 'video') && (
                            <div className="space-y-4 border-b border-border pb-4">
                                <label className="text-xs font-semibold text-text flex items-center gap-2">
                                    <Monitor size={14} /> Ajustes de Media (Object Fit)
                                </label>

                                <div className="grid grid-cols-3 gap-2">
                                    {['cover', 'contain', 'fill'].map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => updateStyles(selectedId, { objectFit: mode })}
                                            className={clsx(
                                                "p-2 text-[10px] capitalize rounded border text-center transition-all",
                                                selectedNode.styles.objectFit === mode
                                                    ? "bg-primary/20 border-primary text-primary font-bold"
                                                    : "bg-surface-highlight border-border text-text-muted hover:bg-surface-highlight/80"
                                            )}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-text-muted">
                                    <strong>Cover:</strong> Recorta para llenar. <strong>Contain:</strong> Muestra todo. <strong>Fill:</strong> Estira.
                                </p>

                                {/* Video Background Mode */}
                                {selectedNode.type === 'video' && (
                                    <div className="pt-2 border-t border-border mt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-text">Modo Fondo de Video</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={selectedNode.styles.pointerEvents === 'none'}
                                                    onChange={(e) => {
                                                        const isBg = e.target.checked;
                                                        if (isBg) {
                                                            updateStyles(selectedId, {
                                                                position: 'absolute',
                                                                top: '0', left: '0', width: '100%', height: '100%',
                                                                objectFit: 'cover',
                                                                zIndex: '-1',
                                                                pointerEvents: 'none',
                                                                controls: false,
                                                                autoPlay: true,
                                                                muted: true,
                                                                loop: true
                                                            });
                                                        } else {
                                                            updateStyles(selectedId, {
                                                                position: 'static',
                                                                zIndex: 'auto',
                                                                pointerEvents: 'auto',
                                                                controls: true,
                                                                width: '100%', height: 'auto'
                                                            });
                                                        }
                                                    }}
                                                />
                                                <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-text-muted mt-2 leading-relaxed">
                                            Activa esto para convertir el video en un fondo decorativo (Autoplay, Loop, Muted, Sin Controles).
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content Editing */}
                        {(selectedNode.type === 'text' || selectedNode.type === 'button' || selectedNode.type === 'link' || selectedNode.type === 'label' || selectedNode.type === 'input') && (
                            <div className="space-y-3 pb-4 border-b border-border">
                                <label className="text-xs font-semibold text-text">Contenido</label>
                                {selectedNode.type === 'input' ? (
                                    <input
                                        type="text"
                                        value={selectedNode.placeholder || ''}
                                        onChange={(e) => updateProperty(selectedId, 'placeholder', e.target.value)}
                                        className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text"
                                        placeholder="Placeholder text..."
                                    />
                                ) : (
                                    <textarea
                                        value={selectedNode.content}
                                        onChange={(e) => updateContent(selectedId, e.target.value)}
                                        className="w-full p-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none h-24 bg-surface-highlight text-text"
                                    />
                                )}
                            </div>
                        )}

                        {/* Image/Video Source */}
                        {(selectedNode.type === 'image' || selectedNode.type === 'video') && (
                            <div className="space-y-3 pb-4 border-b border-border">
                                <label className="text-xs font-semibold text-text">URL / Source</label>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        value={selectedNode.content}
                                        onChange={(e) => updateContent(selectedId, e.target.value)}
                                        className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text"
                                        placeholder="https://..."
                                    />
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept={selectedNode.type === 'image' ? "image/*" : "video/*"}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    updateContent(selectedId, url);
                                                }
                                            }}
                                        />
                                        <button className="w-full py-2 text-xs bg-surface-highlight border border-border border-dashed rounded text-text-muted hover:text-primary transition-colors">
                                            Subir archivo local
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Component Specific Schema Forms */}
                        {selectedNode.type === 'carousel' && (
                            <div className="pb-4 border-b border-border mb-4">
                                <SchemaForm
                                    schema={CarouselSchema}
                                    data={selectedNode.data || {}}
                                    onUpdate={(key, value) => {
                                        if (key.startsWith('data.')) {
                                            const propName = key.split('.')[1];
                                            updateProperty(selectedId, 'data', { ...(selectedNode.data || {}), [propName]: value });
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {selectedNode.type === 'threeDGallery' && (
                            <div className="pb-4 border-b border-border mb-4">
                                <SchemaForm
                                    schema={ThreeDGallerySchema}
                                    data={selectedNode.data || {}}
                                    onUpdate={(key, value) => {
                                        // Handle nested keys like data.rotate
                                        if (key.startsWith('data.')) {
                                            const propName = key.split('.')[1];
                                            updateProperty(selectedId, 'data', { ...(selectedNode.data || {}), [propName]: value });
                                        }
                                        // Handle top-level keys if any (unlikely for this schema)
                                        else {
                                            // default handling? SchemaForm might return full object or partial?
                                            // Based on Carousel impl:
                                            // Nothing else needed here as schema uses data.prefix
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {selectedNode.type === 'typewriter' && (
                            <div className="pb-4 border-b border-border mb-4">
                                <SchemaForm
                                    schema={TypewriterSchema}
                                    data={selectedNode.data || {}}
                                    onUpdate={(key, value) => {
                                        if (key.startsWith('data.')) {
                                            const propName = key.split('.')[1];
                                            updateProperty(selectedId, 'data', { ...(selectedNode.data || {}), [propName]: value });
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {/* Interaction Links */}
                        <div className="space-y-3 pb-4 border-b border-border">
                            <label className="text-xs font-semibold text-text flex items-center gap-2">
                                <Link size={14} /> Interacción (On Click)
                            </label>
                            <select
                                value={selectedNode.interaction?.type || 'none'}
                                onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, type: e.target.value })}
                                className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text mb-2"
                            >
                                <option value="none">Nada</option>
                                <option value="link">Ir a Página</option>
                                <option value="url">Abrir URL</option>
                                <option value="scroll">Scroll a Sección</option>
                            </select>

                            {/* Interaction: Scroll to ID */}
                            {selectedNode.interaction?.type === 'scroll' && (
                                <div className="space-y-2">
                                    <div className="flex flex-col gap-1">
                                        <InfoLabel label="ID del Objetivo" tooltip="El ID de la sección a la que quieres deslizar." />
                                        <input
                                            type="text"
                                            list="available-ids"
                                            placeholder="ej: sobre-mi"
                                            value={selectedNode.interaction?.targetId || ''}
                                            onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, targetId: e.target.value })}
                                            className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text"
                                        />
                                        <datalist id="available-ids">
                                            {/* Helper to extract all IDs from the page */}
                                            {(() => {
                                                const ids = [];
                                                const traverse = (node) => {
                                                    if (node.htmlId) ids.push(node.htmlId);
                                                    if (node.children) node.children.forEach(traverse);
                                                };
                                                traverse(pageData);
                                                return ids.map(id => <option key={id} value={id} />);
                                            })()}
                                        </datalist>
                                        <p className="text-[10px] text-text-muted">
                                            Escribe el ID o selecciona uno existente de la lista.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedNode.interaction?.type === 'link' && (
                                <select
                                    value={selectedNode.interaction?.targetPageId || ''}
                                    onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, targetPageId: e.target.value })}
                                    className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text"
                                >
                                    <option value="">-- Seleccionar Página --</option>
                                    {pages.map(page => (
                                        <option key={page.id} value={page.id}>{page.name}</option>
                                    ))}
                                </select>
                            )}

                            {selectedNode.interaction?.type === 'url' && (
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={selectedNode.interaction?.url || ''}
                                    onChange={(e) => updateProperty(selectedId, 'interaction', { ...selectedNode.interaction, url: e.target.value })}
                                    className="w-full p-2 text-sm border border-border rounded-lg bg-surface-highlight text-text"
                                />
                            )}
                        </div>

                        {/* Metadata (ID & Class) */}
                        <div className="space-y-3 pb-4">
                            <label className="text-xs font-semibold text-text">Atributos (Developers)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <InfoLabel label="ID de Bloque (Anclaje)" tooltip="Usa este nombre para enlazar botones hacia esta sección. Se convertirá automáticamente a formato válido (ej: sobre-mi)." />
                                    <input
                                        type="text"
                                        value={selectedNode.htmlId || ''}
                                        placeholder="ej: sobre-mi"
                                        onChange={(e) => {
                                            // Sanitize to kebab-case: lowercase, replace spaces with dashes, remove special chars
                                            const sanitized = e.target.value
                                                .toLowerCase()
                                                .replace(/\s+/g, '-')
                                                .replace(/[^a-z0-9-]/g, '');
                                            updateProperty(selectedId, 'htmlId', sanitized);
                                        }}
                                        className="w-full p-1.5 text-xs border border-border rounded bg-surface-highlight text-text font-mono"
                                    />
                                </div>
                                <div>
                                    <InfoLabel label="Class" tooltip="Nombres de clase para aplicar estilos personalizados desde tu hoja de estilos." />
                                    <input
                                        type="text"
                                        value={selectedNode.className || ''}
                                        onChange={(e) => updateProperty(selectedId, 'className', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-border rounded bg-surface-highlight text-text font-mono"
                                    />
                                </div>
                            </div>
                        </div>



                        {
                            selectedNode.type === 'productGrid' && (
                                <div className="space-y-3 pb-4 border-b border-border">
                                    <label className="text-xs font-semibold text-text">Columnas</label>
                                    <div className="flex gap-2">
                                        {[2, 3, 4].map(cols => (
                                            <button
                                                key={cols}
                                                onClick={() => handleChangeStyle('gridTemplateColumns', `repeat(${cols}, 1fr)`)}
                                                className={clsx(
                                                    "px-3 py-1.5 text-xs rounded border transition-colors flex-1",
                                                    selectedNode.styles.gridTemplateColumns?.includes(cols)
                                                        ? "bg-primary/20 border-primary text-primary font-bold"
                                                        : "bg-surface-highlight border-border text-text-muted hover:text-text hover:bg-surface-highlight/80"
                                                )}
                                            >
                                                {cols} Cols
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {/* Additional Component Specific Controls omitted for brevity but should be included as needed */}

                    </div>
                )}

            </div>
        </div>
    );
};
