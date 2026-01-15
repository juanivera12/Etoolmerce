import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { X, Code2, Box, Check } from 'lucide-react';
import clsx from 'clsx';

export const ProjectSettingsModal = ({ onClose }) => {
    const { projectConfig, setProjectConfig } = useEditorStore();

    const frameworks = [
        {
            id: 'html',
            label: 'HTML / CSS / JS',
            icon: Code2,
            description: 'Ideal para principiantes y sitios estáticos simples.',
            details: [
                'Estructura simple con archivos .html, .css y .js separados.',
                'Fácil de alojar en cualquier servidor (hosting compartido, GitHub Pages).',
                'No requiere compilación ni herramientas complejas.',
                'Perfecto para landing pages, portafolios y sitios informativos.'
            ]
        },
        {
            id: 'react',
            label: 'React + JSX',
            icon: Box,
            description: 'Para aplicaciones web modernas y dinámicas.',
            details: [
                'Arquitectura basada en componentes reutilizables.',
                'Ideal si planeas escalar tu aplicación o conectar bases de datos.',
                'Genera archivos .jsx listos para Vercel, Netlify o proyectos Vite.',
                'Requiere conocimientos básicos de desarrollo web moderno.'
            ]
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl max-w-2xl w-full shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-border bg-surface-highlight/30">
                    <div>
                        <h2 className="text-xl font-bold text-text">Configuración del Proyecto</h2>
                        <p className="text-sm text-text-muted">Elige cómo quieres trabajar y exportar tu código final.</p>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 grid gap-4">
                    {frameworks.map((fw) => {
                        const Icon = fw.icon;
                        const isSelected = projectConfig.targetFramework === fw.id;

                        return (
                            <div
                                key={fw.id}
                                onClick={() => setProjectConfig({ targetFramework: fw.id })}
                                className={clsx(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-surface-highlight/50",
                                    isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-border/80"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={clsx("p-3 rounded-lg", isSelected ? "bg-primary text-white" : "bg-surface-highlight text-text-muted")}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={clsx("font-bold mb-1", isSelected ? "text-primary" : "text-text")}>{fw.label}</h3>
                                        <p className="text-sm text-text-muted mb-3">{fw.description}</p>

                                        <ul className="space-y-1">
                                            {fw.details.map((detail, idx) => (
                                                <li key={idx} className="text-xs text-text-muted/80 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 text-primary">
                                            <div className="bg-primary rounded-full p-1">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-border bg-surface-highlight/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-lg shadow-primary/20 transition-all"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};
