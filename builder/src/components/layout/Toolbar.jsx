import React, { useState } from 'react';
import { Eye, Save, X, FileCode, Monitor, Tablet, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import { useEditorStore } from '../../store/useEditorStore';

export const Toolbar = ({ isPreviewMode, togglePreview, onPublish, onImport, onToggleGlobalSettings }) => {
    const { viewMode, setViewMode } = useEditorStore();


    return (
        <>
            <div className="flex items-center space-x-4 flex-1">
                <span className="text-sm font-medium text-text-muted">Página: <span className="text-text">Inicio</span></span>
            </div>

            {/* Device Selector */}
            {!isPreviewMode && (
                <div className="flex bg-surface p-1 rounded-lg border border-border absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={clsx("p-2 rounded-md transition-all", viewMode === 'desktop' ? "bg-surface-highlight shadow-sm text-primary" : "text-text-muted hover:text-text")}
                        title="Escritorio"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('tablet')}
                        className={clsx("p-2 rounded-md transition-all", viewMode === 'tablet' ? "bg-surface-highlight shadow-sm text-primary" : "text-text-muted hover:text-text")}
                        title="Tablet"
                    >
                        <Tablet size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={clsx("p-2 rounded-md transition-all", viewMode === 'mobile' ? "bg-surface-highlight shadow-sm text-primary" : "text-text-muted hover:text-text")}
                        title="Móvil"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3">



                {/* Global Settings */}


                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button
                    onClick={togglePreview}
                    className={clsx(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
                        isPreviewMode
                            ? "bg-surface-highlight text-text hover:bg-surface border border-border"
                            : "text-text-muted hover:text-text hover:bg-surface-highlight"
                    )}
                >
                    {isPreviewMode ? <X size={16} /> : <Eye size={16} />}
                    {isPreviewMode ? "Salir" : "Vista Previa"}
                </button>

                {!isPreviewMode && (
                    <div className="flex gap-2">
                        <button
                            onClick={onImport}
                            className="px-4 py-2 text-sm font-medium text-text bg-surface-highlight hover:bg-border border border-border rounded-lg transition-all flex items-center gap-2"
                        >
                            <FileCode size={16} />
                        </button>
                        <button
                            onClick={onPublish}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Save size={16} />
                            Exportar
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
