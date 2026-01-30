import React, { useState } from 'react';
import { X, LayoutTemplate, Download, Upload } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { COMMUNITY_TEMPLATES } from '../../data/communityTemplates';
import { CommunityTemplateCard } from './CommunityTemplateCard';
import { PublishTemplateModal } from './PublishTemplateModal';

export const CommunityTemplatesModal = ({ onClose }) => {
    const loadTemplate = useEditorStore(state => state.loadTemplate);
    const [showPublishModal, setShowPublishModal] = useState(false);

    const handleUseTemplate = (template) => {
        if (confirm(`¿Cargar la plantilla "${template.name}"? Esto reemplazará tu página actual.`)) {
            loadTemplate(template.content);
            onClose();
        }
    };

    if (showPublishModal) {
        return <PublishTemplateModal onClose={() => setShowPublishModal(false)} />;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl shadow-2xl w-[900px] h-[600px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight/50">
                    <div className="flex items-center gap-2">
                        <LayoutTemplate className="text-primary" size={24} />
                        <div>
                            <h2 className="text-lg font-bold">Plantillas de la Comunidad</h2>
                            <p className="text-xs text-text-muted">Descubre y usa diseños creados por otros usuarios.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-surface rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-background">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {COMMUNITY_TEMPLATES.map((template) => (
                            <CommunityTemplateCard
                                key={template.id}
                                template={template}
                                onUse={handleUseTemplate}
                            />
                        ))}
                    </div>

                    <div className="mt-8 p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center text-text-muted opacity-80 hover:opacity-100 transition-opacity bg-surface/50">
                        <LayoutTemplate size={40} className="mb-3 text-secondary" />
                        <h3 className="font-medium text-text">¿Tienes un diseño increíble?</h3>
                        <p className="text-sm mb-4">Comparte tu trabajo con la comunidad.</p>

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
