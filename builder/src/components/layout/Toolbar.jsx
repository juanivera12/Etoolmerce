import React, { useState } from 'react';
import { Eye, Save, X, FileCode, Monitor, Tablet, Smartphone, Trophy, Palette, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { useEditorStore } from '../../store/useEditorStore';

export const Toolbar = ({ isPreviewMode, togglePreview, onPublish, onImport, onToggleGlobalSettings }) => {
    const { viewMode, setViewMode } = useEditorStore();
    const [showProgress, setShowProgress] = useState(false);

    return (
        <>
            <div className="flex items-center space-x-4 flex-1">
                <span className="text-sm font-medium text-text-muted">Página: <span className="text-text">Inicio</span></span>
            </div>

            {/* Device Selector */}
            {!isPreviewMode && (
                <div className="flex bg-surface-highlight p-1 rounded-lg border border-border absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={clsx("p-2 rounded-md transition-all", viewMode === 'desktop' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600")}
                        title="Escritorio"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('tablet')}
                        className={clsx("p-2 rounded-md transition-all", viewMode === 'tablet' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600")}
                        title="Tablet"
                    >
                        <Tablet size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={clsx("p-2 rounded-md transition-all", viewMode === 'mobile' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600")}
                        title="Móvil"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3">

                {/* Gamification Widget */}
                {!isPreviewMode && (
                    <div className="relative">
                        <button
                            onClick={() => setShowProgress(!showProgress)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors text-xs font-bold"
                        >
                            <Trophy size={14} />
                            <span>Progreso: 30%</span>
                        </button>

                        {/* Progress Popover */}
                        {showProgress && (
                            <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Trophy size={16} className="text-yellow-500" />
                                    Tu Camino al Éxito
                                </h4>
                                <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[30%]"></div>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-slate-600 opacity-50">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        <span className="line-through">Crear primera sección</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                                        <div className="w-4 h-4 rounded-full border-2 border-indigo-500"></div>
                                        <span>Agregar logo de marca</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                                        <span>Configurar pasarela de pagos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                                        <span>Publicar tu tienda</span>
                                    </li>
                                </ul>
                                <button onClick={() => setShowProgress(false)} className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                    Seguir Editando
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Global Settings */}
                {!isPreviewMode && (
                    <button
                        onClick={onToggleGlobalSettings}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        title="Ajustes Globales"
                    >
                        <Palette size={20} />
                    </button>
                )}

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
