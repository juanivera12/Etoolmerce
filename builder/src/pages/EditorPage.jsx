import React, { useState } from 'react';
import { useEditorStore, selectActivePageContent } from '../store/useEditorStore';
import { MainLayout } from '../components/layout/MainLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { Toolbar } from '../components/layout/Toolbar';
import { PropertiesPanel } from '../components/layout/PropertiesPanel';
import { GlobalSettingsPanel } from '../components/layout/GlobalSettingsPanel';
import { Renderer } from '../components/editor/Renderer';
import { TutorialOverlay } from '../components/layout/TutorialOverlay';
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
    const [showGlobalSettings, setShowGlobalSettings] = useState(false);

    const canvasWrapperRef = React.useRef(null);
    const { handlers, selectionRect, cursorStyle } = useCanvasInteraction(canvasWrapperRef);

    // Hook for Global Shortcuts
    useKeyboardShortcuts(() => {
        console.log("Saving project...");
        setShowPublishModal(true);
    });

    return (
        <CartProvider>
            <MainLayout
                leftPanel={!isPreviewMode ? <Sidebar /> : null}
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
            >
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
                {!isPreviewMode && <FloatingToolbar />}

                {/* AI Bar & Trash */}
                {!isPreviewMode && (
                    <>
                        <TrashZone />
                    </>
                )}

            </MainLayout>

            {/* Overlays */}
            {isTutorialActive && <TutorialOverlay />}
            {isTutorialActive && <TutorialOverlay />}
            {showPublishModal && <PublishModal onClose={() => setShowPublishModal(false)} />}
            {showPublishTemplateModal && <PublishTemplateModal onClose={() => setShowPublishTemplateModal(false)} />}
            {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
        </CartProvider>
    );
};
