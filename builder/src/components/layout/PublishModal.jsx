import React, { useState, useMemo } from 'react';
import { generateProfessionalCode, generateZip } from '../../utils/codeGenerator';
import { useEditorStore } from '../../store/useEditorStore';
import clsx from 'clsx';
import { X, Copy, Check, FileCode, Folder, Download } from 'lucide-react';

export const PublishModal = ({ onClose }) => {
    const { pages, projectConfig } = useEditorStore();
    const [selectedFile, setSelectedFile] = useState(null);
    const [copied, setCopied] = useState(false);

    const [error, setError] = useState(null);

    // Generate code for all pages with error handling
    const projectFiles = useMemo(() => {
        try {
            return generateProfessionalCode(pages);
        } catch (err) {
            console.error("Code generation failed:", err);
            setError(err.message);
            return {};
        }
    }, [pages]);

    // Handler for ZIP download
    const handleDownloadZip = () => {
        generateZip(pages);
    };

    // Sort keys based on preference
    const fileNames = useMemo(() => {
        // ... existing sorting logic
        const keys = Object.keys(projectFiles);
        const preference = projectConfig.targetFramework; // 'html' or 'react'

        return keys.sort((a, b) => {
            const isReactA = a.endsWith('.jsx');
            const isReactB = b.endsWith('.jsx');

            if (preference === 'react') {
                if (isReactA && !isReactB) return -1;
                if (!isReactA && isReactB) return 1;
            } else {
                if (!isReactA && isReactB) return -1;
                if (isReactA && !isReactB) return 1;
            }
            return a.localeCompare(b);
        });
    }, [projectFiles, projectConfig.targetFramework]);

    // ... (selection logic)
    if (!selectedFile && fileNames.length > 0) {
        const prefFile = fileNames.find(f => projectConfig.targetFramework === 'react' ? f.endsWith('.jsx') : f.endsWith('.html'));
        setSelectedFile(prefFile || fileNames[0]);
    }

    const currentCode = selectedFile ? projectFiles[selectedFile] : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(currentCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl max-w-5xl w-full shadow-2xl flex flex-col h-[700px] animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-border bg-surface-highlight/30">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-text">Exportar Proyecto</h2>
                            <p className="text-sm text-text-muted">
                                Genera código limpio y semántico.
                            </p>
                        </div>
                        <button
                            onClick={handleDownloadZip}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all font-semibold"
                        >
                            <Download size={18} />
                            Descargar ZIP
                        </button>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {error ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-red-500 p-10 text-center">
                            <h3 className="text-lg font-bold mb-2">Error al Generar Código</h3>
                            <pre className="bg-red-50 p-4 rounded text-xs overflow-auto max-w-full text-slate-700 border border-red-200">
                                {error}
                            </pre>
                            <p className="mt-4 text-sm text-slate-500">Intenta nombrar tus capas con texto simple (a-z, 0-9).</p>
                        </div>
                    ) : (
                        <>
                            {/* File Explorer Sidebar */}
                            <div className="w-64 bg-surface-highlight/20 border-r border-border flex flex-col">
                                <div className="p-3 text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                    <Folder size={14} /> Estructura del Proyecto
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {fileNames.map(fileName => {
                                        // Opacity logic for non-preferred files
                                        const isPreferred = projectConfig.targetFramework === 'react'
                                            ? fileName.endsWith('.jsx')
                                            : !fileName.endsWith('.jsx');

                                        return (
                                            <button
                                                key={fileName}
                                                onClick={() => setSelectedFile(fileName)}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors truncate",
                                                    selectedFile === fileName
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-text-muted hover:bg-surface-highlight hover:text-text",
                                                    !isPreferred && "opacity-50 hover:opacity-100" // Dim non-preferred files
                                                )}
                                            >
                                                <FileCode size={14} className={clsx(
                                                    fileName.endsWith('.html') ? "text-orange-400" :
                                                        fileName.endsWith('.css') ? "text-blue-400" :
                                                            fileName.endsWith('.js') || fileName.endsWith('.jsx') ? "text-yellow-400" : "text-slate-400"
                                                )} />
                                                <span className="truncate" title={fileName}>{fileName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Code Editor Area */}
                            <div className="flex-1 flex flex-col bg-[#1e1e1e] text-slate-300">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between px-4 py-2 border-b border-[#333] bg-[#252526]">
                                    <span className="text-xs font-mono text-slate-400">{selectedFile}</span>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded bg-[#333] hover:bg-[#3e3e3e] text-white transition-colors"
                                    >
                                        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                        {copied ? 'Copiado' : 'Copiar'}
                                    </button>
                                </div>

                                {/* Editor content */}
                                <div className="flex-1 relative overflow-hidden">
                                    <textarea
                                        readOnly
                                        value={currentCode}
                                        className="w-full h-full bg-transparent p-4 font-mono text-sm outline-none resize-none custom-scrollbar leading-relaxed text-[#d4d4d4]"
                                        spellCheck="false"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
