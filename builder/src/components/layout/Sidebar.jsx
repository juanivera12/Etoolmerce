import React, { useState } from 'react';
import {
    Layout, Type, Image, Square, ShoppingCart, PlayCircle, Plus, File, Trash2, Edit2, Check, X, Settings, Link,
    ChevronDown, ChevronRight, Grid, Maximize, List, Columns, Search, Filter, Clock, Star, Megaphone, Menu, Divide, ToggleLeft, CreditCard,
    Wand2, Loader2, ArrowRight, Zap, Images, Palette, Heading1, RectangleHorizontal, Minus, LayoutGrid, Tag, SlidersHorizontal, DollarSign,
    MessageSquareQuote, Mail, Timer, ThumbsUp, Video
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DraggableItem } from '../ui/DraggableItem';
import { useEditorStore } from '../../store/useEditorStore';
import { ProjectSettingsModal } from './ProjectSettingsModal';
import { LogoAssistantModal } from './LogoAssistantModal';
import clsx from 'clsx';

const SidebarCategory = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-border/50 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-3 text-xs font-bold text-text-muted uppercase tracking-wider hover:bg-surface/50 transition-colors"
            >
                {title}
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {isOpen && (
                <div className="p-3 pt-0 grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

export const Sidebar = () => {
    // Standard State
    const { toggleTutorial, pages, activePageId, setActivePage, addPage, deletePage, renamePage, addElement } = useEditorStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showLogoModal, setShowLogoModal] = useState(false);

    // AI Gen State
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateAsset = () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);

        // Mock API Call
        setTimeout(() => {
            const isVideo = aiPrompt.toLowerCase().includes('video');
            const type = isVideo ? 'video' : 'image';
            const content = isVideo
                ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000'; // AI-like abstract image

            useEditorStore.getState().addElement(activePageId, type, {
                content,
                styles: { width: '100%', height: 'auto', borderRadius: '8px' }
            });

            setIsGenerating(false);
            setShowAiModal(false);
            setAiPrompt('');
        }, 2000);
    };

    return (
        <>
            <div className="flex flex-col h-full bg-surface" id="sidebar-panel">
                <div className="p-5 border-b border-border flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                        E-ToolMerce
                    </h1>
                    <button
                        onClick={() => setShowAiModal(true)}
                        className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition-all shadow-sm group"
                        title="Generar Asset AI"
                    >
                        <LucideIcons.Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>

                {/* AI Modal */}
                {showAiModal && (
                    <div className="absolute top-0 left-0 w-full h-full bg-surface/95 backdrop-blur-sm z-50 p-6 flex flex-col animate-in fade-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center gap-2">
                                <LucideIcons.Wand2 size={20} />
                                Generador AI
                            </h3>
                            <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prompt Mágico</label>
                                <textarea
                                    autoFocus
                                    disabled={isGenerating}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Describe lo que quieres... (ej. 'Un banner de zapatos deportivos' o 'video de paisaje')"
                                    className="w-full h-32 p-4 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all bg-white text-sm"
                                />
                            </div>

                            <button
                                onClick={handleGenerateAsset}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <LucideIcons.Loader2 size={20} className="animate-spin" />
                                        Generando Magia...
                                    </>
                                ) : (
                                    <>
                                        Generar Asset
                                        <LucideIcons.ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            {!isGenerating && (
                                <p className="text-center text-xs text-slate-400">
                                    Simulación: Escribe "video" para generar un elemento de video.
                                </p>
                            )}
                        </div>
                    </div>
                )}


                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Pages Section */}
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Páginas</h3>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                                title="Agregar Página"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {pages.map(page => (
                                <div
                                    key={page.id}
                                    className={clsx(
                                        "group flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-all text-sm",
                                        activePageId === page.id
                                            ? "bg-primary/10 border-primary text-primary font-medium"
                                            : "bg-surface hover:bg-surface-highlight border-border text-text-muted hover:text-text"
                                    )}
                                    onClick={() => setActivePage(page.id)}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <File size={14} />
                                        {editingId === page.id ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-background border border-primary rounded px-1 w-full text-xs"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRename(page.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                onBlur={() => handleRename(page.id)}
                                            />
                                        ) : (
                                            <span className="truncate">{page.name}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingId !== page.id && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(page.id);
                                                    setEditName(page.name);
                                                }}
                                                className="p-1 hover:text-indigo-500"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                        )}
                                        {pages.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`¿Eliminar página "${page.name}"?`)) deletePage(page.id);
                                                }}
                                                className="p-1 hover:text-red-500"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isAdding && (
                                <div className="flex items-center gap-2 p-2 bg-surface border border-primary rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Nombre página"
                                        className="bg-transparent text-sm outline-none w-full text-text"
                                        value={newPageName}
                                        onChange={(e) => setNewPageName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddPage();
                                            if (e.key === 'Escape') setIsAdding(false);
                                        }}
                                    />
                                    <button onClick={handleAddPage} className="text-green-500"><Check size={14} /></button>
                                    <button onClick={() => setIsAdding(false)} className="text-red-500"><X size={14} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Component Categories */}
                    <div className="pb-4">
                        <SidebarCategory title="Navegación" defaultOpen={true}>
                            <DraggableItem type="header" icon={<LucideIcons.PanelTop />} label="Header" description="Barra superior con logo y links." variant="blue" />
                            <DraggableItem type="footer" icon={<LucideIcons.PanelBottom />} label="Footer" description="Pie de página oscuro." variant="blue" />
                        </SidebarCategory>

                        <SidebarCategory title="Básicos" defaultOpen={true}>
                            <DraggableItem type="text" icon={<Type />} label="Texto" variant="blue" />
                            <DraggableItem type="title" icon={<Heading1 />} label="Título" variant="blue" />
                            <DraggableItem type="image" icon={<Image />} label="Imagen" variant="blue" />
                            <DraggableItem type="video" icon={<Video />} label="Video" variant="blue" />
                            <DraggableItem type="button" icon={<RectangleHorizontal />} label="Botón" variant="blue" />
                            <DraggableItem type="divider" icon={<Minus />} label="Divisor" variant="blue" />
                        </SidebarCategory>

                        <SidebarCategory title="Tienda / E-commerce" defaultOpen={true}>
                            <DraggableItem type="productGrid" icon={<LayoutGrid />} label="Grid Productos" description="Muestra múltiples productos." variant="emerald" />
                            <DraggableItem type="product" icon={<Tag />} label="Producto Único" variant="emerald" />
                            <DraggableItem type="cartWidget" icon={<ShoppingCart />} label="Carrito" variant="emerald" />
                            <DraggableItem type="stickyCart" icon={<ArrowRight className="rotate-90" />} label="Barra Carrito" description="Barra inferior fija para finalizar compra." variant="emerald" />
                            <DraggableItem type="searchBar" icon={<Search />} label="Buscador" variant="emerald" />
                            <DraggableItem type="filters" icon={<SlidersHorizontal />} label="Filtros" variant="emerald" />
                            <DraggableItem type="pricingTable" icon={<List />} label="Tabla Precios" variant="emerald" />
                            <DraggableItem type="price" icon={<DollarSign />} label="Precio" variant="emerald" />
                        </SidebarCategory>

                        <SidebarCategory title="Marketing">
                            <DraggableItem type="hero" icon={<Star />} label="Hero Banner" description="Banner principal de impacto." variant="coral" />
                            <DraggableItem type="flashOffer" icon={<Zap />} label="Oferta Flash" description="Bloque de urgencia con cuenta regresiva." variant="coral" />
                            <DraggableItem
                                type="brandCarousel"
                                icon={<Images />}
                                label="Logos Marcas"
                                description="Arrastra para carrusel o Click para Importar Logo."
                                variant="coral"
                                onClick={() => setShowLogoModal(true)}
                            />
                            <DraggableItem type="testimonial" icon={<MessageSquareQuote />} label="Testimonios" variant="coral" />
                            <DraggableItem type="newsletter" icon={<Mail />} label="Newsletter" variant="coral" />
                            <DraggableItem type="countdown" icon={<Timer />} label="Countdown" variant="coral" />
                            <DraggableItem type="social" icon={<ThumbsUp />} label="Social Icons" variant="coral" />
                        </SidebarCategory>
                    </div>

                </div>

                <div className="p-4 border-t border-border space-y-2 bg-background z-10">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full py-2 px-4 bg-surface hover:bg-surface-highlight border border-border rounded-lg text-sm font-medium text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Settings size={16} />
                        Configuración
                    </button>
                    <button
                        onClick={toggleTutorial}
                        className="w-full py-2 px-4 bg-surface-highlight hover:bg-surface border border-border rounded-lg text-sm font-medium text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <PlayCircle size={16} />
                        Tutorial
                    </button>
                </div>
            </div >

            {showSettings && <ProjectSettingsModal onClose={() => setShowSettings(false)} />}
            {showLogoModal && <LogoAssistantModal onClose={() => setShowLogoModal(false)} />}
        </>
    );
};
