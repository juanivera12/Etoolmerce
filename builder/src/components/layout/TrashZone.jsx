import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Trash2 } from 'lucide-react';

export const TrashZone = () => {
    const { removeElement } = useEditorStore();

    return (
        <div
            className="absolute bottom-6 right-6 w-32 h-16 bg-red-600 text-white rounded-full flex items-center justify-center gap-2 shadow-2xl z-30 cursor-pointer hover:bg-red-700 hover:scale-105 transition-all animate-in fade-in slide-in-from-bottom-4 border-2 border-white/20"
            id="trash-zone"
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('application/react-builder-id');
                if (id) {
                    removeElement(id);
                }
            }}
            title="Arrastra aquí para eliminar"
        >
            <Trash2 size={20} />
            <span className="font-bold text-sm">Eliminar</span>
        </div>
    );
};
