import React, { useState } from 'react';
import { parseHTML } from '../../utils/htmlParser';
import { useEditorStore } from '../../store/useEditorStore';
import { X, Upload, FileCode } from 'lucide-react';

export const ImportModal = ({ onClose }) => {
    const [htmlCode, setHtmlCode] = useState('');
    const [error, setError] = useState('');
    // Use getState for imperative actions usually, but here we need state to update
    const { activePageId, pages, updateContent } = useEditorStore();

    const handleImport = () => {
        try {
            if (!htmlCode.trim()) {
                setError('Please paste some HTML code.');
                return;
            }

            const newMessage = parseHTML(htmlCode);

            // Correctly update the active page content
            // We can manually update the pages array
            const newPages = pages.map(p => p.id === activePageId ? { ...p, content: newMessage } : p);

            useEditorStore.setState({ pages: newPages, selectedId: null });

            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to parse HTML. Make sure it is valid.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-text flex items-center gap-2">
                            <Upload size={24} className="text-primary" />
                            Import Code
                        </h2>
                        <p className="text-sm text-text-muted">Paste your existing HTML/CSS to generate a layout.</p>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-background p-4 rounded-lg mb-4 flex-1 border border-border flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-xs text-text-muted">
                        <FileCode size={14} />
                        <span>HTML Snippet (Body Content)</span>
                    </div>
                    <textarea
                        className="w-full h-64 bg-transparent border-none outline-none text-sm font-mono text-text resize-none"
                        placeholder="<div style='display: flex;'>...</div>"
                        value={htmlCode}
                        onChange={(e) => setHtmlCode(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-text-muted hover:text-text font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-lg shadow-primary/20 transition-all"
                    >
                        Import Layout
                    </button>
                </div>
            </div>
        </div>
    );
};
