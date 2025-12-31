import React, { useState } from 'react';
import { useEditorStore } from './store/useEditorStore';
import { Renderer } from './components/Renderer';
import { Layout, Type, Image, Square, ShoppingCart, Eye, Save, PlayCircle, X, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { PropertiesPanel } from './components/PropertiesPanel';
import { generateHTML, generateReact } from './utils/codeGenerator';

function App() {
  const { pageData, isPreviewMode, togglePreview, isTutorialActive, toggleTutorial } = useEditorStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [exportTab, setExportTab] = useState('html'); // 'html' or 'react'

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const getExportCode = () => {
    if (exportTab === 'html') return generateHTML(pageData);
    if (exportTab === 'react') return generateReact(pageData);
    return '';
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-slate-900 relative">
      {/* Tutorial Overlay */}
      {isTutorialActive && <TutorialOverlay onClose={toggleTutorial} />}

      {/* Sidebar */}
      {!isPreviewMode && (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20 transition-all" id="sidebar-panel">
          <div className="p-5 border-b border-slate-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              E-ToolMerce
            </h1>
            <p className="text-xs text-slate-400 mt-1">Edición E-commerce</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Componentes</h3>
              <div className="grid grid-cols-2 gap-3">
                <DraggableItem type="section" icon={<Layout />} label="Sección" />
                <DraggableItem type="text" icon={<Type />} label="Texto" />
                <DraggableItem type="image" icon={<Image />} label="Imagen" />
                <DraggableItem type="video" icon={<PlayCircle />} label="Video" />
                <DraggableItem type="container" icon={<Square />} label="Contenedor" />
                <DraggableItem type="hero" icon={<Layout />} label="Héroe" />
                <DraggableItem type="card" icon={<Square />} label="Tarjeta" />
                <DraggableItem type="product" icon={<ShoppingCart />} label="Producto" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={toggleTutorial}
                className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center gap-2 transition-colors"
                id="tutorial-btn"
              >
                <PlayCircle size={16} />
                Ver Tutorial
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Canvas Area */}
      <main className="flex-1 relative overflow-hidden bg-slate-50/50 flex flex-col">
        {/* Toolbar */}
        {!isPreviewMode && (
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10" id="top-toolbar">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-500">Página: Inicio</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePreview}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-2"
                id="preview-btn"
              >
                <Eye size={16} />
                Vista Previa
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors flex items-center gap-2"
                id="publish-btn"
              >
                <Save size={16} />
                Publicar
              </button>
            </div>
          </header>
        )}

        {/* Preview Mode Exit Button */}
        {isPreviewMode && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-white shadow-lg rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <X size={16} />
              Salir de Vista Previa
            </button>
          </div>
        )}

        {/* Canvas Scroll Area */}
        <div className={clsx("flex-1 overflow-y-auto p-8 flex justify-center", !isPreviewMode && "pb-32")}>
          <div
            className={clsx(
              "bg-white shadow-2xl shadow-slate-200/50 rounded-sm min-h-[800px] transition-all duration-300",
              isPreviewMode ? "w-full h-full max-w-none" : "w-full max-w-[1024px]"
            )}
            id="canvas-area"
          >
            <Renderer node={pageData} />
          </div>
        </div>

        {/* AI Command Bar */}
        {!isPreviewMode && (
          <>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-30" id="ai-bar">
              {/* ... (AI Bar Content) ... */}
              <div className="bg-white/90 backdrop-blur-md border border-indigo-100 shadow-2xl rounded-2xl p-2 flex items-center gap-2 ring-1 ring-indigo-50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Pídele a la IA: 'Añade un héroe oscuro', 'Haz el texto más grande'..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 h-10 px-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const cmd = e.currentTarget.value.toLowerCase();
                      const store = useEditorStore.getState();

                      // 1. Structure Commands (Add Sections)
                      if (cmd.includes('añade') || cmd.includes('agrega')) {
                        if (cmd.includes('héroe') || cmd.includes('hero')) {
                          // Create a Hero Section
                          store.addElement('root', 'section');
                          // We need to find the last added element to style it, but for now we just add a generic section
                          // In a real app, we would return the ID from addElement
                        }
                      }

                      // 2. Style Commands (Global or Selected)
                      else if (cmd.includes('fondo') && cmd.includes('azul')) {
                        store.updateStyles('root', { backgroundColor: '#eff6ff' });
                      } else if (cmd.includes('modo oscuro') || cmd.includes('negro')) {
                        store.updateStyles('root', { backgroundColor: '#1e293b', color: '#fff' });
                      } else if (cmd.includes('texto') && (cmd.includes('grande') || cmd.includes('aumenta'))) {
                        // If an element is selected, update it. If not, update root font size?
                        if (store.selectedId) {
                          store.updateStyles(store.selectedId, { fontSize: '24px' });
                        }
                      } else if (cmd.includes('centra') || cmd.includes('centro')) {
                        if (store.selectedId) {
                          store.updateStyles(store.selectedId, {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                          });
                        }
                      }

                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Trash Zone */}
            <div
              className="absolute bottom-6 right-6 w-16 h-16 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-100 hover:border-red-400 hover:text-red-600 hover:scale-110 transition-all shadow-lg z-30 cursor-pointer"
              id="trash-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('application/react-builder-id');
                if (id) {
                  useEditorStore.getState().removeElement(id);
                }
              }}
              title="Arrastra aquí para eliminar"
            >
              <Trash2 size={24} />
            </div>
          </>
        )}
      </main>

      {/* Properties Panel (Right) */}
      {!isPreviewMode && (
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm z-20" id="properties-panel">
          <PropertiesPanel />
        </aside>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Exportar Código</h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setExportTab('html')}
                  className={clsx("px-3 py-1 text-sm rounded-md transition-all", exportTab === 'html' ? "bg-white shadow text-indigo-600 font-medium" : "text-slate-500 hover:text-slate-700")}
                >
                  HTML
                </button>
                <button
                  onClick={() => setExportTab('react')}
                  className={clsx("px-3 py-1 text-sm rounded-md transition-all", exportTab === 'react' ? "bg-white shadow text-indigo-600 font-medium" : "text-slate-500 hover:text-slate-700")}
                >
                  React (JSX)
                </button>
              </div>
            </div>

            <p className="text-slate-600 mb-4 text-sm">
              Copia y pega este código en tu proyecto.
            </p>

            <div className="bg-slate-900 p-4 rounded-lg mb-6 font-mono text-xs text-slate-300 overflow-auto flex-1 border border-slate-700">
              <pre>{getExportCode()}</pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(getExportCode())}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
              >
                Copiar al Portapapeles
              </button>
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DraggableItem = ({ type, icon, label }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/react-builder-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center justify-center p-4 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md group"
    >
      <div className="text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-xs text-slate-600 font-medium group-hover:text-indigo-700">{label}</span>
    </div>
  );
};

const TutorialOverlay = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />

      {/* Step 1: Sidebar */}
      <div className="absolute top-20 left-72 ml-4 bg-white p-4 rounded-xl shadow-xl max-w-xs animate-bounce-slow pointer-events-auto">
        <div className="absolute top-4 -left-2 w-4 h-4 bg-white transform rotate-45"></div>
        <h3 className="font-bold text-indigo-600 mb-1">1. Componentes</h3>
        <p className="text-sm text-slate-600">Arrastra estos elementos al lienzo para construir tu página.</p>
      </div>

      {/* Step 2: AI Bar */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-auto">
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
        <h3 className="font-bold text-indigo-600 mb-1">2. Asistente IA</h3>
        <p className="text-sm text-slate-600">Escribe comandos como "Fondo azul" para diseñar rápido.</p>
      </div>

      {/* Step 3: Preview/Publish */}
      <div className="absolute top-16 right-40 bg-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-auto">
        <div className="absolute -top-2 right-8 w-4 h-4 bg-white transform rotate-45"></div>
        <h3 className="font-bold text-indigo-600 mb-1">3. Publicar</h3>
        <p className="text-sm text-slate-600">Visualiza tu trabajo o exporta el código final.</p>
      </div>

      <button
        onClick={onClose}
        className="absolute top-8 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-md pointer-events-auto font-medium"
      >
        Cerrar Tutorial
      </button>
    </div>
  );
};

export default App;
