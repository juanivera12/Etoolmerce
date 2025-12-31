import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Trash2, Type, Image, Layout, AlignLeft, AlignCenter, AlignRight, PlayCircle } from 'lucide-react';

export const PropertiesPanel = () => {
    const { selectedId, pageData, updateStyles, updateContent, removeElement } = useEditorStore();

    // Helper to find the selected node
    const findNode = (node, id) => {
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
            </div>
        );
    }

    const handleChangeStyle = (key, value) => {
        updateStyles(selectedId, { [key]: value });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    {selectedNode.type === 'text' && <Type size={14} />}
                    {selectedNode.type === 'image' && <Image size={14} />}
                    {selectedNode.type === 'video' && <PlayCircle size={14} />}
                    {selectedNode.type === 'section' && <Layout size={14} />}
                    {selectedNode.type.toUpperCase()}
                </span>
                {selectedNode.id !== 'root' && (
                    <button
                        onClick={() => removeElement(selectedId)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                        title="Eliminar elemento"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Content Editing (Text/Image/Video) */}
                {(selectedNode.type === 'text' || selectedNode.type === 'image' || selectedNode.type === 'video') && (
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-700">Contenido</label>
                        {selectedNode.type === 'text' ? (
                            <textarea
                                value={selectedNode.content}
                                onChange={(e) => updateContent(selectedId, e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                            />
                        ) : (
                            <input
                                type="text"
                                value={selectedNode.content}
                                onChange={(e) => updateContent(selectedId, e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder={selectedNode.type === 'image' ? "URL de la imagen" : "URL del video (mp4, webm)"}
                            />
                        )}

                        {selectedNode.type === 'video' && (
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
                        )}
                    </div>
                )}

                {/* Typography */}
                {(selectedNode.type === 'text' || selectedNode.id === 'root') && (
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-700">Tipografía</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Tamaño</span>
                                <input
                                    type="text"
                                    value={selectedNode.styles.fontSize || ''}
                                    onChange={(e) => handleChangeStyle('fontSize', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Color</span>
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
                )}

                {/* Layout & Spacing */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700">Diseño</label>

                    {/* Position (Free Layout) */}
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

                    {(selectedNode.styles.position === 'absolute' || selectedNode.styles.position === 'fixed' || selectedNode.styles.position === 'relative') && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Top</span>
                                <input
                                    type="text"
                                    value={selectedNode.styles.top || ''}
                                    onChange={(e) => handleChangeStyle('top', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Left</span>
                                <input
                                    type="text"
                                    value={selectedNode.styles.left || ''}
                                    onChange={(e) => handleChangeStyle('left', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Right</span>
                                <input
                                    type="text"
                                    value={selectedNode.styles.right || ''}
                                    onChange={(e) => handleChangeStyle('right', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Bottom</span>
                                <input
                                    type="text"
                                    value={selectedNode.styles.bottom || ''}
                                    onChange={(e) => handleChangeStyle('bottom', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Z-Index</span>
                                <input
                                    type="number"
                                    value={selectedNode.styles.zIndex || ''}
                                    onChange={(e) => handleChangeStyle('zIndex', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Background Color */}
                    <div>
                        <span className="text-[10px] text-slate-400 mb-1 block">Fondo</span>
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

                    {/* Padding & Margin */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Padding</span>
                            <input
                                type="text"
                                value={selectedNode.styles.padding || ''}
                                onChange={(e) => handleChangeStyle('padding', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Gap</span>
                            <input
                                type="text"
                                value={selectedNode.styles.gap || ''}
                                onChange={(e) => handleChangeStyle('gap', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Ancho</span>
                            <input
                                type="text"
                                value={selectedNode.styles.width || ''}
                                onChange={(e) => handleChangeStyle('width', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Alto</span>
                            <input
                                type="text"
                                value={selectedNode.styles.height || ''}
                                onChange={(e) => handleChangeStyle('height', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Flex Direction (for containers) */}
                    {(selectedNode.type === 'section' || selectedNode.type === 'container' || selectedNode.id === 'root') && (
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Dirección Flex</span>
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
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700">Bordes</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Radio (Radius)</span>
                            <input
                                type="text"
                                value={selectedNode.styles.borderRadius || ''}
                                onChange={(e) => handleChangeStyle('borderRadius', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 mb-1 block">Borde</span>
                            <input
                                type="text"
                                value={selectedNode.styles.border || ''}
                                onChange={(e) => handleChangeStyle('border', e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Animations */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700">Animaciones</label>
                    <div>
                        <span className="text-[10px] text-slate-400 mb-1 block">Efecto</span>
                        <select
                            value={selectedNode.styles.animation || 'none'}
                            onChange={(e) => handleChangeStyle('animation', e.target.value)}
                            className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="none">Ninguna</option>
                            <optgroup label="Atención">
                                <option value="bounce 1s infinite">Rebote (Bounce)</option>
                                <option value="pulse 2s infinite">Pulso (Pulse)</option>
                                <option value="shake 1s infinite">Sacudida (Shake)</option>
                                <option value="swing 1s infinite">Balanceo (Swing)</option>
                                <option value="wobble 1s infinite">Temblor (Wobble)</option>
                                <option value="heartBeat 1.3s infinite">Latido (HeartBeat)</option>
                                <option value="spin 1s linear infinite">Giro (Spin)</option>
                                <option value="ping 1s cubic-bezier(0, 0, 0.2, 1) infinite">Ping</option>
                            </optgroup>
                            <optgroup label="Entrada (Fade)">
                                <option value="fadeIn 1s ease-in">Aparecer (Fade In)</option>
                                <option value="fadeInDown 1s ease-in">Desde Arriba (Fade In Down)</option>
                                <option value="fadeInUp 1s ease-in">Desde Abajo (Fade In Up)</option>
                                <option value="fadeInLeft 1s ease-in">Desde Izquierda (Fade In Left)</option>
                                <option value="fadeInRight 1s ease-in">Desde Derecha (Fade In Right)</option>
                            </optgroup>
                            <optgroup label="Entrada (Slide)">
                                <option value="slideInDown 1s ease-out">Deslizar Arriba (Slide In Down)</option>
                                <option value="slideInUp 1s ease-out">Deslizar Abajo (Slide In Up)</option>
                                <option value="slideInLeft 1s ease-out">Deslizar Izquierda (Slide In Left)</option>
                                <option value="slideInRight 1s ease-out">Deslizar Derecha (Slide In Right)</option>
                            </optgroup>
                            <optgroup label="Entrada (Zoom)">
                                <option value="zoomIn 1s ease-in">Zoom In</option>
                                <option value="zoomOut 1s ease-in">Zoom Out</option>
                            </optgroup>
                            <optgroup label="Entrada (Flip)">
                                <option value="flipInX 1s ease-in">Voltear X (Flip In X)</option>
                                <option value="flipInY 1s ease-in">Voltear Y (Flip In Y)</option>
                            </optgroup>
                            <optgroup label="Entrada (Rotate)">
                                <option value="rotateIn 1s ease-in">Rotar (Rotate In)</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};
