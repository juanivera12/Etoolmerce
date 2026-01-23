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
        e.stopPropagation();
        e.preventDefault();

        const element = targetRef.current;
        const parent = element.offsetParent || document.body; // Canvas Container
        const parentRect = parent.getBoundingClientRect();

        const startX = e.clientX;
        const startY = e.clientY;

        // Capture initial dimensions and position
        const startWidth = element.offsetWidth;
        const startHeight = element.offsetHeight;
        const startLeft = parseFloat(element.style.left) || element.offsetLeft;
        const startTop = parseFloat(element.style.top) || element.offsetTop;

        const isStatic = !['absolute', 'fixed', 'relative'].includes(element.style.position);

        // Helper: Get Mouse Relative to Canvas (User Formula)
        const getRelativeMouse = (e) => {
            // Formula: (Mouse_Page - Canvas_Offset) + Canvas_Scroll
            // Note: clientX is viewport. parentRect.left is viewport. 
            // parent.scrollLeft adds the scroll.
            return {
                x: (e.clientX - parentRect.left) + parent.scrollLeft,
                y: (e.clientY - parentRect.top) + parent.scrollTop
            };
        };

        const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

        let animationFrameId;

        const onMouseMove = (moveEvent) => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const currentMouse = getRelativeMouse(moveEvent);
                const startMouseRelative = getRelativeMouse({ clientX: startX, clientY: startY }); // calculated once ideally, but here diff is fine

                // Deltas based on viewport (standard) or relative? 
                // User Formula for Resize N:
                // NewHeight = OldHeight + (OldMouseY - NewMouseY)
                // NewTop = NewMouseY - Canvas_Offset_Y (Relative Mouse Y)

                // Let's use raw viewport deltas for size logic if consistent, but User asked for specific formula.
                // We will use the RELATIVE mouse for Position settings as requested.

                const deltaX = moveEvent.clientX - startX; // standard delta for size
                const deltaY = moveEvent.clientY - startY;

                let newStyles = {};

                // --- RESIZE NORTH (Top) ---
                if (direction.includes('top')) {
                    // User Formula: NewHeight = Height_Viejo + (Mouse_Y_Viejo - Mouse_Y_Nuevo)
                    // (startY - moveEvent.clientY)
                    const newHeight = Math.max(0, startHeight + (startY - moveEvent.clientY));
                    newStyles.height = `${newHeight}px`;

                    if (isPositioned) {
                        // User Formula: NewTop = Mouse_Y_Nuevo - Canvas_Offset_Y
                        // This is essentially currentMouse.y
                        // Constraint: Prevent negative (clamp). 
                        // Also prevent "falling" (top moving down without height checking? No, height handles bottom anchor).
                        // Actually, if we just set top = mouse, and height = old + difference, checking math:
                        // Top moves with mouse. Bottom = Top + Height.
                        // MouseY + (H + StartY - MouseY) = H + StartY. Bottom is constant. Correct.

                        const newTop = clamp(currentMouse.y, 0, parent.scrollHeight);
                        newStyles.top = `${newTop}px`;
                    } else {
                        // Static logic (margin) - kept simple or same logic applied to marginTop
                        newStyles.marginTop = `${startTop + deltaY}px`; // fallback
                    }
                }
                // --- RESIZE SOUTH (Bottom) ---
                else if (direction.includes('bottom')) {
                    newStyles.height = `${Math.max(0, startHeight + deltaY)}px`;
                }

                // --- RESIZE WEST (Left) ---
                if (direction.includes('left')) {
                    // User Formula: NewWidth = Width_Viejo + (Mouse_X_Viejo - Mouse_X_Nuevo)
                    const newWidth = Math.max(0, startWidth + (startX - moveEvent.clientX));
                    newStyles.width = `${newWidth}px`;

                    if (isPositioned) {
                        // User Formula: NewLeft = Mouse_X_Nuevo - Canvas_Offset_X
                        const newLeft = clamp(currentMouse.x, 0, parent.scrollWidth);
                        newStyles.left = `${newLeft}px`;
                    } else {
                        newStyles.marginLeft = `${parseFloat(element.style.marginLeft || 0) + deltaX}px`;
                    }
                }
                // --- RESIZE EAST (Right) ---
                else if (direction.includes('right')) {
                    newStyles.width = `${Math.max(0, startWidth + deltaX)}px`;
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
