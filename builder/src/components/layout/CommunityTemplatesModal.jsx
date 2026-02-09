import React, { useState, useEffect } from 'react';
import { X, LayoutTemplate, Download, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { supabase } from '../../services/supabaseClient'; // Direct Supabase Import
import { CommunityTemplateCard } from './CommunityTemplateCard';
import { PublishTemplateModal } from './PublishTemplateModal';
import { BrutalScrollTemplate } from '../../data/templates/brutalScrollTemplate';
import { EditorialFanningTemplate } from '../../data/templates/editorialFanningTemplate';
import { BentoPortfolioTemplate } from '../../data/templates/bentoPortfolioTemplate';
import { ArpeggioTemplate } from '../../data/templates/arpeggioTemplate';
import { LoFiTemplate } from '../../data/templates/lofiTemplate';

export const CommunityTemplatesModal = ({ onClose }) => {
    // Fix: Select specific actions individually to avoid object reference loop
    const loadTemplate = useEditorStore(state => state.loadTemplate);
    // const setComponents = useEditorStore(state => state.updateContent); // Not needed if loadTemplate handles it

    // Check if strict replacement is needed. Store likely has setComponents    // For now, using static + DB templates.
    // In real app, you might fetch all from DB using getTemplates service
    const [templates, setTemplates] = useState([LoFiTemplate, ArpeggioTemplate, EditorialFanningTemplate, BrutalScrollTemplate, BentoPortfolioTemplate]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [showPublishModal, setShowPublishModal] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                // Fetch from Supabase directly
                const { data, error } = await supabase
                    .from('community_templates')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Supabase Error Details:", error);
                    // allow local templates even if supabase fails
                }

                setTemplates([ArpeggioTemplate, BentoPortfolioTemplate, EditorialFanningTemplate, BrutalScrollTemplate, ...(data || [])]);

            } catch (err) {
                console.error("Error fetching templates:", err);
                setError(`No se pudieron cargar las plantillas. ${err.message || ''}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleSelectTemplate = (template) => {
        setSelectedPreview(template);
    };

    // --- User Data Handling ---
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUser(user);
        };
        getUser();
    }, []);

    const handleConfirmUse = () => {
        if (!selectedPreview) return;
        if (confirm(`¿Cargar la plantilla "${selectedPreview.title}"? REEMPLAZARÁ tu página actual.`)) {

            let templateContent = selectedPreview.structure_json || selectedPreview.content;

            // --- DYNAMIC INJECTION: Inject User Data if Logged In ---
            if (currentUser && templateContent) {
                // Deep clone to avoid mutating original template
                let structure = JSON.parse(JSON.stringify(templateContent));

                const userName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0];
                const userPfp = currentUser.user_metadata?.avatar_url || currentUser.identities?.[0]?.identity_data?.avatar_url;

                // Helper to traverse and replace
                const traverseAndInject = (node) => {
                    // Inject Name
                    if (['name_title', 'hero_title', 'author_name'].includes(node.id) && userName) {
                        node.content = userName;
                    }
                    // Inject Photo (Arpeggio & LoFi specific IDs)
                    if (['profile_pic_hero', 'lofi_profile_img'].includes(node.id) && userPfp) {
                        node.content = userPfp;
                    }

                    if (node.children && Array.isArray(node.children)) {
                        node.children.forEach(traverseAndInject);
                    }
                };

                traverseAndInject(structure);
                templateContent = structure;
            }

            loadTemplate(templateContent);
            onClose();
        }
    };

    if (showPublishModal) {
        return <PublishTemplateModal onClose={() => setShowPublishModal(false)} />;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] animate-in fade-in duration-200 p-4">

            {/* PREVIEW MODAL STATE */}
            {selectedPreview ? (
                <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSelectedPreview(null)} className="text-sm font-medium hover:bg-surface p-2 rounded-lg transition-colors flex items-center gap-1 text-text-muted hover:text-text">
                                ← Volver
                            </button>
                            <div className="h-6 w-px bg-border mx-2"></div>
                            <h2 className="text-xl font-bold text-text">{selectedPreview.title}</h2>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {selectedPreview.category || "General"}
                            </span>
                        </div>
                        <button onClick={onClose}><X className="text-text-muted hover:text-text" /></button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                        {/* LEFT: Large Preview */}
                        <div className="flex-1 bg-black/5 p-8 overflow-y-auto flex items-center justify-center custom-scrollbar">
                            <img
                                src={selectedPreview.thumbnailSrc || selectedPreview.thumbnail_url}
                                alt={selectedPreview.title}
                                className="w-full max-w-2xl shadow-2xl rounded-lg border border-border"
                            />
                        </div>

                        {/* RIGHT: Details & Author */}
                        <div className="w-full md:w-80 border-l border-border bg-surface p-6 flex flex-col gap-6 overflow-y-auto">
                            <div>
                                <h3 className="text-sm font-bold text-text mb-2 uppercase tracking-wide">Creador</h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                                        {/* Logic: If system template & user logged in -> Show User PFP. Else -> Show Template PFP or Initials */}
                                        {(selectedPreview.id.startsWith('template_') && currentUser?.user_metadata?.avatar_url) ? (
                                            <img src={currentUser.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : selectedPreview.author_pfp ? (
                                            <img src={selectedPreview.author_pfp} alt={selectedPreview.author_name} className="w-full h-full object-cover" />
                                        ) : (
                                            (selectedPreview.author_name || "U").charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        {/* Logic: If system template & user logged in -> Show User Name. Else -> Show Template Author */}
                                        <p className="font-medium text-text text-sm">
                                            {(selectedPreview.id.startsWith('template_') && currentUser)
                                                ? (currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0])
                                                : (selectedPreview.author_name || "Desconocido")}
                                        </p>
                                        <p className="text-xs text-text-muted">{selectedPreview.author_role || "Diseñador"}</p>
                                    </div>
                                </div>
                                {selectedPreview.author_bio && (
                                    <p className="text-xs text-text-muted leading-relaxed italic border-l-2 border-primary/30 pl-3">
                                        "{selectedPreview.author_bio}"
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-text mb-2 uppercase tracking-wide">Descripción</h3>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {selectedPreview.description || "Sin descripción disponible."}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-border">
                                <button
                                    onClick={handleConfirmUse}
                                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    Usar esta Plantilla
                                </button>
                                <p className="text-[10px] text-center text-text-muted mt-3">
                                    Reemplazará el contenido actual del editor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-xl shadow-2xl w-[900px] h-[600px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-text">
                    {/* Header */}
                    <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight/50">
                        <div className="flex items-center gap-2">
                            <LayoutTemplate className="text-primary" size={24} />
                            <div>
                                <h2 className="text-lg font-bold text-text">Plantillas de la Comunidad</h2>
                                <p className="text-xs text-text-muted">Diseños compartidos por otros usuarios.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-text">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-background custom-scrollbar">

                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 justify-center border border-red-500/20">
                                <AlertCircle size={18} /> {error}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => handleSelectTemplate(template)}
                                        className="cursor-pointer group relative bg-surface border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all shadow-sm hover:shadow-lg"
                                    >
                                        <div className="aspect-video bg-surface-highlight overflow-hidden relative">
                                            <img src={template.thumbnailSrc || template.thumbnail_url} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            {/* Hover overlay hint */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                                <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">Ver Detalles</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-text group-hover:text-primary transition-colors text-sm">{template.title}</h3>
                                                {template.category && <span className="text-[9px] bg-surface-highlight px-1.5 py-0.5 rounded text-text-muted uppercase tracking-wider border border-border">{template.category}</span>}
                                            </div>
                                            <p className="text-xs text-text-muted line-clamp-2 mb-3">{template.description}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-text-muted border-t border-border pt-2 mt-2">
                                                <div className="w-4 h-4 rounded-full bg-surface-highlight flex items-center justify-center font-bold text-[8px] border border-border">
                                                    {template.author_name ? template.author_name.charAt(0) : "U"}
                                                </div>
                                                <span className="truncate">Por: {template.author_name || "Desconocido"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {templates.length === 0 && (
                                    <div className="col-span-full text-center py-10 text-text-muted bg-surface/30 rounded-xl border border-dashed border-border">
                                        No hay plantillas disponibles. ¡Sé el primero en compartir!
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-opacity bg-surface/50">
                            <LayoutTemplate size={40} className="mb-3 text-secondary" />
                            <h3 className="font-medium text-text">¿Tienes un diseño increíble?</h3>
                            <p className="text-sm mb-4 text-text-muted">Comparte tu trabajo con la comunidad.</p>

                            <button
                                onClick={() => setShowPublishModal(true)}
                                className="bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-colors"
                            >
                                <Upload size={14} />
                                Publicar mi Plantilla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
