import React from 'react';
import { Download, LayoutTemplate, Zap } from 'lucide-react';
import clsx from 'clsx';

export const CommunityTemplateCard = ({ template, onUse }) => {
    // Support both old community structure (image) and new registry (thumbnailSrc, thumbnail_url)
    const imageSrc = template.thumbnail_url || template.thumbnailSrc || template.image;

    return (
        <div className="group border border-border rounded-lg overflow-hidden bg-surface hover:border-primary transition-all hover:shadow-lg flex flex-col h-full animate-in fade-in duration-300">
            {/* Preview Image Area (16:9) */}
            <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center isolate">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={template.title || template.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-300">
                        <LayoutTemplate size={48} strokeWidth={1.5} />
                        <span className="text-[10px] uppercase font-bold tracking-widest mt-2">Sin Vista Previa</span>
                    </div>
                )}

                {/* Badge Category */}
                <div className="absolute top-2 left-2 z-10">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium border border-white/10 uppercase tracking-wide">
                        {template.category || 'Comunidad'}
                    </span>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-20">
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
            <div className="p-4 flex-1 flex flex-col gap-2">
                <div>
                    <h3 className="font-bold text-text truncate text-sm" title={template.title || template.name}>
                        {template.title || template.name}
                    </h3>

                    {/* Description */}
                    {template.description && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                            {template.description}
                        </p>
                    )}
                </div>

                {/* Footer / Meta */}
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
                    {template.author_name && (
                        <div className="flex items-center gap-1.5 text-text-muted">
                            {template.author_avatar ? (
                                <img
                                    src={template.author_avatar}
                                    alt={template.author_name}
                                    className="w-5 h-5 rounded-full object-cover border border-border"
                                />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-surface-highlight flex items-center justify-center text-[10px] font-bold uppercase text-text border border-border">
                                    {template.author_name.charAt(0)}
                                </div>
                            )}
                            <span className="text-xs font-medium truncate max-w-[100px]">
                                Por: {template.author_name}
                            </span>
                        </div>
                    )}

                    {/* Downloads count if available */}
                    {template.downloads !== undefined && (
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                            <Download size={10} /> {template.downloads}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
