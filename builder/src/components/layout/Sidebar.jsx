import React, { useState } from 'react';
import {
    Layout, LayoutTemplate, Type, Image, Square, ShoppingCart, PlayCircle, Plus, File, Trash2, Edit2, Check, X, Settings, Link,
    ChevronDown, ChevronRight, Grid, Maximize, List, Columns, Search, Filter, Clock, Star, Megaphone, Menu, Divide, ToggleLeft, CreditCard,
    ArrowRight, Zap, Images, Palette, Heading1, RectangleHorizontal, Minus, LayoutGrid, Tag, SlidersHorizontal, DollarSign,
    MessageSquareQuote, Mail, Timer, ThumbsUp, Video
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DraggableItem } from '../ui/DraggableItem';
import { useEditorStore } from '../../store/useEditorStore';
import { ProjectSettingsModal } from './ProjectSettingsModal';
import { CommunityTemplatesModal } from './CommunityTemplatesModal';
import clsx from 'clsx';
import { AdvancedIconPickerModal } from './AdvancedIconPickerModal';

// ... (existing code)

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
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    // AI Gen State removed

    const handleAddPage = () => {
        if (newPageName.trim()) {
            addPage(newPageName);
            setNewPageName('');
            setIsAdding(false);
        }
    };

    const handleRename = (id) => {
        if (editName.trim()) {
            renamePage(id, editName);
        }
        setEditingId(null);
    };

    return (
        <>
            <div className="flex flex-col h-full bg-surface" id="sidebar-panel">
                <div className="p-5 border-b border-border flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                        E-ToolMerce
                    </h1>
                </div>

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
                            <DraggableItem type="image" icon={<Image />} label="Imagen" variant="blue" />
                            <DraggableItem type="video" icon={<Video />} label="Video" variant="blue" />
                            <DraggableItem type="button" icon={<RectangleHorizontal />} label="Botón" variant="blue" />
                            <DraggableItem type="divider" icon={<Minus />} label="Divisor" variant="blue" />
                            <DraggableItem
                                type="icon"
                                icon={<Star />}
                                label="Icono"
                                description="Haz clic para elegir icono"
                                variant="blue"
                                onClick={() => setShowIconPicker(true)}
                            />
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
                            <DraggableItem type="checkout" icon={<CreditCard />} label="Checkout Final" description="Botón de pago MP con configuración." variant="emerald" />
                        </SidebarCategory>

                        <SidebarCategory title="Marketing">
                            <DraggableItem type="carousel" icon={<Images />} label="Carrusel Estándar" description="Slider básico con autoplay." variant="coral" />
                            <DraggableItem type="threeDGallery" icon={<Images />} label="Galería 3D Coverflow" description="Efecto 3D estilo Apple iTunes." variant="coral" />
                            <DraggableItem type="typewriter" icon={<Type />} label="Texto Typewriter" description="Efecto de escritura animada." variant="blue" />
                            <DraggableItem type="hero" icon={<Star />} label="Hero Banner" description="Banner principal de impacto." variant="coral" />
                            <DraggableItem type="flashOffer" icon={<Zap />} label="Oferta Flash" description="Bloque de urgencia con cuenta regresiva." variant="coral" />
                            <DraggableItem type="testimonial" icon={<MessageSquareQuote />} label="Testimonios" variant="coral" />
                            <DraggableItem type="newsletter" icon={<Mail />} label="Newsletter" variant="coral" />
                            <DraggableItem type="countdown" icon={<Timer />} label="Countdown" variant="coral" />
                            <DraggableItem type="social" icon={<ThumbsUp />} label="Social Icons" variant="coral" />
                        </SidebarCategory>
                    </div>

                </div>

                <div className="p-4 border-t border-border space-y-2 bg-background z-10">
                    <button
                        onClick={() => setShowTemplates(true)}
                        className="w-full py-2 px-4 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 hover:from-violet-500/20 hover:to-indigo-500/20 border border-violet-500/20 rounded-lg text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-all flex items-center justify-center gap-2 group"
                    >
                        <LayoutTemplate size={16} className="group-hover:scale-110 transition-transform" />
                        Plantillas Comunidad
                    </button>
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
            {showTemplates && <CommunityTemplatesModal onClose={() => setShowTemplates(false)} />}

            {/* Advanced Icon Picker */}
            {showIconPicker && (
                <AdvancedIconPickerModal
                    onClose={() => setShowIconPicker(false)}
                    onSelect={(iconData) => {
                        const state = useEditorStore.getState();
                        const targetId = state.selectedId || state.pages.find(p => p.id === state.activePageId)?.content?.id;

                        if (targetId) {
                            addElement(targetId, 'icon', {
                                content: iconData.content,
                                ...iconData.styles
                            });
                        }
                    }}
                />
            )}
        </>
    );
};
