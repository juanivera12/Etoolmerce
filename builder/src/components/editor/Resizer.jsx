import React, { useEffect } from 'react';
import { useEditorStore, selectActivePageContent } from '../../store/useEditorStore';

// Now it just renders handles and manages logic attached to a targetRef
export const Resizer = ({ targetRef, id, isSelected }) => {
    const pageData = useEditorStore(selectActivePageContent);
    const { updateStyles } = useEditorStore();

    // Helper to find node styles to check for absolute positioning
    const findNode = (node, targetId) => {
        if (!node) return null;
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
    if (node?.type === 'background') return null;

    // Logic: Free resizing (all directions) is only truly standard for absolute/fixed. 
    // For static/relative (flow), width/height work, but top/left might not apply unless relative.
    // However, users expect resizing to "work". We will modify width/height.
    // Negative margins or transforms could be used for left/top in flow, but that gets messy.
    // We will restrict top/left resizing to absolute/fixed/relative elements for now to avoid breaking flow layout logic too much.
    const isPositioned = ['absolute', 'fixed', 'relative'].includes(node?.styles?.position);

    if (!isSelected || !targetRef.current) return null;

    const handleMouseDown = (e, direction) => {
        // 1. Stop Propagation: Prevent drag events from parent
        e.stopPropagation();
        // 2. Prevent Default: Prevent text selection and browser drag
        e.preventDefault();

        const element = targetRef.current;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = element.offsetWidth;
        const isStatic = !['absolute', 'fixed', 'relative'].includes(element.style.position);

        // Pinning Calculation:
        // Calculate the current visual offset relative to parent content box
        // We use this to "freeze" the element's position by converting visual position to explicit margins,
        // effectively disabling flex-centering behavior during resize.
        let pinnedMarginLeft = '';
        let pinnedMarginTop = '';

        if (isStatic && element.parentElement) {
            const parent = element.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const elemRect = element.getBoundingClientRect();
            const parentStyle = getComputedStyle(parent);

            const pLeft = parseFloat(parentStyle.paddingLeft) || 0;
            const pTop = parseFloat(parentStyle.paddingTop) || 0;

            // Current visual offsets
            const visualLeft = elemRect.left - parentRect.left - pLeft;
            const visualTop = elemRect.top - parentRect.top - pTop;

            pinnedMarginLeft = `${visualLeft}px`;
            pinnedMarginTop = `${visualTop}px`;
        }

        let animationFrameId;

        const onMouseMove = (moveEvent) => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;

                let newStyles = {};

                // If resizing Right/Bottom of a static element, we must Enforce Pinning
                // so it doesn't re-center or shift.
                if (isStatic && pinnedMarginLeft) {
                    // Only applying pinning if we are NOT adjusting that specific side 
                    // (e.g. if adjusting Left, we change marginLeft dynamically, so we don't pin static loop)

                    // Base Pinning (Lock to Top-Left)
                    if (!direction.includes('left')) {
                        newStyles.marginLeft = pinnedMarginLeft;
                        newStyles.marginRight = 'auto'; // Break justify-content: center
                        newStyles.alignSelf = 'flex-start'; // Break align-items: center (if flex-col)
                    }
                    if (!direction.includes('top')) {
                        newStyles.marginTop = pinnedMarginTop;
                        newStyles.marginBottom = 'auto'; // Break vertical center
                    }
                }

                // Width changes
                if (direction.includes('right')) {
                    newStyles.width = `${startWidth + deltaX}px`;
                } else if (direction.includes('left')) {
                    newStyles.width = `${startWidth - deltaX}px`;
                    if (isPositioned) {
                        newStyles.left = `${startLeft + deltaX}px`;
                    } else {
                        // Dynamic Margin for Left Resize
                        const startMag = parseFloat(pinnedMarginLeft) || 0;
                        newStyles.marginLeft = `${startMag + deltaX}px`;
                        // Also ensure right is released to allow flow
                        newStyles.marginRight = 'auto';
                        newStyles.alignSelf = 'flex-start';
                    }
                }

                // Height changes
                if (direction.includes('bottom')) {
                    newStyles.height = `${startHeight + deltaY}px`;
                } else if (direction.includes('top')) {
                    newStyles.height = `${startHeight - deltaY}px`;
                    if (isPositioned) {
                        newStyles.top = `${startTop + deltaY}px`;
                    } else {
                        // Dynamic Margin for Top Resize
                        const startMag = parseFloat(pinnedMarginTop) || 0;
                        newStyles.marginTop = `${startMag + deltaY}px`;
                        newStyles.marginBottom = 'auto';
                    }
                }

                updateStyles(id, newStyles);
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    // Common handle style
    const handleStyle = "absolute w-2.5 h-2.5 bg-white border border-indigo-500 rounded-full z-50 shadow-sm pointer-events-auto hover:scale-125 transition-transform";

    return (
        <div className="absolute inset-0 pointer-events-none border-2 border-indigo-500 z-50">
            {/* CORNERS */}
            <div
                className={`${handleStyle} cursor-nw-resize -top-1.5 -left-1.5`}
                onMouseDown={(e) => handleMouseDown(e, 'top-left')}
                title="Resize Top-Left"
            />
            <div
                className={`${handleStyle} cursor-ne-resize -top-1.5 -right-1.5`}
                onMouseDown={(e) => handleMouseDown(e, 'top-right')}
                title="Resize Top-Right"
            />
            <div
                className={`${handleStyle} cursor-sw-resize -bottom-1.5 -left-1.5`}
                onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
                title="Resize Bottom-Left"
            />
            <div
                className={`${handleStyle} cursor-se-resize -bottom-1.5 -right-1.5`}
                onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
                title="Resize Bottom-Right"
            />

            {/* EDGES (Midpoints) */}
            <div
                className={`${handleStyle} cursor-n-resize -top-1.5 left-1/2 -translate-x-1/2`}
                onMouseDown={(e) => handleMouseDown(e, 'top')}
            />
            <div
                className={`${handleStyle} cursor-s-resize -bottom-1.5 left-1/2 -translate-x-1/2`}
                onMouseDown={(e) => handleMouseDown(e, 'bottom')}
            />
            <div
                className={`${handleStyle} cursor-w-resize top-1/2 -left-1.5 -translate-y-1/2`}
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
            <div
                className={`${handleStyle} cursor-e-resize top-1/2 -right-1.5 -translate-y-1/2`}
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
        </div>
    );
};
