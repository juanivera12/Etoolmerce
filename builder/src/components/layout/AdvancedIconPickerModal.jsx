import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Star, Heart, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';

// Pre-compute icon list from Lucide
const iconList = Object.keys(LucideIcons).map(key => ({
    name: key,
    Icon: LucideIcons[key]
}));

export const AdvancedIconPickerModal = ({ onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('all'); // all, outline, filled
    const [selectedColor, setSelectedColor] = useState('currentColor'); // currentColor, blue, red, green...

    const filteredIcons = useMemo(() => {
        return iconList.filter(item => {
            return item.name.toLowerCase().includes(search.toLowerCase());
        });
    }, [search]);

    const handleIconClick = (iconName) => {
        const isFilled = selectedStyle === 'filled';

        const iconData = {
            type: 'icon',
            content: iconName,
            styles: {
                color: selectedColor === 'currentColor' ? '#64748b' : selectedColor,
                fill: isFilled ? (selectedColor === 'currentColor' ? '#64748b' : selectedColor) : 'none',
                fontSize: '24px',
                width: '24px',
                height: '24px'
            }
        };

        onSelect(iconData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Sidebar Filters */}
                <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Filter size={16} /> Filtros
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-2 block">Estilo</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'all', label: 'Todos' },
                                        { id: 'outline', label: 'Delineado' },
                                        { id: 'filled', label: 'Relleno' }
                                    ].map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => setSelectedStyle(style.id)}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize",
                                                selectedStyle === style.id ? "bg-indigo-100 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-100"
                                            )}
                                        >
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-2 block">Color Predeterminado</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[
                                        { val: 'currentColor', class: 'bg-slate-800' },
                                        { val: '#ef4444', class: 'bg-red-500' },
                                        { val: '#3b82f6', class: 'bg-blue-500' },
                                        { val: '#10b981', class: 'bg-green-500' },
                                        { val: '#f59e0b', class: 'bg-orange-500' },
                                    ].map((c) => (
                                        <button
                                            key={c.val}
                                            onClick={() => setSelectedColor(c.val)}
                                            className={clsx(
                                                "w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all",
                                                selectedColor === c.val ? "ring-indigo-500 scale-110" : "ring-transparent hover:scale-110",
                                                c.class
                                            )}
                                            title={c.val}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-0 bg-white">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar iconos (ej. user, cart, star)..."
                                value={search}
                                autoFocus
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            {search ? `Resultados para "${search}"` : 'Explorar Iconos'}
                            <span className="text-sm font-normal text-slate-400 ml-2">({filteredIcons.length})</span>
                        </h2>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
                            {filteredIcons.slice(0, 100).map(({ name, Icon }) => (
                                <button
                                    key={name}
                                    onClick={() => handleIconClick(name)}
                                    className="aspect-square flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 hover:shadow-sm transition-all group"
                                >
                                    <Icon
                                        size={28}
                                        color={selectedColor === 'currentColor' ? '#64748b' : selectedColor}
                                        fill={selectedStyle === 'filled' ? (selectedColor === 'currentColor' ? '#64748b' : selectedColor) : 'none'}
                                        className="group-hover:scale-110 transition-transform duration-200"
                                    />
                                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 truncate w-full text-center">
                                        {name}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {filteredIcons.length > 100 && (
                            <div className="text-center py-6 text-slate-400 text-sm italic">
                                Mostrando primeros 100 resultados. Refina tu búsqueda.
                            </div>
                        )}
                        {filteredIcons.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Search size={40} className="mb-4 opacity-50" />
                                <p>No se encontraron iconos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

