import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import clsx from 'clsx';
import { Resizer } from './Resizer';

const ElementWrapper = ({ node, children }) => {
    const { selectedId, selectElement, addElement } = useEditorStore();
    const isSelected = selectedId === node.id;

    const handleClick = (e) => {
        e.stopPropagation();
        selectElement(node.id);
    };

    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('application/react-builder-id', node.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Handle File Drop (Desktop)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    useEditorStore.getState().addImageElement(node.id, event.target.result);
                };
                reader.readAsDataURL(file);
            }
            return;
        }

        const type = e.dataTransfer.getData('application/react-builder-type');
        if (type) {
            addElement(node.id, type);
        }
    };

    // Only specific types can accept drops
    const canAcceptDrop = ['section', 'container', 'page'].includes(node.type);

    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            onClick={handleClick}
            onDragOver={canAcceptDrop ? handleDragOver : undefined}
            onDrop={canAcceptDrop ? handleDrop : undefined}
            className={clsx(
                "relative transition-all duration-200 cursor-pointer",
                isSelected ? "ring-2 ring-indigo-500 ring-offset-2 z-10" : "hover:ring-1 hover:ring-indigo-300 hover:z-10",
                canAcceptDrop && "hover:bg-slate-50/50" // Visual hint for drop zones
            )}
            style={{ ...node.styles }}
        >
            <Resizer id={node.id} isSelected={isSelected}>
                {children}
            </Resizer>

            {isSelected && (
                <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-t shadow-sm flex items-center gap-2 z-20">
                    <span className="capitalize">{node.type}</span>
                </div>
            )}
        </div>
    );
};

export const Renderer = ({ node }) => {
    if (!node) return null;

    // We need to access store for the root page drop handler
    const { addElement } = useEditorStore();

    const renderChildren = () => {
        return node.children?.map((child) => (
            <Renderer key={child.id} node={child} />
        ));
    };

    if (node.type === 'page') {
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Handle File Drop (Desktop)
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        useEditorStore.getState().addImageElement(node.id, event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
                return;
            }

            const type = e.dataTransfer.getData('application/react-builder-type');
            if (type) {
                addElement(node.id, type);
            }
        };

        return (
            <div
                style={node.styles}
                className="min-h-screen w-full bg-white shadow-sm"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {renderChildren()}
            </div>
        );
    }

    if (node.type === 'text') {
        return (
            <ElementWrapper node={node}>
                {node.content}
            </ElementWrapper>
        );
    }

    if (node.type === 'image') {
        return (
            <ElementWrapper node={node}>
                <img src={node.content} alt="Element" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            </ElementWrapper>
        )
    }

    if (node.type === 'video') {
        return (
            <ElementWrapper node={node}>
                <video
                    src={node.content}
                    controls={node.styles.controls !== false}
                    autoPlay={node.styles.autoPlay}
                    loop={node.styles.loop}
                    muted={node.styles.muted}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                />
            </ElementWrapper>
        )
    }

    // Containers
    return (
        <ElementWrapper node={node}>
            {renderChildren()}
        </ElementWrapper>
    );
};
