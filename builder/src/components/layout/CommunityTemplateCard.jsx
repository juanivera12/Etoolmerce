import React from 'react';
import { Download, LayoutTemplate, User, Heart } from 'lucide-react';
import clsx from 'clsx';

export const CommunityTemplateCard = ({ template, onUse }) => {
    return (
        <div className="group border border-border rounded-lg overflow-hidden bg-surface hover:border-primary transition-all hover:shadow-lg flex flex-col h-full animate-in fade-in duration-300">
            {/* Preview Image Area (16:9) */}
            <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {template.image ? (
                    <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-300">
                        <LayoutTemplate size={48} strokeWidth={1.5} />
                        <span className="text-[10px] uppercase font-bold tracking-widest mt-2">Sin Vista Previa</span>
                    </div>
                )}

                {/* Badge Category */}
                <div className="absolute top-2 left-2">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium border border-white/10 uppercase tracking-wide">
                        {template.category || 'E-commerce'}
                    </span>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button
                        onClick={() => onUse(template)}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2"
                    >
                        <Download size={16} />
                        Usar Plantilla
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-text truncate text-sm mb-1" title={template.name}>
                        {template.name}
                    </h3>

                    {/* Author */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-5 h-5 rounded-full bg-surface-highlight flex items-center justify-center border border-border overflow-hidden">
                            <User size={12} className="text-text-muted" />
                        </div>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                            por <span className="text-text font-medium hover:underline cursor-pointer">{template.author || 'Anónimo'}</span>
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Heart size={12} className={clsx("hover:text-red-500 cursor-pointer transition-colors", template.likes > 0 && "text-red-500 fill-red-500")} />
                        <span>{template.likes || 0}</span>
                    </div>
                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-500/20 font-medium">Gratis</span>
                </div>
            </div>
        </div>
    );
};
