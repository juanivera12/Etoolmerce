import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const Resizer = ({ children, id, isSelected }) => {
    const { updateStyles, pageData } = useEditorStore();
    const nodeRef = useRef(null);

    // Helper to find node styles
    const findNode = (node, targetId) => {
        if (node.id === targetId) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNode(child, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    const node = findNode(pageData, id);
    const isAbsolute = node?.styles?.position === 'absolute' || node?.styles?.position === 'fixed';

    if (!isSelected) return children;

    const handleMouseDown = (e, direction) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = nodeRef.current.offsetWidth;
        const startHeight = nodeRef.current.offsetHeight;
        const startLeft = nodeRef.current.offsetLeft;
        const startTop = nodeRef.current.offsetTop;

        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            let newStyles = {};

            if (direction.includes('right')) {
                newStyles.width = `${startWidth + deltaX}px`;
            }
            if (direction.includes('bottom')) {
                newStyles.height = `${startHeight + deltaY}px`;
            }
            if (direction.includes('left') && isAbsolute) {
                newStyles.width = `${startWidth - deltaX}px`;
                newStyles.left = `${startLeft + deltaX}px`;
            }
            if (direction.includes('top') && isAbsolute) {
                newStyles.height = `${startHeight - deltaY}px`;
                newStyles.top = `${startTop + deltaY}px`;
            }

            updateStyles(id, newStyles);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="relative group" ref={nodeRef} style={{ width: 'fit-content', height: 'fit-content', display: 'inline-block' }}>
            {children}

            {/* Resizer Handles (Only show if selected) */}
            <div className="absolute inset-0 pointer-events-none border-2 border-indigo-500 z-50">
                {/* Corners */}
                <div
                    className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-se-resize pointer-events-auto"
                    onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
                />

                {/* Edges (Only for absolute/fixed or specific cases) */}
                <div
                    className="absolute top-1/2 -right-1.5 w-1.5 h-6 -translate-y-1/2 bg-white border border-indigo-500 rounded-full cursor-e-resize pointer-events-auto"
                    onMouseDown={(e) => handleMouseDown(e, 'right')}
                />
                <div
                    className="absolute -bottom-1.5 left-1/2 w-6 h-1.5 -translate-x-1/2 bg-white border border-indigo-500 rounded-full cursor-s-resize pointer-events-auto"
                    onMouseDown={(e) => handleMouseDown(e, 'bottom')}
                />
            </div>
        </div>
    );
};
