import React, { useState, useEffect } from 'react';
import { X, LayoutTemplate, Download, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { supabase } from '../../services/supabaseClient'; // Direct Supabase Import
import { CommunityTemplateCard } from './CommunityTemplateCard';
import { PublishTemplateModal } from './PublishTemplateModal';

export const CommunityTemplatesModal = ({ onClose }) => {
    // Fix: Select specific actions individually to avoid object reference loop
    const loadTemplate = useEditorStore(state => state.loadTemplate);
    // const setComponents = useEditorStore(state => state.updateContent); // Not needed if loadTemplate handles it

    // Check if strict replacement is needed. Store likely has setComponents or loadTemplate that handles it.
    // Previous code used loadTemplate(content).

    const [showPublishModal, setShowPublishModal] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    throw error;
                }

                setTemplates(data || []);

            } catch (err) {
                console.error("Error fetching templates:", err);
                setError(`No se pudieron cargar las plantillas. ${err.message || ''}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleUseTemplate = (template) => {
        if (confirm(`¿Cargar la plantilla "${template.title || template.name}"? Esto reemplazará tu página actual.`)) {
            // Use structure_json from DB
            if (template.structure_json) {
                loadTemplate(template.structure_json);
                onClose();
            } else if (template.content || template.structure) {
                // Fallback for older/static templates
                loadTemplate(template.content || template.structure);
                onClose();
            } else {
                alert("Esta plantilla no tiene estructura válida.");
            }
        }
    };

    if (showPublishModal) {
        return <PublishTemplateModal onClose={() => setShowPublishModal(false)} />;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-200">
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
                                <CommunityTemplateCard
                                    key={template.id}
                                    template={template}
                                    onUse={() => handleUseTemplate(template)}
                                />
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
        </div>
    );
};
