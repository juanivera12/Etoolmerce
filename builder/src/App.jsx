
import React, { useState } from 'react';
import { useEditorStore, selectActivePageContent } from './store/useEditorStore';
import { MainLayout } from './components/layout/MainLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Toolbar } from './components/layout/Toolbar';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { GlobalSettingsPanel } from './components/layout/GlobalSettingsPanel';
import { Renderer } from './components/editor/Renderer';
import { AICommandBar } from './components/layout/AICommandBar';
import { TutorialOverlay } from './components/layout/TutorialOverlay';
import { PublishModal } from './components/layout/PublishModal';
import { ImportModal } from './components/layout/ImportModal';
import { TrashZone } from './components/layout/TrashZone';
import clsx from 'clsx';
// import './App.css'; // Removed to avoid conflicts

function App() {
  const pageData = useEditorStore(selectActivePageContent);
  const { isPreviewMode, viewMode, isTutorialActive, togglePreview, toggleTutorial } = useEditorStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const { undo, redo, copy, paste, deleteElement, selectedId } = useEditorStore.getState();

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }

      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copy();
      }

      // Paste: Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // Paste needs async read if real clipboard? 
        // We are using internal state clipboard for now as requested.
        e.preventDefault();
        paste();
      }

      // Delete (Bonus: standard UX)
      if (e.key === 'Delete' && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <MainLayout
        leftPanel={!isPreviewMode ? <Sidebar /> : null}
        rightPanel={!isPreviewMode ? (showGlobalSettings ? <GlobalSettingsPanel onClose={() => setShowGlobalSettings(false)} /> : <PropertiesPanel />) : null}
        toolbar={
          <Toolbar
            isPreviewMode={isPreviewMode}
            togglePreview={togglePreview}
            onPublish={() => setShowPublishModal(true)}
            onImport={() => setShowImportModal(true)}
            onToggleGlobalSettings={() => setShowGlobalSettings(!showGlobalSettings)}
          />
        }
      >
        {/* Canvas Area */}
        <div className={clsx("min-h-full flex justify-center p-8", !isPreviewMode && "pb-32")}>
          <div
            className={clsx(
              "bg-white rounded-sm min-h-[800px] transition-all duration-300 origin-top ease-in-out relative overflow-hidden",
              // Premium Shadow: 0 20px 50px -12px rgba(0,0,0,0.12)
              "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)]",
              isPreviewMode ? "w-full h-full max-w-none" :
                viewMode === 'mobile' ? "w-[375px]" :
                  viewMode === 'tablet' ? "w-[768px]" :
                    "w-full max-w-[1200px]" // Desktop
            )}
            id="canvas-area"
          >
            <Renderer node={pageData} />
          </div>
        </div>

        {/* AI Bar & Trash */}
        {!isPreviewMode && (
          <>
            <AICommandBar />
            <TrashZone />
          </>
        )}

        {/* Floating Controls for Preview Mode */}
        {isPreviewMode && (
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-surface shadow-lg border border-border rounded-full text-sm font-medium text-text hover:bg-surface-highlight transition-colors"
            >
              Salir de Vista Previa
            </button>
          </div>
        )}
      </MainLayout>

      {/* Overlays */}
      {isTutorialActive && <TutorialOverlay />}
      {showPublishModal && <PublishModal onClose={() => setShowPublishModal(false)} />}
      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
    </>
  );
}

export default App;
