import React, { useState, useEffect } from 'react';
import { X, Globe, Search, ArrowRight, DownloadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

const POPULAR_BRANDS = [
    { name: 'Apple', domain: 'simple-icons:apple' },
    { name: 'Google', domain: 'simple-icons:google' },
    { name: 'Microsoft', domain: 'simple-icons:microsoft' },
    { name: 'Spotify', domain: 'simple-icons:spotify' },
    { name: 'Amazon', domain: 'simple-icons:amazon' },
    { name: 'Nike', domain: 'simple-icons:nike' },
    { name: 'Adidas', domain: 'simple-icons:adidas' },
    { name: 'Meta', domain: 'simple-icons:meta' },
    { name: 'Instagram', domain: 'simple-icons:instagram' },
    { name: 'TikTok', domain: 'simple-icons:tiktok' },
    { name: 'WhatsApp', domain: 'simple-icons:whatsapp' }
];

const BrandButton = ({ brandData, targetId, onClose, addElement, filterStyle }) => {
    if (!brandData) return null;
    const { name, domain } = brandData;

    // Safety check
    if (!name || !domain) return null;

    // Determine source type
    const isDirectUrl = typeof domain === 'string' && domain.includes('http');
    const isIconifyIcon = !isDirectUrl && typeof domain === 'string' && domain.includes(':'); // e.g. "lucide:home"

    const getInitialSrc = () => {
        if (!domain) return '';
        if (isDirectUrl) return domain;
        if (isIconifyIcon) return `https://api.iconify.design/${domain}.svg`;
        return `https://logo.clearbit.com/${domain}`;
    };

    const [src, setSrc] = useState(getInitialSrc());

    const handleError = () => {
        if (src.includes('logo.clearbit.com')) {
            setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        } else {
            // console.warn(`Failed to load logo for ${name}`);
        }
    };

    const handleClick = async () => {
        // If it's an Iconify icon (or we want to force SVG for brands), fetch the SVG code
        if (isIconifyIcon || (typeof domain === 'string' && (domain.includes('simple-icons:') || domain.includes('logos:')))) {
            try {
                const iconUrl = isIconifyIcon ? `https://api.iconify.design/${domain}.svg` : `https://api.iconify.design/${domain}.svg`;
                const response = await fetch(iconUrl);
                if (response.ok) {
                    const svgContent = await response.text();
                    // Clean SVG if needed or just pass it
                    addElement(targetId, 'icon', {
                        content: svgContent,
                        styles: {
                            width: '48px',
                            height: '48px',
                            fill: 'currentColor', // Allow coloring
                            color: '#000000'
                        }
                    });
                    onClose();
                    return;
                }
            } catch (err) {
                console.error("Failed to fetch SVG", err);
            }
        }

        // Fallback for images
        addElement(targetId, 'image', {
            content: src,
            styles: {
                width: '100px',
                height: 'auto',
                filter: filterStyle
            }
        });
        onClose();
    };

    return (
        <button
            onClick={handleClick}
            className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
        >
            <div className="w-12 h-12 flex items-center justify-center p-1 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                <img
                    src={src}
                    alt={name}
                    onError={handleError}
                    style={{
                        filter: filterStyle,
                        mixBlendMode: filterStyle !== 'none' ? 'multiply' : 'normal'
                    }}
                    className="w-full h-full object-contain transition-all group-hover:scale-110"
                />    </div>
            <span className="text-[10px] items-center font-medium text-slate-500 group-hover:text-purple-700">{name}</span>
        </button>
    );
};

export const LogoAssistantModal = ({ onClose }) => {
    const { addElement, pages, activePageId, selectedId } = useEditorStore();
    const [activeTab, setActiveTab] = useState('import'); // 'import' | 'search'
    const [domainUrl, setDomainUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('none'); // CSS filter value
    const [iconResults, setIconResults] = useState([]);
    const [isSearchingIcons, setIsSearchingIcons] = useState(false);

    // Determine target ID for adding elements
    const activePage = pages.find(p => p.id === activePageId);
    const targetId = selectedId || activePage?.content?.id || 'root';

    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setIconResults([]);
            return;
        }

        const fetchIcons = async () => {
            setIsSearchingIcons(true);
            try {
                // Translation map for better results (Iconify works best with English)
                const terms = {
                    'dinero': 'money',
                    'plata': 'money',
                    'ropa': 'clothes',
                    'remera': 'shirt',
                    'camisa': 'shirt',
                    'pantalon': 'pants',
                    'zapatillas': 'shoes',
                    'zapato': 'shoe',
                    'tienda': 'shop',
                    'carrito': 'cart',
                    'compras': 'shopping',
                    'usuario': 'user',
                    'perfil': 'profile',
                    'casa': 'home',
                    'inicio': 'home',
                    'buscar': 'search',
                    'lupa': 'search',
                    'menu': 'menu',
                    'hamburguesa': 'menu',
                    'flecha': 'arrow',
                    'estrella': 'star',
                    'corazon': 'heart',
                    'bolsa': 'bag',
                    'envio': 'shipping',
                    'camion': 'truck',
                    'rebajas': 'sale',
                    'oferta': 'offer',
                    'descuento': 'discount'
                };

                const translatedQuery = terms[searchQuery.toLowerCase()] || searchQuery;

                // Search for generic icons
                const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(translatedQuery)}&limit=64`);
                const data = await response.json();
                if (data.icons) {
                    setIconResults(data.icons);
                }
            } catch (error) {
                console.error("Failed to fetch icons:", error);
            } finally {
                setIsSearchingIcons(false);
            }
        };

        const timeoutId = setTimeout(fetchIcons, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleImport = () => {
        if (!domainUrl) return;
        const domain = domainUrl.replace(/^https?:\/\//, '').split('/')[0];
        const logoUrl = `https://logo.clearbit.com/${domain}`;

        addElement(targetId, 'image', {
            content: logoUrl,
            styles: { width: '150px', height: 'auto' }
        });
        onClose();
    };



    const filterOptions = [
        { name: 'Original', value: 'none', color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' },
        { name: 'Negro', value: 'brightness(0) contrast(100%)', color: 'bg-black' },
        { name: 'Grises', value: 'grayscale(100%)', color: 'bg-slate-500' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[700px] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <ImageIcon size={20} />
                        </div>
                        Asistente de Logos
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'import' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        Importar (URL)
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'search' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        Buscar Logo
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden bg-white">

                    {/* Sidebar Filters (Only for Search Tab) */}
                    {activeTab === 'search' && (
                        <div className="w-48 border-r border-slate-100 p-4 bg-slate-50/30 overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Colores</h4>
                                    <div className="space-y-2">
                                        {filterOptions.map(option => (
                                            <button
                                                key={option.name}
                                                onClick={() => setSelectedFilter(option.value)}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-all ${selectedFilter === option.value ? 'bg-white shadow-sm ring-1 ring-slate-200 text-slate-800 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full shadow-sm ${option.color} border border-white/20`} />
                                                {option.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Forma</h4>
                                    <div className="space-y-2 opacity-50 pointer-events-none">
                                        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-slate-600">
                                            <div className="w-4 h-4 rounded border border-slate-400" />
                                            Contorno
                                        </button>
                                        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-slate-600">
                                            <div className="w-4 h-4 rounded bg-slate-400" />
                                            Relleno
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'import' ? (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-500 mb-4">
                                        <Globe size={32} />
                                    </div>
                                    <h4 className="font-bold text-slate-800">Importar desde Web</h4>
                                    <p className="text-sm text-slate-500">Escribe el dominio de cualquier marca (ej. spotify.com) y obtendremos su logo oficial en alta calidad.</p>
                                </div>

                                <div className="relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={domainUrl}
                                        onChange={(e) => setDomainUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                                        placeholder="ej. google.com"
                                        className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={handleImport}
                                        disabled={!domainUrl}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-500 mb-4">
                                        <Search size={32} />
                                    </div>
                                    <h4 className="font-bold text-slate-800">Buscar en Librería</h4>
                                    <p className="text-sm text-slate-500">Busca entre miles de marcas populares.</p>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar marcas (ej. Nike, Apple)..."
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                                    />
                                </div>

                                {/* Results & Search Logic */}
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                    {/* Generic Icons Section */}
                                    {iconResults.length > 0 && (
                                        <div>
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 sticky top-0 bg-white py-1 z-10">Iconos</h5>
                                            <div className="grid grid-cols-4 gap-3">
                                                {iconResults.map((icon, index) => (
                                                    <BrandButton
                                                        key={`icon-${index}`}
                                                        brandData={{
                                                            name: icon.split(':')[1] || icon,
                                                            domain: icon // Pass raw icon name (e.g. "lucide:shirt")
                                                        }}
                                                        targetId={targetId}
                                                        onClose={onClose}
                                                        addElement={addElement}
                                                        filterStyle={selectedFilter}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Brands Section */}
                                    {POPULAR_BRANDS.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
                                        <div>
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 sticky top-0 bg-white py-1 z-10">Marcas</h5>
                                            <div className="grid grid-cols-4 gap-3">
                                                {POPULAR_BRANDS
                                                    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map(brandData => (
                                                        <BrandButton
                                                            key={brandData.name}
                                                            brandData={brandData}
                                                            targetId={targetId}
                                                            onClose={onClose}
                                                            addElement={addElement}
                                                            filterStyle={selectedFilter}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* Custom Brand Fallback */}
                                    {searchQuery && !iconResults.length && !POPULAR_BRANDS.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())) && !isSearchingIcons && (
                                        <div className="grid grid-cols-4 gap-3">
                                            <BrandButton
                                                key="custom-search"
                                                brandData={{ name: `Web: ${searchQuery}`, domain: `${searchQuery.replace(/\s+/g, '')}.com` }}
                                                targetId={targetId}
                                                onClose={onClose}
                                                addElement={addElement}
                                                filterStyle={selectedFilter}
                                            />
                                        </div>
                                    )}

                                    {isSearchingIcons && (
                                        <div className="flex justify-center transition-all opacity-50 py-4 text-slate-400 text-sm">
                                            Buscando...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
