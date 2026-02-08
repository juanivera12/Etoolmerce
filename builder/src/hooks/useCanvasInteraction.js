import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const useCanvasInteraction = (canvasRef) => {
    const { activeTool, setTool, pages, activePageId } = useEditorStore();
    const [isPanning, setIsPanning] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionRect, setSelectionRect] = useState(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // Helper to get scroll container
    const getScrollContainer = () => document.getElementById('main-scroll-container') || canvasRef.current;

    // Global Keyboard Shortcuts for Tools
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if input/textarea is focused or modals are open
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (document.querySelector('.modal-overlay')) return; // Rudimentary check

            if (e.key.toLowerCase() === 'v') setTool('select');
            if (e.key.toLowerCase() === 's') setTool('multiselect');
            if ((e.key.toLowerCase() === 'h' || e.code === 'Space') && !e.repeat) {
                setTool('hand');
            }
        };

        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                // Optional: revert logic could go here
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setTool]);


    // Mouse Handlers
    const onMouseDown = useCallback((e) => {
        if (!canvasRef.current) return;
        const scrollContainer = getScrollContainer();

        if (activeTool === 'hand') {
            setIsPanning(true);
            setStartPos({
                x: e.clientX,
                y: e.clientY,
                scrollLeft: scrollContainer.scrollLeft,
                scrollTop: scrollContainer.scrollTop
            });
            e.preventDefault();
        } else if (activeTool === 'multiselect') {
            setIsSelecting(true);
            const rect = canvasRef.current.getBoundingClientRect();
            // Store raw client coordinates for easier delta calculation relative to scroll
            setStartPos({
                x: e.clientX,
                y: e.clientY,
                canvasLeft: rect.left,
                canvasTop: rect.top,
                scrollLeft: scrollContainer.scrollLeft,
                scrollTop: scrollContainer.scrollTop
            });
            setSelectionRect({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                width: 0,
                height: 0
            });
            e.preventDefault();
        }
    }, [activeTool, canvasRef]);

    const onMouseMove = useCallback((e) => {
        if (!canvasRef.current) return;
        const scrollContainer = getScrollContainer();

        if (isPanning && activeTool === 'hand') {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            scrollContainer.scrollLeft = startPos.scrollLeft - dx;
            scrollContainer.scrollTop = startPos.scrollTop - dy;
        } else if (isSelecting && activeTool === 'multiselect') {
            const rect = canvasRef.current.getBoundingClientRect();

            // Calculate relative to the canvas container
            const startX = startPos.x - rect.left;
            const startY = startPos.y - rect.top;
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            const x = Math.min(currentX, startX);
            const y = Math.min(currentY, startY);

            setSelectionRect({ x, y, width, height });
        }
    }, [isPanning, isSelecting, activeTool, startPos, canvasRef]);

    const onMouseUp = useCallback((e) => {
        if (isPanning) {
            setIsPanning(false);
        } else if (isSelecting) {
            setIsSelecting(false);

            // Intersection Logic
            if (selectionRect && canvasRef.current) {
                const canvasRect = canvasRef.current.getBoundingClientRect();
                const selectLeft = canvasRect.left + selectionRect.x;
                const selectTop = canvasRect.top + selectionRect.y;
                const selectRight = selectLeft + selectionRect.width;
                const selectBottom = selectTop + selectionRect.height;

                const elements = document.querySelectorAll('[data-node-id]');
                const selectedIds = [];

                elements.forEach(el => {
                    const elRect = el.getBoundingClientRect();

                    // Check intersection
                    if (
                        elRect.left < selectRight &&
                        elRect.right > selectLeft &&
                        elRect.top < selectBottom &&
                        elRect.bottom > selectTop
                    ) {
                        selectedIds.push(el.getAttribute('data-node-id'));
                    }
                });

                console.log("Selected IDs:", selectedIds);
                // Future: useEditorStore.getState().setSelectedIds(selectedIds);
                if (selectedIds.length > 0) {
                    // Select the first one for now to show visual feedback
                    useEditorStore.getState().selectElement(selectedIds[0]);
                }
            }

            setSelectionRect(null);
        }
    }, [isPanning, isSelecting, selectionRect]);

    // Cursor Logic
    const cursor = isPanning ? 'grabbing' :
        activeTool === 'hand' ? 'grab' :
            activeTool === 'multiselect' ? 'crosshair' : 'default';

    return {
        handlers: {
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseLeave: onMouseUp
        },
        selectionRect,
        cursorStyle: { cursor }
    };
};
