import React, { useState } from 'react';
import { X, Globe, Search, ArrowRight, DownloadCloud, Image as ImageIcon } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

export const LogoAssistantModal = ({ onClose }) => {
    const { addElement } = useEditorStore();
    const [activeTab, setActiveTab] = useState('import'); // 'import' | 'search'
    const [domainUrl, setDomainUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleImport = () => {
        if (!domainUrl) return;
        const domain = domainUrl.replace(/^https?:\/\//, '').split('/')[0];
        const logoUrl = `https://logo.clearbit.com/${domain}`;

        addElement(null, 'image', {
            content: logoUrl,
            styles: { width: '150px', height: 'auto' }
        });
        onClose();
    };

    const handleSearchMock = () => {
        // Mock search results
        // In real app, this would call an icon/logo API
        alert("Funcionalidad de búsqueda simulada. Intenta 'Importar' con una URL real.");
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
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
                <div className="p-6 min-h-[250px] bg-white">
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

                            {/* Mock Results */}
                            <div className="grid grid-cols-4 gap-3">
                                {['Apple', 'Nike', 'Google', 'Meta'].map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => {
                                            const domain = `${brand.toLowerCase()}.com`;
                                            const logoUrl = `https://logo.clearbit.com/${domain}`;
                                            addElement(null, 'image', { content: logoUrl, styles: { width: '100px', height: 'auto' } });
                                            onClose();
                                        }}
                                        className="p-3 border border-slate-100 rounded-lg hover:border-purple-200 hover:bg-purple-50 flex flex-col items-center gap-2 transition-all group"
                                    >
                                        <img
                                            src={`https://logo.clearbit.com/${brand.toLowerCase()}.com`}
                                            alt={brand}
                                            className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all"
                                        />
                                        <span className="text-[10px] items-center font-medium text-slate-500 group-hover:text-purple-700">{brand}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
