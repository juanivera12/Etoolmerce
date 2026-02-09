import React, { useState, useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import clsx from 'clsx';
import { Resizer } from './Resizer';
import * as LucideIcons from 'lucide-react';
import { X, Lock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ProductCard } from '../shop/ProductCard';
import { CartWidget } from '../shop/CartWidget';
import { useCart } from '../../context/CartContext';
import { CarouselBlock } from '../blocks/CarouselBlock';



// import AOS from 'aos';
// import 'aos/dist/aos.css';


import { QuickLayerToolbar } from './QuickLayerToolbar';
import { ThreeDGalleryBlock } from '../blocks/ThreeDGalleryBlock';
import { CountdownBlock } from '../blocks/CountdownBlock';
import { FlashOfferBlock } from '../blocks/FlashOfferBlock';
import TypewriterText from '../ui/TypewriterText';



// Simple Error Boundary Component
// Enhanced Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Renderer Error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', border: '1px solid red', color: 'red', backgroundColor: '#ffebeb', borderRadius: '8px', margin: '10px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Error al renderizar componente</h4>
                    {this.props.nodeType && (
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold' }}>Tipo: {this.props.nodeType}</p>
                    )}
                    <details style={{ whiteSpace: 'pre-wrap', fontSize: '11px', color: '#666' }}>
                        <summary>Detalles técnicos</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo?.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

const ElementWrapper = ({ node, children }) => {
    const { selectedId, selectElement, addElement, moveElement, updateStyles, isPreviewMode, setActivePage } = useEditorStore();
    const { addToCart } = useCart();
    const nodeRef = useRef(null);

    // Ensure node exists
    if (!node) return null;

    // Initialize AOS removed - moved to App.jsx specific for Editor or Preview?
    // Actually, usually we Init once at root. 

    // Refresh AOS when node animation changes or preview mode toggles
    // Safe Access to node properties to prevent crashes
    const styles = node.styles || {};
    const animation = node.animation || {};
    const backgroundConfig = node.backgroundConfig || {};

    // Refresh AOS when node animation changes or preview mode toggles
    React.useEffect(() => {
        if (animation.type) {
            // Debounce refresh to avoid lag?
            const timer = setTimeout(() => {
                // AOS is global, might not be needed if using Framer Motion exclusively
                // AOS.refresh();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [animation.type, isPreviewMode]);



    // Hover Animation Props (Preview Only)
    const hoverProps = isPreviewMode ? {
        whileHover: {
            scale: styles.hoverScale ? parseFloat(styles.hoverScale) : 1,
            filter: styles.hoverBrightness ? `brightness(${styles.hoverBrightness})` : 'none',
            zIndex: styles.hoverScale ? 100 : undefined
        },
        transition: { duration: 0.2 }
    } : {};


    // Framer Motion Variants for Scroll Animations
    const getAnimationVariants = (type) => {
        switch (type) {
            case 'fade-up': return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
            case 'fade-down': return { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } };
            case 'fade-left': return { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
            case 'fade-right': return { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
            case 'zoom-in': return { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };
            case 'zoom-out': return { hidden: { opacity: 0, scale: 1.2 }, visible: { opacity: 1, scale: 1 } };
            case 'flip-left': return { hidden: { opacity: 0, rotateY: -90 }, visible: { opacity: 1, rotateY: 0 } };
            case 'flip-right': return { hidden: { opacity: 0, rotateY: 90 }, visible: { opacity: 1, rotateY: 0 } };
            case 'flip-up': return { hidden: { opacity: 0, rotateX: -90 }, visible: { opacity: 1, rotateX: 0 } };
            case 'slide-up': return { hidden: { y: 100 }, visible: { y: 0 } };
            case 'slide-down': return { hidden: { y: -100 }, visible: { y: 0 } };
            // Special Effects (Continuous loops or one-offs)
            case 'pulse': return { visible: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1 } } };
            case 'bounce': return { visible: { y: [0, -20, 0], transition: { repeat: Infinity, duration: 1 } } };
            case 'shake': return { visible: { x: [0, -10, 10, -10, 10, 0], transition: { repeat: Infinity, duration: 1 } } };
            case 'heartBeat': return { visible: { scale: [1, 1.3, 1, 1.3, 1], transition: { repeat: Infinity, duration: 1.3 } } };
            // Marquee Effects
            case 'marquee-left': return {
                hidden: { x: "0%" }, // Start from 0%
                visible: {
                    x: ["0%", "-100%"],
                    transition: { repeat: Infinity, ease: "linear", duration: 10, repeatType: "loop" }
                }
            };
            case 'marquee-right': return {
                visible: {
                    x: ["-100%", "0%"],
                    transition: { repeat: Infinity, ease: "linear", duration: 10, repeatType: "loop" }
                }
            };
            default: return { hidden: {}, visible: {} };
        }
    };

    const animType = animation.type;
    const variants = animType ? getAnimationVariants(animType) : {};

    // Animation Config
    let animDuration = animation.duration ? animation.duration / 1000 : 0.5;

    // Safety check: specific legacy Marquee/Infinite fix
    // If it's an infinite animation and duration is very low (e.g. user had 15ms stored), force a reasonable default.
    const isInfinite = ['marquee-left', 'marquee-right', 'pulse', 'bounce', 'shake', 'heartBeat'].includes(animType);
    if (isInfinite && animDuration < 1) {
        animDuration = 10; // Force 10 seconds default if duration is broken
    }
    const animDelay = animation.delay ? animation.delay / 1000 : 0;

    // AOS Props replacement
    // Check if variant has its own transition (like marquee) to avoid override
    const hasOwnTransition = variants.visible && variants.visible.transition;

    const motionProps = animType ? {
        variants: variants,
        initial: "hidden",
        // For infinite animations, use 'animate' to run immediately and continuously.
        // For scroll animations, use 'whileInView'.
        [isInfinite ? 'animate' : 'whileInView']: "visible",
        viewport: isInfinite ? undefined : { once: false, amount: 0.2 },
        transition: hasOwnTransition ? {
            ...variants.visible.transition,
            duration: animDuration || variants.visible.transition.duration // Allow overriding duration
        } : {
            duration: animDuration,
            delay: animDelay,
            ease: "easeOut"
        }
    } : {};

    // Merge hover props if preview mode
    if (isPreviewMode && hoverProps.whileHover) {
        // We need to merge whileHover into motionProps or separate?
        // Framer Motion accepts multiple props.
        // But if 'pulse' uses 'visible' state, hover uses 'whileHover'. It should be fine.
        Object.assign(motionProps, hoverProps);
    }

    const isSelected = selectedId === node.id && !isPreviewMode;
    const { activeTool } = useEditorStore();
    const [dropPosition, setDropPosition] = useState(null);
    const [activeDropZone, setActiveDropZone] = useState(null);
    const [isPanning, setIsPanning] = useState(false);
    // nodeRef initialized above

    // PANNING LOGIC (Hand Tool)
    React.useEffect(() => {
        if (activeTool !== 'hand' || node.type !== 'page' || !isPanning) return;

        const handleGlobalMouseMove = (e) => {
            window.scrollBy(-e.movementX, -e.movementY);
        };

        const handleGlobalMouseUp = () => {
            setIsPanning(false);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [activeTool, node.type, isPanning]);

    const handleMouseDown = (e) => {
        if (activeTool === 'hand') {
            e.preventDefault(); // Prevent text selection
            e.stopPropagation();
            setIsPanning(true);
            return;
        }
    };

    const handleClick = (e) => {
        if (activeTool === 'hand') return; // Ignore clicks if panning

        if (isPreviewMode) {
            // Handle Interaction in Preview Mode
            if (node.interaction) {
                if (node.interaction.type === 'link' && node.interaction.targetPageId) {
                    setActivePage(node.interaction.targetPageId);
                } else if (node.interaction.type === 'text' || node.interaction.type === 'url') {
                    if (node.interaction.url) window.open(node.interaction.url, '_blank');
                } else if (node.interaction.type === 'addToCart' && node.interaction.product) {
                    addToCart(node.interaction.product);
                    // Visual feedback
                    const btn = e.currentTarget;
                    btn.style.transform = "scale(0.95)";
                    setTimeout(() => btn.style.transform = "scale(1)", 150);
                    // You might want to show a toast here if available, or just rely on the cart widget updating
                    console.log("Added to cart:", node.interaction.product);
                } else if (node.interaction.type === 'scroll' && node.interaction.targetId) {
                    const element = document.getElementById(node.interaction.targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
            return;
        }
        e.stopPropagation();
        selectElement(node.id);

        // Click-to-Upload trigger for Images
        if (node.type === 'image' && nodeRef.current) {
            const fileInput = nodeRef.current.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            }
        }
    };

    const handleDragStart = (e) => {
        if (activeTool === 'hand') {
            e.preventDefault();
            return;
        }
        if (isPreviewMode || node.type === 'background' || node.type === 'page') {
            e.preventDefault();
            return;
        }
        e.stopPropagation();

        // Start Global Drag State
        useEditorStore.getState().setIsDragging(true, node.id);

        e.dataTransfer.setData('application/react-builder-id', node.id);

        // Capture Mouse Offset for Smooth Dragging (No Snap to Top-Left)
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData('application/react-builder-offset-x', offsetX);
        e.dataTransfer.setData('application/react-builder-offset-y', offsetY);

        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        // Cleanup Global Drag State
        useEditorStore.getState().setIsDragging(false);
        setDropPosition(null);
        setActiveDropZone(null);
    };

    // Only specific types can accept drops (and only in edit mode)
    const canAcceptDrop = !isPreviewMode && ['section', 'container', 'page', 'header', 'footer', 'hero', 'card', 'newsletter', 'accordion', 'tabs', 'checkout', 'form'].includes(node.type);

    const handleDragOver = (e) => {
        e.preventDefault();

        // PANNING FIX: Return if panning
        if (activeTool === 'hand') return;

        // Only stop propagation if THIS element can accept the drop.
        if (canAcceptDrop) {
            e.stopPropagation();
        }

        if (canAcceptDrop) {
            e.dataTransfer.dropEffect = 'copy';
            return;
        }

        if (e.dataTransfer.types.includes('application/react-builder-id')) {
            e.dataTransfer.dropEffect = 'move';

            // Calculate visual indicator ONLY for explicit stacking (e.g. near top/bottom edges)
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;

            // Only show Before/After if layoutMode is NOT explicitly 'free'
            if (node.layoutMode !== 'free') {
                if (y < 15) {
                    setDropPosition('top');
                } else if (y > rect.height - 15) {
                    setDropPosition('bottom');
                } else {
                    setDropPosition(null); // Middle is Free Zone
                }
            }
        }
    };

    const handleDragLeave = () => {
        setDropPosition(null);
        setActiveDropZone(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Capture State BEFORE Clearing
        const currentDropPosition = dropPosition;
        setDropPosition(null);
        setActiveDropZone(null);

        // Create specific cleanup function or use store directly
        useEditorStore.getState().setIsDragging(false);

        if (isPreviewMode) return;

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

        const draggedId = e.dataTransfer.getData('application/react-builder-id');
        const offsetX = parseFloat(e.dataTransfer.getData('application/react-builder-offset-x') || 0);
        const offsetY = parseFloat(e.dataTransfer.getData('application/react-builder-offset-y') || 0);

        // Calculation of Relative Coordinates (Free Flow)
        const rect = e.currentTarget.getBoundingClientRect();
        const element = e.currentTarget;

        // We subtract the initial mouse offset so the element stays under the cursor at the same grab point
        const rawX = (e.clientX - rect.left) - offsetX + element.scrollLeft;
        const rawY = (e.clientY - rect.top) - offsetY + element.scrollTop;

        const x = Math.max(0, rawX);
        const y = Math.max(0, rawY);

        // HYBRID LOGIC: Stack Reorder vs Free Flow
        if (currentDropPosition && draggedId) {
            // Stack Move (Reorder) - Snap to flow
            useEditorStore.getState().updateStyles(draggedId, {
                position: 'static',
                top: 'auto',
                left: 'auto',
                transform: 'none'
            });

            if (draggedId !== node.id) {
                useEditorStore.getState().reparentElement(draggedId, node.id);
            }
            return;
        }

        // Free Flow (Default for Middle Drop)
        if (draggedId) {
            // Apply Absolute Position
            useEditorStore.getState().updateStyles(draggedId, {
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                marginTop: '0',
                marginLeft: '0',
                zIndex: node.layoutMode === 'free' ? undefined : 10
            });

            if (draggedId !== node.id) {
                useEditorStore.getState().reparentElement(draggedId, node.id);
            }
            return;
        }

        // Handle New Element Drop
        const type = e.dataTransfer.getData('application/react-builder-type');

        if (type === 'image' || type === 'video') {
            const acceptType = type === 'image' ? 'image/*' : 'video/*';
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = acceptType;
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target.result;
                        if (type === 'image') {
                            useEditorStore.getState().addImageElement(node.id, content);
                        } else {
                            useEditorStore.getState().addElement(node.id, 'video', {
                                content,
                                styles: { position: 'absolute', top: `${y}px`, left: `${x}px`, zIndex: 10 }
                            });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
            return;
        }

        if (type) {
            // New Element -> Absolute Position
            addElement(node.id, type, {
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                width: 'auto',
                height: 'auto',
                zIndex: 10
            });
        }
    };

    // We need to inject handleMouseDown into the returned JSX

    // Force re-render key for test button
    const renderKey = node.id + (animation ? JSON.stringify(animation) : '') + (isPreviewMode ? '-preview' : '-edit');
    const hasAOS = !!animation.type;

    return (
        <motion.div
            key={renderKey}
            layout={!hasAOS && node.layoutMode !== 'free'} // Disable layout animation for Free Mode to prevent fighting
            // ...
            ref={nodeRef}
            id={node.htmlId}
            data-node-id={node.id}
            draggable={!isPreviewMode && activeTool !== 'hand'} // Disable dragging if hand tool
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            onMouseDown={handleMouseDown} // Add Mouse Down for Panning
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                "relative transition-all duration-200",
                !isPreviewMode && "cursor-pointer",
                isSelected ? "ring-2 ring-indigo-500 ring-offset-2 z-10" : (!isPreviewMode && "hover:ring-1 hover:ring-indigo-300 hover:z-10"),
                canAcceptDrop && "hover:bg-slate-50/50", // Visual hint for drop zones
                isPreviewMode && node.interaction?.type !== 'none' && "cursor-pointer hover:opacity-80",
                node.layoutMode === 'free' && !isPreviewMode && "bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-20",
                // Active Zone Highlights
                node.layoutMode !== 'free' && activeDropZone === 'center' && "bg-indigo-50/30",
                node.layoutMode !== 'free' && activeDropZone === 'left' && "bg-slate-50/30",
                node.layoutMode !== 'free' && activeDropZone === 'right' && "bg-slate-50/30",

                // POINTER EVENTS FIX: Ignore children when dragging to allow free drop on canvas
                // BUT keep pointer events on the dragged item itself so drag doesn't break
                useEditorStore.getState().isDragging && useEditorStore.getState().draggedId !== node.id && "pointer-events-none",

                // HAND TOOL STYLES
                activeTool === 'hand' && "cursor-grab",
                activeTool === 'hand' && isPanning && "cursor-grabbing",
                activeTool === 'hand' && node.type !== 'page' && "pointer-events-none" // Disable interaction with items when using hand
            )}
            style={{
                ...styles,
                // Explicitly ensure transform is passed and not overridden/ignored, 
                // BUT only if it has a value, otherwise let Framer handle it.
                ...(styles.transform ? { transform: styles.transform } : {}),
                boxShadow: dropPosition ? '0 0 0 2px #6366f1' : (isSelected ? undefined : 'none')
            }}
        >


            {/* ... children ... */}
            {/* Overlay for Iframe Interaction Blocking while Editing */}
            {!isPreviewMode && (node.type === 'video' || node.type === 'iframe') && (
                <div className="absolute inset-0 z-10 bg-transparent" />
            )}

            {/* Smart Guide: Center Line */}
            {
                node.layoutMode !== 'free' && activeDropZone === 'center' && (
                    <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dotted border-indigo-500 z-50 pointer-events-none transform -translate-x-1/2 flex items-center justify-center">
                        <div className="bg-indigo-500 text-white text-[9px] px-1 rounded">Centrar</div>
                    </div>
                )
            }

            {/* Visual Drop Indicator (Top/Bottom sibling drop) */}
            {
                node.layoutMode !== 'free' && dropPosition === 'top' && !activeDropZone && (
                    <div className="absolute -top-3 left-0 w-full h-1.5 bg-indigo-500 rounded-full shadow-lg z-50 pointer-events-none animate-in fade-in duration-150">
                        <div className="absolute left-1/2 -top-6 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">Soltar antes</div>
                    </div>
                )
            }

            {children}

            {
                node.layoutMode !== 'free' && dropPosition === 'bottom' && !activeDropZone && (
                    <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-indigo-500 rounded-full shadow-lg z-50 pointer-events-none animate-in fade-in duration-150">
                        <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">Soltar después</div>
                    </div>
                )
            }

            {
                !isPreviewMode && (
                    <Resizer targetRef={nodeRef} id={node.id} isSelected={isSelected} />
                )
            }

            {
                isSelected && (
                    <>
                        <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-t shadow-sm flex items-center gap-2 z-[100] whitespace-nowrap pointer-events-none">
                            <span className="capitalize font-medium">{node.type}</span>
                        </div>
                        {/* Z-Index Toolbar */}
                        <QuickLayerToolbar selectedId={node.id} />
                    </>
                )
            }
        </motion.div >
    );
};

const RendererInner = ({ node }) => {
    if (!node) return null;

    // We need to access store for the root page drop handler and preview mode
    const { addElement, isPreviewMode } = useEditorStore();

    const renderChildren = () => {
        return node.children?.map((child) => (
            <Renderer key={child.id} node={child} />
        ));
    };

    if (node.type === 'card') {
        const defaultStyles = {
            width: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            ...node.styles
        };

        return (
            <ElementWrapper node={{ ...node, styles: defaultStyles }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {renderChildren()}
                </div>
            </ElementWrapper>
        );
    }

    if (node.type === 'page') {
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 1. Coordinates Calculation
            const rect = e.currentTarget.getBoundingClientRect();
            const element = e.currentTarget;

            const offsetX = parseFloat(e.dataTransfer.getData('application/react-builder-offset-x') || 0);
            const offsetY = parseFloat(e.dataTransfer.getData('application/react-builder-offset-y') || 0);

            const x = (e.clientX - rect.left) - offsetX + element.scrollLeft;
            const y = (e.clientY - rect.top) - offsetY + element.scrollTop;

            // 2. Handle Existing Element Move
            const draggedId = e.dataTransfer.getData('application/react-builder-id');
            if (draggedId) {
                useEditorStore.getState().updateStyles(draggedId, {
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    zIndex: '10'
                });
                const { reparentElement } = useEditorStore.getState();
                reparentElement(draggedId, node.id);
                return;
            }

            // 3. Handle New Component Drop
            const type = e.dataTransfer.getData('application/react-builder-type');
            if (type) {
                // Auto-Upload for Image/Video
                if (type === 'image' || type === 'video') {
                    const acceptType = type === 'image' ? 'image/*' : 'video/*';
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = acceptType;
                    input.onchange = (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                                useEditorStore.getState().addElement(node.id, type, {
                                    content: ev.target.result,
                                    styles: {
                                        position: 'absolute',
                                        left: `${x}px`,
                                        top: `${y}px`,
                                        width: '300px',
                                        height: 'auto',
                                        zIndex: '10'
                                    }
                                });
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    input.click();
                    return;
                }

                // Add Normal Elements
                addElement(node.id, type, {
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    zIndex: '10'
                });
                return;
            }

            // 4. Handle Desktop File Drop
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        useEditorStore.getState().addElement(node.id, 'image', {
                            content: event.target.result,
                            styles: {
                                position: 'absolute',
                                left: `${x}px`,
                                top: `${y}px`,
                                width: '300px',
                                height: 'auto',
                                zIndex: '10'
                            }
                        });
                    };
                    reader.readAsDataURL(file);
                }
            }
        };

        return (
            <ElementWrapper node={node}>
                <div
                    style={{ ...node.styles, position: 'relative' }} // 1. CSS Change: Container Relative
                    className="min-h-screen w-full bg-white shadow-sm pointer-events-auto" // Force pointer events on root container
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {renderChildren()}
                </div>
            </ElementWrapper>
        );
    }

    // --- NEW RENDERERS ---

    if (node.type === 'spacer') {
        return (
            <ElementWrapper node={node}>
                <div style={{ width: '100%', height: '100%', minHeight: '10px', pointerEvents: 'none' }} />
            </ElementWrapper>
        );
    }

    if (node.type === 'icon') {
        const isSvgString = node.content?.trim().startsWith('<svg');

        if (isSvgString) {
            return (
                <ElementWrapper node={node}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'inherit' }}
                        dangerouslySetInnerHTML={{ __html: node.content }}
                    />
                </ElementWrapper>
            );
        }

        const IconComponent = LucideIcons[node.content] || LucideIcons.Star;
        return (
            <ElementWrapper node={node}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <IconComponent size={24} style={{ width: '100%', height: '100%', color: 'inherit' }} />
                </div>
            </ElementWrapper>
        );
    }

    if (node.type === 'accordion') {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <ElementWrapper node={node}>
                <div
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    style={{
                        padding: '12px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    {node.content}
                    {isOpen ? <LucideIcons.ChevronUp size={16} /> : <LucideIcons.ChevronDown size={16} />}
                </div>
                <div style={{ display: isOpen ? 'block' : 'none' }}>
                    {renderChildren()}
                </div>
            </ElementWrapper>
        );
    }



    if (node.type === 'tabs') {
        return (
            <ElementWrapper node={node}>
                {/* Tabs are rendered as children structure defined in store */}
                {renderChildren()}
            </ElementWrapper>
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
        const isPlaceholder = !node.content || node.content.includes('placeholder') || node.content === '';
        return (
            <ElementWrapper node={node}>
                {/* Hidden File Input for Click-to-Upload */}
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                                useEditorStore.getState().updateContent(node.id, ev.target.result);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />

                {isPlaceholder ? (
                    <div className="w-full h-full min-h-[50px] bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group hover:border-indigo-400 hover:text-indigo-500 transition-colors p-2 text-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Click o Arrastra Imagen</span>
                    </div>
                ) : (
                    <img src={node.content} alt="Element" style={{ width: '100%', height: '100%', maxWidth: '100%', objectFit: node.styles.objectFit || 'contain', borderRadius: 'inherit', pointerEvents: 'none' }} />
                )}
            </ElementWrapper>
        )
    }

    if (node.type === 'video') {
        const isPlaceholder = !node.content || node.content.includes('placeholder') || node.content === '';
        return (
            <ElementWrapper node={node}>
                {/* Hidden File Input for Video */}
                <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const url = URL.createObjectURL(file);
                            useEditorStore.getState().updateContent(node.id, url);
                        }
                    }}
                />

                {isPlaceholder ? (
                    <div className="w-full h-full min-h-[200px] bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group hover:border-indigo-400 hover:text-indigo-500 transition-colors relative pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><polyline points="12 19 12 12 19 12" /><path d="M22 22 12 12" /></svg>
                        <span className="font-medium text-sm">Click o Arrastra Video</span>
                        <span className="text-xs text-slate-400/80">o usa el panel derecho</span>
                    </div>
                ) : (
                    <video
                        src={node.content}
                        controls={node.styles.controls !== false && !(node.styles.pointerEvents === 'none')}
                        autoPlay={node.styles.autoPlay}
                        loop={node.styles.loop}
                        muted={node.styles.muted}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            objectFit: node.styles.objectFit || 'cover',
                            borderRadius: 'inherit',
                            pointerEvents: node.styles.pointerEvents || (isPreviewMode ? 'auto' : 'none')
                        }}
                    />
                )}
            </ElementWrapper>
        )
    }

    if (node.type === 'input') {
        return (
            <ElementWrapper node={node}>
                <input
                    type={node.inputType || 'text'}
                    placeholder={node.placeholder}
                    style={{ width: '100%', height: '100%', padding: 'inherit', border: 'none', background: 'transparent', outline: 'none', pointerEvents: 'none' }}
                    readOnly
                    value={node.content}
                />
            </ElementWrapper>
        );
    }

    if (node.type === 'textarea') {
        return (
            <ElementWrapper node={node}>
                <textarea
                    placeholder={node.placeholder}
                    style={{ width: '100%', height: '100%', padding: 'inherit', border: 'none', background: 'transparent', outline: 'none', resize: 'none', pointerEvents: 'none' }}
                    readOnly
                    value={node.content}
                />
            </ElementWrapper>
        );
    }

    if (node.type === 'button') {
        return (
            <ElementWrapper node={node}>
                <button style={{ pointerEvents: 'none', width: '100%', height: '100%', background: 'transparent', border: 'none', color: 'inherit', font: 'inherit' }}>
                    {node.content}
                </button>
            </ElementWrapper>
        );
    }

    if (node.type === 'label') {
        return (
            <ElementWrapper node={node}>
                <label style={{ pointerEvents: 'none', width: '100%', display: 'block' }}>
                    {node.content}
                </label>
            </ElementWrapper>
        );
    }

    if (node.type === 'select') {
        return (
            <ElementWrapper node={node}>
                <select style={{ pointerEvents: 'none', width: '100%', padding: 'inherit', border: 'none', outline: 'none', background: 'transparent' }} disabled>
                    {node.options ? node.options.split(',').map((opt, i) => (
                        <option key={i}>{opt.trim()}</option>
                    )) : <option>Opción</option>}
                </select>
            </ElementWrapper>
        );
    }

    if (node.type === 'checkbox') {
        return (
            <ElementWrapper node={node}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                    <input type="checkbox" checked={node.checked} readOnly />
                    <span>{node.content}</span>
                </div>
            </ElementWrapper>
        );
    }

    if (node.type === 'link') {
        return (
            <ElementWrapper node={node}>
                <a href={node.href} style={{ pointerEvents: 'none', color: 'inherit', textDecoration: 'inherit' }}>
                    {node.content}
                </a>
            </ElementWrapper>
        );
    }

    if (node.type === 'divider') {
        return (
            <ElementWrapper node={node}>
                <hr style={{ width: '100%', height: '100%', margin: 0, border: 'none', backgroundColor: 'currentColor' }} />
            </ElementWrapper>
        );
    }

    if (node.type === 'form') {
        return (
            <ElementWrapper node={node}>
                <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%', height: '100%' }}>
                    {renderChildren()}
                </form>
            </ElementWrapper>
        );
    }



    // Containers
    // Smart Components for Shop
    if (node.type === 'product') {
        return (
            <ElementWrapper node={node}>
                <ProductCard node={node} />
            </ElementWrapper>
        );
    }

    if (node.type === 'cartWidget') {
        return (
            <ElementWrapper node={node}>
                <CartWidget node={node} />
            </ElementWrapper>
        );
    }

    if (node.type === 'carousel') {
        const carouselData = node.data || {};
        return (
            <ElementWrapper node={node}>
                <CarouselBlock
                    slides={carouselData.slides || []}
                    autoplayEnabled={carouselData.autoplayEnabled}
                    autoplayDelay={carouselData.autoplayDelay}
                    showArrows={carouselData.showArrows}
                    showDots={carouselData.showDots}
                    effect={carouselData.effect}
                    objectFit={carouselData.objectFit}
                />
            </ElementWrapper>
        );
    }

    if (node.type === 'threeDGallery') {
        const galleryData = node.data || {};
        return (
            <ElementWrapper node={node}>
                <ThreeDGalleryBlock
                    images={galleryData.images || []}
                    rotate={galleryData.rotate}
                    stretch={galleryData.stretch}
                    depth={galleryData.depth}
                    shadow={galleryData.shadow}
                />
            </ElementWrapper>
        );

    }

    if (node.type === 'countdown') {
        const countdownData = node.data || {};
        return (
            <ElementWrapper node={node}>
                <CountdownBlock
                    targetDate={countdownData.targetDate || node.targetDate}
                    styles={node.styles}
                />
            </ElementWrapper>
        );
    }

    if (node.type === 'flashOffer') {
        const flashData = node.data || {};
        return (
            <ElementWrapper node={node}>
                <FlashOfferBlock
                    endDate={flashData.endDate}
                    message={flashData.message}
                    styles={node.styles}
                />
            </ElementWrapper>
        );
    }

    if (node.type === 'typewriter') {
        const twData = node.data || {};
        // Map words if they come from Schema (array of objects)
        const rawWords = twData.words || ["Escribe aquí", "Tus frases"];
        const words = rawWords.map(w => (typeof w === 'object' && w.text) ? w.text : w);

        return (
            <ElementWrapper node={node}>
                <TypewriterText
                    words={words}
                    typingSpeed={twData.typingSpeed || 150}
                    deletingSpeed={twData.deletingSpeed || 50}
                    pauseTime={twData.pauseTime || 2000}
                    loop={twData.loop !== false}
                    cursorColor={node.styles.color || "currentColor"}
                    className={node.className}
                    style={node.styles}
                />
            </ElementWrapper>
        );
    }

    if (node.type === 'checkout') {
        const { cartTotal, formatCurrency } = useCart();
        const isDisabled = cartTotal === 0;
        const [showModal, setShowModal] = useState(false);

        // Define Modal here or import it. For speed, inline or sibling component.
        // Let's use a cohesive design.

        const handleCheckoutClick = (e) => {
            e.stopPropagation();
            if (isPreviewMode) {
                if (!isDisabled) setShowModal(true);
            } else {
                // In Editor, maybe just select it? Handled by ElementWrapper.
            }
        };

        return (
            <>
                <ElementWrapper node={node}>
                    {/* Visual Widget for Editor/Page */}
                    <div
                        className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 w-full"
                        style={{ ...node.styles }}
                    >
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-bold text-slate-800">Resumen del Pedido</h3>
                            <p className="text-sm text-slate-500">Total a pagar</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(cartTotal)}</p>
                        </div>

                        <button
                            onClick={handleCheckoutClick}
                            disabled={isDisabled && isPreviewMode}
                            className={clsx(
                                "w-full py-3 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2",
                                isDisabled ? "bg-slate-300 cursor-not-allowed" : "bg-[#009EE3] hover:bg-[#008ED0] shadow-md hover:shadow-lg active:scale-95"
                            )}
                        >
                            <CreditCard size={18} />
                            {isDisabled ? 'Carrito Vacío' : 'Pagar con Mercado Pago'}
                        </button>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <Lock size={10} /> Pagos procesados de forma segura
                        </div>
                    </div>
                </ElementWrapper>

                {/* Checkout Modal (Portal would be better but fixed fixed is okay for now) */}
                {/* Only render if showModal is true */}
                {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800">Finalizar Compra</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {/* Order Items Mockup - in real app list items */}
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-center">
                                        <p className="text-sm text-blue-600 mb-1">Monto Total</p>
                                        <p className="text-3xl font-bold text-blue-900">{formatCurrency(cartTotal)}</p>
                                    </div>

                                    <div className="text-sm text-gray-500 text-center">
                                        Serás redirigido a Mercado Pago para completar tu pago de forma segura.
                                    </div>
                                </div>

                                {/* Actual MP Action */}
                                <button
                                    className="w-full py-3.5 rounded-xl font-bold text-white bg-[#009EE3] hover:bg-[#008ED0] shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    onClick={() => {
                                        // TODO: Trigger actual MP link logic
                                        alert("Redirigiendo a Mercado Pago...");
                                    }}
                                >
                                    Ir a Pagar
                                </button>
                            </div>

                            <div className="p-3 bg-gray-50 text-center">
                                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                    <Lock size={10} /> Tus datos están protegidos por SSL
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <ElementWrapper node={node}>
            {renderChildren()}
        </ElementWrapper>
    );
};

// Export wrapped Renderer
export const Renderer = (props) => (
    <ErrorBoundary nodeType={props.node?.type}>
        <RendererInner {...props} />
    </ErrorBoundary>
);
