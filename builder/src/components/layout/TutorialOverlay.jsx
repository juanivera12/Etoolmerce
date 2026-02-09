import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export const TutorialOverlay = () => {
    const { isTutorialActive, toggleTutorial } = useEditorStore();
    const [step, setStep] = useState(0);

    if (!isTutorialActive) return null;

    const steps = [
        {
            title: "Bienvenido al Constructor",
            content: "Aquí tienes todas las herramientas para construir tu sitio. Este tutorial explica detalladamente cada sección del editor.",
            target: null
        },
        {
            title: "1. Panel Izquierdo: Categorías",
            content: "A la izquierda encontrarás tus bloques organizados en 4 categorías: Navegación, Básicos, Tienda y Marketing. Haz clic en cada categoría para desplegarla.",
            target: "sidebar-panel"
        },
        {
            title: "2. Componentes Básicos y Navegación",
            content: "Usa 'Header' y 'Footer' para la estructura. Agrega contenido con 'Texto', 'Imagen', 'Video' y 'Botones'. Son los bloques fundamentales de tu página.",
            target: "sidebar-panel"
        },
        {
            title: "3. Herramientas de Tienda",
            content: "Construye tu e-commerce con 'Grid Productos' (catálogo), 'Carrito' (widget de compras) y 'Checkout' (botón de pago). Todo integrado para vender.",
            target: "sidebar-panel"
        },
        {
            title: "4. Marketing y Promoción",
            content: "Destaca contenido con 'Carrusel', 'Galería 3D', 'Oferta Flash' y 'Testimonios'. Ideales para captar la atención de tus clientes.",
            target: "sidebar-panel"
        },
        {
            title: "5. El Lienzo (Canvas)",
            content: "Arrastra cualquier componente desde la izquierda y suéltalo aquí. Haz clic sobre cualquier elemento en el lienzo para seleccionarlo y editarlo.",
            target: null
        },
        {
            title: "6. Panel Derecho: Propiedades",
            content: "Aquí personalizas el elemento seleccionado. 'Estilos' para colores y tamaños. 'Efectos' para sombras y bordes. 'Props' para configuraciones específicas.",
            target: null
        },
        {
            title: "7. Configuración de Anclajes (IDs)",
            content: "Para crear secciones navegables, ve a la pestaña 'Props' o 'Avanzado' y asigna un 'ID de Bloque' único (ej: 'contacto') al componente que desees.",
            target: null
        },
        {
            title: "8. Creación de Enlaces Internos",
            content: "Para que un botón lleve a esa sección, selecciona el botón, ve a 'Interacción', elige 'Scroll a Sección' y selecciona el ID que acabas de crear.",
            target: null
        },
        {
            title: "9. Gestión de Elementos",
            content: "Si necesitas borrar algo, simplemente arrástralo al icono de la papelera en la esquina inferior derecha.",
            target: null
        }
    ];

    const currentStep = steps[step];

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else toggleTutorial();
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={toggleTutorial}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full">
                        Paso {step + 1} de {steps.length}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">{currentStep.title}</h2>
                    <p className="text-slate-600 leading-relaxed">
                        {currentStep.content}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                    <button
                        onClick={prevStep}
                        disabled={step === 0}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${step === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <ChevronLeft size={16} />
                        Anterior
                    </button>
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        {step === steps.length - 1 ? '¡Empezar!' : 'Siguiente'}
                        {step < steps.length - 1 && <ChevronRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
