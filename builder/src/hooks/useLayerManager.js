import { useEditorStore } from '../store/useEditorStore';

export const useLayerManager = () => {
    const { pages, activePageId, updateStyles } = useEditorStore();

    // Helper to find component and its siblings in the tree
    const findComponentAndSiblings = (nodes, id, parent = null) => {
        for (const node of nodes) {
            if (node.id === id) {
                return { node, siblings: nodes, parent };
            }
            if (node.children) {
                const result = findComponentAndSiblings(node.children, id, node);
                if (result) return result;
            }
        }
        return null;
    };

    const getSiblings = (id) => {
        const activePage = pages.find((p) => p.id === activePageId);
        if (!activePage) return null;
        return findComponentAndSiblings(activePage.content, id);
    };

    const getZIndex = (node) => {
        if (!node.styles || node.styles.zIndex === undefined || node.styles.zIndex === 'auto') return 0;
        return parseInt(node.styles.zIndex, 10) || 0;
    };

    const bringToFront = (id) => {
        const data = getSiblings(id);
        if (!data) return;
        const { siblings } = data;

        const maxZ = siblings.reduce((max, node) => Math.max(max, getZIndex(node)), 0);
        updateStyles(id, { zIndex: maxZ + 1 });
    };

    const sendToBack = (id) => {
        const data = getSiblings(id);
        if (!data) return;
        const { siblings, node } = data;

        // Special case: Background/Video should not go below body/root if specific rules apply,
        // but here we just follow the logic: find min - 1.
        // Assuming user wants it behind CURRENT siblings.

        const minZ = siblings.reduce((min, n) => Math.min(min, getZIndex(n)), 0);
        let newZ = minZ - 1;

        // Optional safety: don't go below a certain threshold if needed, but generic is fine.
        updateStyles(id, { zIndex: newZ });
    };

    const moveForward = (id) => {
        const data = getSiblings(id);
        if (!data) return;
        const { node } = data;
        const currentZ = getZIndex(node);
        updateStyles(id, { zIndex: currentZ + 1 });
    };

    const moveBackward = (id) => {
        const data = getSiblings(id);
        if (!data) return;
        const { node } = data;
        const currentZ = getZIndex(node);
        updateStyles(id, { zIndex: currentZ - 1 });
    };

    return {
        bringToFront,
        sendToBack,
        moveForward,
        moveBackward
    };
};
