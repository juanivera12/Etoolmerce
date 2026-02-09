import React from 'react';
import { X, Layout, MousePointer2, Settings, Zap, Code } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

export const TutorialOverlay = () => {
    const { toggleTutorial } = useEditorStore();

    return (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 relative overflow-hidden shadow-2xl">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />

                <button
                    onClick={toggleTutorial}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="space-y-8 relative">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/10 text-yellow-500 mb-6">
                            <Zap size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a E-ToolMerce</h2>
                        <p className="text-zinc-400">Domina las herramientas básicas en menos de un minuto.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0">
                                <Layout size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold flex items-center gap-2">Panel de Componentes</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">Arrastra elementos desde la izquierda: botones, imágenes, carruseles y más directamente al lienzo.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0">
                                <MousePointer2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Edición Directa</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">Selecciona cualquier elemento en el centro para ver sus opciones de personalización instantánea.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Diseño Visual</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">Ajusta colores, fuentes y espaciados en el panel derecho sin tocar una sola línea de código.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-yellow-500 shrink-0">
                            <Code size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Exportar y Ejecutar</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Al descargar tu código, recuerda que necesitarás <b>Visual Studio Code</b> (o similar) para ejecutar el proyecto en tu computadora.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={toggleTutorial}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
                    >
                        ¡EMPEZAR A CREAR!
                    </button>
                </div>
            </div>
        </div>

    );
};
