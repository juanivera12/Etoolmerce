import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useEditorStore } from '../../store/useEditorStore';
import { X, Upload, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const PublishTemplateModal = ({ onClose }) => {
    // 1. Get current components from store
    // 1. Get current components from store
    const pages = useEditorStore((state) => state.pages);
    const activePageId = useEditorStore((state) => state.activePageId);

    // Derive components from state safely
    const components = pages.find(p => p.id === activePageId)?.content || [];

    // Local State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Fetch User on Mount to get author_id and author_name
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
        };
        getUser();
    }, []);

    // Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Main Publish Logic
    const handlePublish = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("Debes iniciar sesión para publicar.");
            return;
        }
        if (!title || !thumbnail) {
            setError("El título y la miniatura son obligatorios.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Upload Image to Supabase Storage
            const fileExt = thumbnail.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('template-previews')
                .upload(fileName, thumbnail);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('template-previews')
                .getPublicUrl(fileName);

            // 2. Insert Record into Database
            const { error: insertError } = await supabase
                .from('community_templates')
                .insert([
                    {
                        title,
                        description,
                        thumbnail_url: publicUrl,
                        structure_json: components, // The actual editor content
                        author_id: user.id,
                        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User'
                    }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);

            // Auto close after success
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            console.error("Publish Error:", err);
            setError(err.message || "Error al publicar la plantilla.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-zinc-900 to-[#121212]">
                    <h2 className="text-xl font-bold text-white mb-1">Publicar en la Comunidad</h2>
                    <p className="text-sm text-zinc-400">Comparte tu diseño con otros creadores.</p>
                </div>

                {success ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="spring"
                            className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-500"
                        >
                            <CheckCircle size={32} />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mb-2">¡Plantilla Publicada!</h3>
                        <p className="text-zinc-400">Tu diseño ya está visible para la comunidad.</p>
                    </div>
                ) : (
                    <form onSubmit={handlePublish} className="p-6 space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                Nombre de la Plantilla
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Landing Page Cyberpunk"
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe tu diseño, para quién es ideal..."
                                rows={3}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none custom-scrollbar"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                Miniatura / Preview
                            </label>
                            <div className="relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <div className={clsx(
                                    "border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center transition-all overflow-hidden relative",
                                    previewUrl ? "border-indigo-500/30 bg-zinc-900" : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700"
                                )}>
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                                    <Upload size={14} /> Cambiar Imagen
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4 pointer-events-none">
                                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                                                <ImageIcon size={24} />
                                            </div>
                                            <p className="text-sm text-zinc-300 font-medium">Sube una imagen</p>
                                            <p className="text-xs text-zinc-500 mt-1">PNG, JPG hasta 2MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2"
                                >
                                    <X size={14} className="shrink-0" /> <span className="flex-1">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !title || !thumbnail}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Publicando...
                                </>
                            ) : (
                                <>
                                    Publicar Ahora
                                </>
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};
