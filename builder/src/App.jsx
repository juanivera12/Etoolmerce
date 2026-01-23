
import React, { useState } from 'react';
import { useEditorStore, selectActivePageContent } from './store/useEditorStore';
import { MainLayout } from './components/layout/MainLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Toolbar } from './components/layout/Toolbar';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { GlobalSettingsPanel } from './components/layout/GlobalSettingsPanel';
import { Renderer } from './components/editor/Renderer';
import { TutorialOverlay } from './components/layout/TutorialOverlay';
import { PublishModal } from './components/layout/PublishModal';
import { ImportModal } from './components/layout/ImportModal';
import { TrashZone } from './components/layout/TrashZone';
import { CartProvider } from './context/CartContext';
import clsx from 'clsx';
// import './App.css'; // Removed to avoid conflicts

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const pageData = useEditorStore(selectActivePageContent);
  const { isPreviewMode, viewMode, isTutorialActive, togglePreview, toggleTutorial } = useEditorStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);

  // Hook for Global Shortcuts
  // For 'saveProject', we can open the Publish Modal as a proxy for "Saving/Exporting".
  // Or simply console log as per previous logic if no direct save exists yet.
  useKeyboardShortcuts(() => {
    console.log("Saving project...");
    setShowPublishModal(true); // Let's open the export modal for safety/utility
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
            onImport={() => setShowImportModal(true)}
            onToggleGlobalSettings={() => setShowGlobalSettings(!showGlobalSettings)}
          />
        }
      >
        {/* Canvas Area */}
        <div className={clsx("min-h-full flex justify-center p-8", !isPreviewMode && "pb-32")}>
          <div
            className={clsx(
              "bg-background rounded-sm min-h-[800px] transition-all duration-300 origin-top ease-in-out relative overflow-hidden",
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
    </CartProvider>
  );
}

export default App;
