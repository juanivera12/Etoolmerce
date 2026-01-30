import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Image, ShieldCheck, Shrub, AlertTriangle, Loader2 } from 'lucide-react';
import { useContentModeration } from '../../hooks/useContentModeration';
import html2canvas from 'html2canvas';

export const PublishTemplateModal = ({ onClose }) => {
    const { validateImageContent, isAnalyzing } = useContentModeration();

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'E-commerce'
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null); // File object or Blob
    const [error, setError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        try {
            // Preview
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setImageFile(file);

            // Validate Immediately
            await validateImageContent(file);
        } catch (err) {
            setError(err.message);
            setPreviewImage(null);
            setImageFile(null);
        }
    };

    const handleCapture = async () => {
        setError(null);
        setIsCapturing(true);
        try {
            const workspace = document.getElementById('canvas-area'); // Assuming this ID exists or I need to target the right element
            if (!workspace) throw new Error("No se encontró el área de trabajo para capturar.");

            const canvas = await html2canvas(workspace, {
                useCORS: true,
                scale: 0.5, // Lower resolution for thumbnail
                logging: false
            });

            canvas.toBlob(async (blob) => {
                const url = URL.createObjectURL(blob);
                setPreviewImage(url);
                setImageFile(blob); // Treat blob as file

                try {
                    await validateImageContent(blob);
                } catch (err) {
                    setError(err.message);
                    setPreviewImage(null);
                    setImageFile(null);
                } finally {
                    setIsCapturing(false);
                }
            }, 'image/jpeg', 0.8);

        } catch (err) {
            console.error(err);
            setError("Error al capturar la pantalla: " + err.message);
            setIsCapturing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setError("Debes subir o capturar una imagen de portada.");
            return;
        }
        if (isAnalyzing) return;

        // Simulate Submission
        setIsSuccess(true);
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center backdrop-blur-sm">
                <div className="bg-surface p-8 rounded-xl flex flex-col items-center animate-in zoom-in text-center">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">¡Plantilla Publicada!</h3>
                    <p className="text-text-muted">Tu diseño ha pasado la moderación y ya está en la comunidad.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl w-[500px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight/30">
                    <h2 className="text-lg font-bold text-text flex items-center gap-2">
                        <Upload size={18} className="text-primary" />
                        Publicar en Comunidad
                    </h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Image Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text block">Imagen de Portada (Miniatura)</label>

                        <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-surface-highlight/10 min-h-[160px] relative overflow-hidden group">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-text-muted z-10 pointer-events-none">
                                    <Image className="mx-auto mb-2 opacity-50" size={32} />
                                    <p className="text-xs">Sube una imagen o captura la vista actual</p>
                                </div>
                            )}

                            {/* Hover Overlay for Buttons if image exists, or always visible if not */}
                            <div className={clsx("absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity z-20", previewImage ? "opacity-0 group-hover:opacity-100" : "opacity-100")}>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-slate-800 px-3 py-1.5 rounded text-xs font-medium hover:bg-slate-100 flex items-center gap-2"
                                >
                                    <Upload size={14} /> Subir
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCapture}
                                    disabled={isCapturing}
                                    className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    {isCapturing ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                                    {isCapturing ? 'Capturando...' : 'Capturar Vista'}
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* Error Analysis */}
                        {isAnalyzing && (
                            <div className="text-xs text-blue-400 flex items-center gap-2 animate-pulse mt-1">
                                <ShieldCheck size={12} /> Analizando contenido con IA (TensorFlow)...
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-2 rounded flex items-start gap-2">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text">Título</label>
                            <input
                                type="text" name="title" required
                                value={formData.title} onChange={handleInputChange}
                                className="w-full p-2 text-xs bg-surface border border-border rounded focus:border-primary outline-none"
                                placeholder="Ej. Tienda Minimalista"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text">Categoría</label>
                            <select
                                name="category"
                                value={formData.category} onChange={handleInputChange}
                                className="w-full p-2 text-xs bg-surface border border-border rounded focus:border-primary outline-none"
                            >
                                <option>E-commerce</option>
                                <option>Blog</option>
                                <option>Portfolio</option>
                                <option>Landing Page</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-text">Autor</label>
                        <input
                            type="text" name="author" required
                            value={formData.author} onChange={handleInputChange}
                            className="w-full p-2 text-xs bg-surface border border-border rounded focus:border-primary outline-none"
                            placeholder="Tu Nombre o Nickname"
                        />
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isAnalyzing || !!error || !imageFile}
                            className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                        >
                            {isAnalyzing ? 'Verificando...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
