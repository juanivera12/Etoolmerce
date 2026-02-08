import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { InfoLabel } from '../ui/InfoLabel';

export const SchemaRenderer = ({ schema, nodeId }) => {
    const { updateProperty, pages, activePageId } = useEditorStore();

    // Helper to get nested value
    const getValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Helper to set nested value deeply
    const updateValue = (path, value) => {
        // We assume we are updating the node via updateProperty
        // But updateProperty(id, key, value) updates a TOP LEVEL key of the node usually (like 'data', 'styles', 'content').
        // If path is 'data.autoplayEnabled', we need to update 'data'.
        // So we need to fetch current 'data', merge, and call updateProperty('data', newData).

        const parts = path.split('.');
        if (parts[0] === 'data') {
            const state = useEditorStore.getState();
            const pageId = activePageId;
            const page = state.pages.find(p => p.id === pageId);

            // We need to find the node accurately.
            // But SchemaRenderer is passed 'nodeId'.
            // Accessing current node data is tricky without passing the full node object or having a store selector.
            // We'll rely on the parent strictly or fetch from store.

            const findNode = (n) => {
                if (n.id === nodeId) return n;
                if (n.children) {
                    for (const child of n.children) {
                        const res = findNode(child);
                        if (res) return res;
                    }
                }
                return null;
            };

            const node = findNode(page.content);
            if (!node) return;

            const currentData = node.data || {};
            const key = parts[1]; // autoplayEnabled

            updateProperty(nodeId, 'data', {
                ...currentData,
                [key]: value
            });
        }
    };

    // We need 'currentData' for rendering properly. 
    // We'll trust the parent passes 'data' prop to avoid complex store lookups here if possible.
    // BUT, for 'repeater' add/remove, we need logic.
};

// ... Wait, I should make this simpler.
// I will rewrite this to accept `data` (the node.data object) and `onUpdate` callback.

export const SchemaForm = ({ schema, data = {}, onUpdate }) => {

    const renderField = (field) => {
        const value = field.key.includes('.') ? data[field.key.split('.')[1]] : data[field.key];
        // Handle undefined with default
        const currentValue = value !== undefined ? value : field.defaultValue;

        if (field.condition) {
            const conditionVal = field.condition.key.includes('.') ? data[field.condition.key.split('.')[1]] : data[field.condition.key];
            if (conditionVal !== field.condition.value) return null;
        }

        switch (field.type) {
            case 'toggle':
                return (
                    <div key={field.key} className="flex items-center justify-between py-2">
                        <label className="text-xs text-text">{field.label}</label>
                        <input
                            type="checkbox"
                            checked={!!currentValue}
                            onChange={(e) => onUpdate(field.key, e.target.checked)}
                            className="toggle-checkbox"
                        />
                    </div>
                );
            case 'select':
                return (
                    <div key={field.key} className="space-y-1 py-2">
                        <label className="text-xs text-text-muted">{field.label}</label>
                        <select
                            value={currentValue}
                            onChange={(e) => onUpdate(field.key, e.target.value)}
                            className="w-full p-2 text-xs bg-surface-highlight border border-border rounded text-text outline-none"
                        >
                            {field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'slider':
                return (
                    <div key={field.key} className="space-y-1 py-2">
                        <div className="flex justify-between">
                            <label className="text-xs text-text-muted">{field.label}</label>
                            <span className="text-[10px] bg-primary/10 text-primary px-1 rounded">{currentValue}</span>
                        </div>
                        <input
                            type="range"
                            min={field.min} max={field.max} step={field.step}
                            value={currentValue}
                            onChange={(e) => onUpdate(field.key, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderRepeater = (section) => {
        // section.targetProperty is "data.slides" -> we need slides array
        const items = data[section.targetProperty.split('.')[1]] || [];

        const handleAdd = () => {
            const newItem = { id: `item-${Date.now()}`, src: 'https://placehold.co/600x400' };
            onUpdate(section.targetProperty, [...items, newItem]);
        };

        const handleRemove = (index) => {
            const newItems = [...items];
            newItems.splice(index, 1);
            onUpdate(section.targetProperty, newItems);
        };

        const handleItemChange = (index, key, val) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [key]: val };
            onUpdate(section.targetProperty, newItems);
        };

        return (
            <div key={section.id} className="space-y-2 py-4 border-b border-border">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-text uppercase tracking-wide">{section.title}</span>
                    <button onClick={handleAdd} className="p-1 hover:bg-primary/20 text-primary rounded transition-colors"><Plus size={14} /></button>
                </div>

                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={item.id || idx} className="bg-surface-highlight border border-border rounded p-2 flex gap-2 items-start group">
                            <div className="mt-1 text-text-muted"><GripVertical size={12} /></div>
                            <div className="flex-1 space-y-2">
                                {/* Image Input with Upload */}
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 bg-black/20 rounded overflow-hidden flex-shrink-0 relative group/img">
                                        <img src={item.src} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <input
                                            type="text"
                                            value={item.src}
                                            onChange={(e) => handleItemChange(idx, 'src', e.target.value)}
                                            className="w-full bg-surface border border-border rounded text-[10px] p-1 text-text"
                                            placeholder="URL de imagen..."
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            handleItemChange(idx, 'src', ev.target.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <button className="w-full py-1 text-[10px] bg-surface-highlight border border-border border-dashed rounded text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
                                                <ImageIcon size={10} /> Subir Imagen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleRemove(idx)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-[10px] text-text-muted italic text-center py-2">No hay slides.</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="schema-form">
            {schema.sections.map(section => {
                if (section.type === 'repeater') {
                    return renderRepeater(section);
                }
                return (
                    <div key={section.id} className="py-4 border-b border-border">
                        <h4 className="text-xs font-bold text-text uppercase tracking-wide mb-3">{section.title}</h4>
                        <div className="space-y-1">
                            {section.fields?.map(renderField)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
