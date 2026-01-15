import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export const TutorialOverlay = () => {
    const { isTutorialActive, toggleTutorial } = useEditorStore();
    const [step, setStep] = useState(0);

    if (!isTutorialActive) return null;

    const steps = [
        {
            title: "¡Bienvenido al Constructor!",
            content: "Aquí puedes crear tu tienda online profesional en minutos. Vamos a dar un paseo rápido.",
            target: null // Center
        },
        {
            title: "1. Tus Herramientas",
            content: "En la barra lateral izquierda tienes todo lo que necesitas: Texto, Imágenes, Videos, y ahora nuevos componentes como 'Héroe' y 'Tarjetas'. ¡Solo arrástralos!",
            target: "sidebar" // ID we need to add to sidebar
        },
        {
            title: "2. El Lienzo (Canvas)",
            content: "Este es tu espacio de trabajo. Arrastra los elementos aquí. Puedes moverlos libremente si activas el modo 'Libre' en las propiedades.",
            target: "canvas"
        },
        {
            title: "3. Edición Visual",
            content: "Haz clic en cualquier elemento para editarlo. Verás puntos en las esquinas para cambiar el tamaño (¡nuevo!) y un panel a la derecha para colores y estilos.",
            target: "properties"
        },
        {
            title: "4. Inteligencia Artificial",
            content: "Usa la barra inferior para pedirle cosas a la IA: 'Añade un héroe oscuro', 'Centra esto', 'Haz el texto gigante'.",
            target: "ai-bar"
        },
        {
            title: "5. Eliminar Elementos",
            content: "¿No te gusta algo? Arrástralo al icono de la papelera roja en la esquina inferior derecha para eliminarlo al instante.",
            target: "trash-zone"
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
