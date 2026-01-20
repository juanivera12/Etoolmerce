import React, { useState, useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import clsx from 'clsx';
import { Resizer } from './Resizer';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const ElementWrapper = ({ node, children }) => {
    const { selectedId, selectElement, addElement, moveElement, updateStyles, isPreviewMode, setActivePage } = useEditorStore();
    const isSelected = selectedId === node.id && !isPreviewMode;
    const [dropPosition, setDropPosition] = useState(null); // 'top' | 'bottom' | null
    const [activeDropZone, setActiveDropZone] = useState(null); // 'left' | 'center' | 'right' | null
    const nodeRef = useRef(null); // Ref for the wrapper logic

    const handleClick = (e) => {
        if (isPreviewMode) {
            // Handle Interaction in Preview Mode
            if (node.interaction) {
                if (node.interaction.type === 'link' && node.interaction.targetPageId) {
                    setActivePage(node.interaction.targetPageId);
                } else if (node.interaction.type === 'text' || node.interaction.type === 'url') {
                    if (node.interaction.url) window.open(node.interaction.url, '_blank');
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
        if (isPreviewMode || node.type === 'background') {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        e.dataTransfer.setData('application/react-builder-id', node.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Only specific types can accept drops (and only in edit mode)
    const canAcceptDrop = !isPreviewMode && ['section', 'container', 'page', 'header', 'footer', 'hero', 'card', 'newsletter', 'accordion', 'tabs'].includes(node.type);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (canAcceptDrop) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;

            // Smart Zone Detection
            if (percent > 0.4 && percent < 0.6) {
                setActiveDropZone('center');
            } else if (percent <= 0.4) {
                setActiveDropZone('left');
            } else {
                setActiveDropZone('right');
            }
            e.dataTransfer.dropEffect = 'copy';
            return;
        }

        if (e.dataTransfer.types.includes('application/react-builder-id')) {
            e.dataTransfer.dropEffect = 'move';

            // Calculate visual indicator
            const rect = e.currentTarget.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            setDropPosition(e.clientY < midY ? 'top' : 'bottom');
        }
    };

    const handleDragLeave = () => {
        setDropPosition(null);
        setActiveDropZone(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropPosition(null);
        setActiveDropZone(null);

        if (isPreviewMode) return;

        // Smart Drop Logic: Apply Alignment
        if (canAcceptDrop && activeDropZone) {
            let justify = 'flex-start';
            if (activeDropZone === 'center') justify = 'center';
            if (activeDropZone === 'right') justify = 'flex-end';

            // Apply Auto-Alignment to Container
            updateStyles(node.id, {
                display: 'flex',
                flexDirection: 'column', // Default to column for stacks usually, but justify works on main axis. 
                // Wait, usually we want items stacked vertically centered? Or horizontally?
                // Request says: "justify-content: center". For column, that aligns vertically. For row, horizontally.
                // Assuming standard web builder flow often implies vertical stacking (column) but horizontal alignment (alignItems). 
                // BUT "Justify Content Center" usually centers along main axis.
                // If distinct items are dropped, user might expect standard flex behavior.
                // Let's stick to the user's specific request: "justify-content: center".
                // And ensure dynamic padding.
                justifyContent: activeDropZone === 'center' ? 'center' : (activeDropZone === 'right' ? 'flex-end' : 'flex-start'),
                alignItems: activeDropZone === 'center' ? 'center' : 'flex-start', // Also center cross-axis for true centering?
                padding: '20px' // Dynamic padding base
            });
        }

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

        // Handle Reordering or Free Movement
        const draggedId = e.dataTransfer.getData('application/react-builder-id');

        // If Parent is in Free Layout Mode
        if (node.layoutMode === 'free') {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            // If moving existing element
            if (draggedId) {
                useEditorStore.getState().updateStyles(draggedId, {
                    position: 'absolute',
                    top: `${relY}px`,
                    left: `${relX}px`,
                    marginTop: '0',
                    marginLeft: '0'
                });

                // If moving from another parent, we still need to "move" it in structure
                if (draggedId !== node.id) {
                    moveElement(draggedId, node.id, 'after'); // 'after' appends to end
                }
                return;
            }

            // If Drop New Element in Free Mode
            const type = e.dataTransfer.getData('application/react-builder-type');
            if (type) {
                addElement(node.id, type, {
                    position: 'absolute',
                    top: `${relY}px`,
                    left: `${relX}px`,
                    width: 'auto', // Let content dictate width initially
                    height: 'auto'
                });
            }
            return;
        }

        // Standard Stack/Flex Reordering (Only if NOT dropping into container as parent)
        // If we are dropping ON a container, we usually append. 
        // Logic: If canAcceptDrop is true, we treated it as "Smart Drop" above and applied styles.
        // We still need to ADD the element!

        const type = e.dataTransfer.getData('application/react-builder-type');

        if (draggedId) {
            // Move logic...
            if (draggedId !== node.id) {
                // For smart drop, if specific zone, maybe we append?
                // Simple logic: If strict reordering (dropPosition set), do that. 
                // If smart zone set, append to THIS node.
                moveElement(draggedId, node.id, 'after');
            }
            return;
        }

        if (type === 'image') {
            // ... existing image logic ...
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        useEditorStore.getState().addImageElement(node.id, e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
            return;
        }

        if (type) {
            addElement(node.id, type);
        }
    };

    // Check if parent (this node) has free layout to simplify Wrapper rendering for children? 
    // Actually the Wrapper is FOR this node, so we check `node.styles.position` mostly.

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            ref={nodeRef}
            draggable={!isPreviewMode}
            onDragStart={handleDragStart}
            onClick={handleClick}
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
                activeDropZone === 'center' && "bg-indigo-50/30",
                activeDropZone === 'left' && "bg-slate-50/30",
                activeDropZone === 'right' && "bg-slate-50/30"
            )}
            style={{
                ...node.styles,
                boxShadow: dropPosition ? '0 0 0 2px #6366f1' : (isSelected ? undefined : 'none') // Removed transition, handled by motion
            }}
        >
            {/* Smart Guide: Center Line */}
            {activeDropZone === 'center' && (
                <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dotted border-indigo-500 z-50 pointer-events-none transform -translate-x-1/2 flex items-center justify-center">
                    <div className="bg-indigo-500 text-white text-[9px] px-1 rounded">Centrar</div>
                </div>
            )}

            {/* Visual Drop Indicator (Top/Bottom sibling drop) */}
            {dropPosition === 'top' && !activeDropZone && (
                <div className="absolute -top-3 left-0 w-full h-1.5 bg-indigo-500 rounded-full shadow-lg z-50 pointer-events-none animate-in fade-in duration-150">
                    <div className="absolute left-1/2 -top-6 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">Soltar antes</div>
                </div>
            )}

            {children}

            {dropPosition === 'bottom' && !activeDropZone && (
                <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-indigo-500 rounded-full shadow-lg z-50 pointer-events-none animate-in fade-in duration-150">
                    <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">Soltar después</div>
                </div>
            )}

            {!isPreviewMode && (
                <Resizer targetRef={nodeRef} id={node.id} isSelected={isSelected} />
            )}

            {isSelected && (
                <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-t shadow-sm flex items-center gap-2 z-[100] whitespace-nowrap pointer-events-none">
                    <span className="capitalize font-medium">{node.type}</span>
                </div>
            )}
        </motion.div>
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

            if (type === 'image') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            useEditorStore.getState().addImageElement(node.id, e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
                return;
            }

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

    if (node.type === 'carousel') {
        const [current, setCurrent] = useState(0);
        const next = (e) => { e.stopPropagation(); setCurrent(c => (c + 1) % (node.children?.length || 1)); };
        const prev = (e) => { e.stopPropagation(); setCurrent(c => (c - 1 + (node.children?.length || 1)) % (node.children?.length || 1)); };

        return (
            <ElementWrapper node={node}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Render specific slide */}
                    {node.children && node.children.length > 0 && (
                        <Renderer node={node.children[current]} />
                    )}

                    {/* Controls */}
                    <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10 transition-colors">
                        <LucideIcons.ChevronLeft size={20} />
                    </button>
                    <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10 transition-colors">
                        <LucideIcons.ChevronRight size={20} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {node.children?.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
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
                    <img src={node.content} alt="Element" style={{ width: '100%', height: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 'inherit', pointerEvents: 'none' }} />
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
                        controls={node.styles.controls !== false}
                        autoPlay={node.styles.autoPlay}
                        loop={node.styles.loop}
                        muted={node.styles.muted}
                        style={{ width: '100%', height: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius: 'inherit', pointerEvents: 'none' }}
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

    if (node.type === 'background') {
        return (
            <ElementWrapper node={node}>
                <div style={{ width: '100%', height: '100%' }} />
            </ElementWrapper>
        );
    }

    // Containers
    return (
        <ElementWrapper node={node}>
            {renderChildren()}
        </ElementWrapper>
    );
};
