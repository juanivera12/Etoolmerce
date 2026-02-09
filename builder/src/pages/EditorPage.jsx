import React, { useState } from 'react';
import { useEditorStore, selectActivePageContent } from '../store/useEditorStore';
import { MainLayout } from '../components/layout/MainLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { Toolbar } from '../components/layout/Toolbar';
import { PropertiesPanel } from '../components/layout/PropertiesPanel';
import { GlobalSettingsPanel } from '../components/layout/GlobalSettingsPanel';
import { Renderer } from '../components/editor/Renderer';
import { TutorialOverlay } from '../components/layout/TutorialOverlay';
import { ProjectSettingsModal } from '../components/layout/ProjectSettingsModal';
import { CommunityTemplatesModal } from '../components/layout/CommunityTemplatesModal';
import { AdvancedIconPickerModal } from '../components/layout/AdvancedIconPickerModal';
import { PublishModal } from '../components/layout/PublishModal';
import { PublishTemplateModal } from '../components/layout/PublishTemplateModal';
import { ImportModal } from '../components/layout/ImportModal';
import { TrashZone } from '../components/layout/TrashZone';
import { CartProvider } from '../context/CartContext';
import clsx from 'clsx';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { FloatingToolbar } from '../components/layout/FloatingToolbar';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';

export const EditorPage = () => {
    const pageData = useEditorStore(selectActivePageContent);
    const { isPreviewMode, viewMode, isTutorialActive, togglePreview, toggleTutorial, activeTool } = useEditorStore();
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showPublishTemplateModal, setShowPublishTemplateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showGlobalSettings, setShowGlobalSettings] = useState(false);

    const canvasWrapperRef = React.useRef(null);
    const { handlers, selectionRect, cursorStyle } = useCanvasInteraction(canvasWrapperRef);

    // Hook for Global Shortcuts
    useKeyboardShortcuts(() => {
        console.log("Saving project...");
        setShowPublishModal(true);
    });

    const isModalOpen = showPublishModal || showPublishTemplateModal || showImportModal || showGlobalSettings || showSettings || showTemplates || showIconPicker;

    return (
        <CartProvider>
            <MainLayout
                leftPanel={!isPreviewMode ? (
                    <Sidebar
                        onShowSettings={() => setShowSettings(true)}
                        onShowTemplates={() => setShowTemplates(true)}
                        onShowIconPicker={() => setShowIconPicker(true)}
                    />
                ) : null}
                rightPanel={!isPreviewMode ? (showGlobalSettings ? <GlobalSettingsPanel onClose={() => setShowGlobalSettings(false)} /> : <PropertiesPanel />) : null}
                toolbar={
                    <Toolbar
                        isPreviewMode={isPreviewMode}
                        togglePreview={togglePreview}
                        onPublish={() => setShowPublishModal(true)}
                        onPublishCommunity={() => setShowPublishTemplateModal(true)}
                        onImport={() => setShowImportModal(true)}
                        onToggleGlobalSettings={() => setShowGlobalSettings(!showGlobalSettings)}
                    />
                }
                isUIHidden={isModalOpen && !isPreviewMode}
            >
                {/* Responsive Controls - Vertical Floating Bar (Next to Sidebar) */}
                {!isPreviewMode && (
                    <div className="absolute top-8 left-4 z-50 flex flex-col gap-2 bg-surface border border-border p-1.5 rounded-lg shadow-sm">
                        <button
                            onClick={() => useEditorStore.getState().setViewMode('desktop')}
                            className={clsx(
                                "p-2 rounded-md transition-all hover:bg-surface-highlight hover:text-primary",
                                viewMode === 'desktop' ? "bg-surface-highlight text-primary" : "text-text-muted"
                            )}
                            title="Escritorio"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                        </button>
                        <button
                            onClick={() => useEditorStore.getState().setViewMode('tablet')}
                            className={clsx(
                                "p-2 rounded-md transition-all hover:bg-surface-highlight hover:text-primary",
                                viewMode === 'tablet' ? "bg-surface-highlight text-primary" : "text-text-muted"
                            )}
                            title="Tablet"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" /></svg>
                        </button>
                        <button
                            onClick={() => useEditorStore.getState().setViewMode('mobile')}
                            className={clsx(
                                "p-2 rounded-md transition-all hover:bg-surface-highlight hover:text-primary",
                                viewMode === 'mobile' ? "bg-surface-highlight text-primary" : "text-text-muted"
                            )}
                            title="Móvil"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" /></svg>
                        </button>
                    </div>
                )}
                {/* Canvas Area */}
                <div
                    className={clsx("min-h-full flex justify-center p-8 relative", !isPreviewMode && "pb-32")}
                    {...handlers}
                    style={{ ...cursorStyle }}
                    ref={canvasWrapperRef} // Attach ref to the wrapper that captures events
                >
                    {/* Selection Rect - Rendered in wrapper coordinate space */}
                    {selectionRect && (
                        <div
                            className="absolute border-2 border-blue-500 bg-blue-500/20 z-[9999] pointer-events-none"
                            style={{
                                left: selectionRect.x,
                                top: selectionRect.y,
                                width: selectionRect.width,
                                height: selectionRect.height
                            }}
                        />
                    )}

                    <div
                        className={clsx(
                            "bg-background rounded-sm min-h-[800px] transition-all duration-300 origin-top ease-in-out relative overflow-hidden transform-gpu isolate",
                            "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)]",
                            viewMode === 'mobile' ? "w-[375px]" :
                                viewMode === 'tablet' ? "w-[768px]" :
                                    isPreviewMode ? "w-full h-full max-w-none" : "w-full max-w-[1200px]"
                        )}
                        id="canvas-area"
                    >
                        <div className={clsx(
                            (activeTool === 'hand' || activeTool === 'multiselect') && "pointer-events-none"
                        )}>
                            <Renderer node={pageData} />
                        </div>
                    </div>
                </div>

                {/* Floating Toolbar */}
                {!isPreviewMode && !isModalOpen && <FloatingToolbar />}

                {/* AI Bar & Trash */}
                {!isPreviewMode && !isModalOpen && (
                    <>
                        <TrashZone />
                    </>
                )}

            </MainLayout>

            {/* Overlays */}
            {isTutorialActive && <TutorialOverlay />}
            {showPublishModal && <PublishModal onClose={() => setShowPublishModal(false)} />}
            {showPublishTemplateModal && <PublishTemplateModal onClose={() => setShowPublishTemplateModal(false)} />}
            {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}

            {/* Sidebar Modals lifted up */}
            {showSettings && <ProjectSettingsModal onClose={() => setShowSettings(false)} />}
            {showTemplates && <CommunityTemplatesModal onClose={() => setShowTemplates(false)} />}
            {showIconPicker && (
                <AdvancedIconPickerModal
                    onClose={() => setShowIconPicker(false)}
                    onSelect={(iconData) => {
                        const state = useEditorStore.getState();
                        const targetId = state.selectedId || state.pages.find(p => p.id === state.activePageId)?.content?.id;

                        if (targetId) {
                            state.addElement(targetId, 'icon', {
                                content: iconData.content,
                                ...iconData.styles
                            });
                        }
                    }}
                />
            )}
        </CartProvider>
    );
};
