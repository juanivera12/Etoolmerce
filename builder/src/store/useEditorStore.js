import { create } from 'zustand';

const initialData = {
    id: "root",
    type: "page",
    styles: {
        backgroundColor: "#ffffff",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    children: [
        {
            id: "hero-1",
            type: "section",
            styles: {
                padding: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1",
                gap: "16px"
            },
            children: [
                {
                    id: "text-1",
                    type: "text",
                    content: "Bienvenido a tu Tienda",
                    styles: {
                        fontSize: "48px",
                        fontWeight: "800",
                        color: "#0f172a",
                        textAlign: "center"
                    }
                },
                {
                    id: "text-2",
                    type: "text",
                    content: "Arrastra elementos aquí para construir tu tienda ideal.",
                    styles: {
                        fontSize: "18px",
                        color: "#64748b",
                        textAlign: "center"
                    }
                }
            ]
        }
    ]
};

const createNode = (type) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    switch (type) {
        case 'section':
        case 'container':
            return {
                id,
                type,
                styles: {
                    padding: "20px",
                    minHeight: "100px",
                    border: "1px dashed #e2e8f0",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                },
                children: []
            };
        case 'text':
            return {
                id,
                type,
                content: "Edita este texto",
                styles: {
                    fontSize: "16px",
                    color: "#334155",
                    padding: "8px"
                }
            };
        case 'image':
            return {
                id,
                type,
                content: "https://via.placeholder.com/300x200",
                styles: {
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover"
                }
            };
        case 'product':
            return {
                id,
                type,
                styles: {
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "250px"
                },
                children: [
                    {
                        id: `${id}-img`,
                        type: 'image',
                        content: "https://via.placeholder.com/200",
                        styles: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }
                    },
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Título del Producto",
                        styles: { fontSize: "18px", fontWeight: "bold" }
                    },
                    {
                        id: `${id}-price`,
                        type: 'text',
                        content: "$99.00",
                        styles: { fontSize: "16px", color: "#4f46e5" }
                    }
                ]
            };
        case 'hero':
            return {
                id,
                type: 'section',
                styles: {
                    padding: "80px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1e293b",
                    color: "white",
                    gap: "24px",
                    textAlign: "center"
                },
                children: [
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Título Impactante",
                        styles: { fontSize: "48px", fontWeight: "800", marginBottom: "16px" }
                    },
                    {
                        id: `${id}-desc`,
                        type: 'text',
                        content: "Subtítulo descriptivo para captar la atención del cliente.",
                        styles: { fontSize: "20px", color: "#cbd5e1", maxWidth: "600px" }
                    },
                    {
                        id: `${id}-btn`,
                        type: 'text', // Using text as button for now
                        content: "Comprar Ahora",
                        styles: {
                            padding: "12px 32px",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            borderRadius: "8px",
                            fontWeight: "600",
                            marginTop: "16px",
                            cursor: "pointer"
                        }
                    }
                ]
            };
        case 'card':
            return {
                id,
                type: 'container',
                styles: {
                    padding: "24px",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    width: "300px",
                    border: "1px solid #e2e8f0"
                },
                children: [
                    {
                        id: `${id}-icon`,
                        type: 'text',
                        content: "✨",
                        styles: { fontSize: "40px" }
                    },
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Característica",
                        styles: { fontSize: "24px", fontWeight: "bold", color: "#1e293b" }
                    },
                    {
                        id: `${id}-text`,
                        type: 'text',
                        content: "Descripción breve de la característica o servicio ofrecido.",
                        styles: { fontSize: "16px", color: "#64748b" }
                    }
                ]
            };
        default:
            return {
                id,
                type,
                styles: { padding: "10px" }
            };
    }
};

// Helper to update node deeply (immutable)
const updateNode = (node, id, updateFn) => {
    if (node.id === id) {
        return updateFn(node);
    }
    if (node.children) {
        return {
            ...node,
            children: node.children.map(child => updateNode(child, id, updateFn))
        };
    }
    return node;
};

export const useEditorStore = create((set) => ({
    pageData: initialData,
    selectedId: null,
    isPreviewMode: false,
    isTutorialActive: false,

    selectElement: (id) => set({ selectedId: id }),
    togglePreview: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
    toggleTutorial: () => set((state) => ({ isTutorialActive: !state.isTutorialActive })),

    updateStyles: (id, newStyles) => set((state) => ({
        pageData: updateNode(state.pageData, id, (node) => ({
            ...node,
            styles: { ...node.styles, ...newStyles }
        }))
    })),

    updateContent: (id, newContent) => set((state) => ({
        pageData: updateNode(state.pageData, id, (node) => ({
            ...node,
            content: newContent
        }))
    })),

    removeElement: (id) => set((state) => {
        const removeNode = (node, targetId) => {
            if (node.children) {
                return {
                    ...node,
                    children: node.children
                        .filter(child => child.id !== targetId)
                        .map(child => removeNode(child, targetId))
                };
            }
            return node;
        };
        return {
            pageData: removeNode(state.pageData, id),
            selectedId: null
        };
    }),

    addElement: (parentId, type) => set((state) => ({
        pageData: updateNode(state.pageData, parentId, (node) => ({
            ...node,
            children: [...(node.children || []), createNode(type)]
        }))
    })),

    addImageElement: (parentId, imageUrl) => set((state) => ({
        pageData: updateNode(state.pageData, parentId, (node) => {
            const newNode = createNode('image');
            newNode.content = imageUrl;
            return {
                ...node,
                children: [...(node.children || []), newNode]
            };
        })
    })),
}));
