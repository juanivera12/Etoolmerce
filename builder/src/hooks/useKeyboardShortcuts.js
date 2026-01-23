import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const useKeyboardShortcuts = (saveProject) => {
    const { undo, redo, copy, paste, removeElement, selectedId } = useEditorStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if input/textarea is focused
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                return;
            }

            if (document.activeElement.isContentEditable) {
                return;
            }

            const isCtrl = e.ctrlKey || e.metaKey; // Windows Ctrl or Mac Cmd

            // Undo: Ctrl + Z
            if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
                return;
            }

            // Redo: Ctrl + Y or Ctrl + Shift + Z
            if ((isCtrl && e.key.toLowerCase() === 'y') || (isCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
                e.preventDefault();
                redo();
                return;
            }

            // Copy: Ctrl + C
            if (isCtrl && e.key.toLowerCase() === 'c') {
                e.preventDefault(); // Prevent standard copy? maybe not strictly needed but good for custom internal clipboard
                copy();
                return;
            }

            // Paste: Ctrl + V
            if (isCtrl && e.key.toLowerCase() === 'v') {
                e.preventDefault(); // Prevent text paste
                paste(); // Store logic handles offset
                return;
            }

            // Save: Ctrl + S
            if (isCtrl && e.key.toLowerCase() === 's') {
                e.preventDefault();
                if (saveProject) {
                    saveProject();
                } else {
                    console.log("Save triggered (no function provided)");
                }
                return;
            }

            // Delete: Delete or Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Only delete if something selected
                if (selectedId) {
                    e.preventDefault(); // Prevent back nav
                    removeElement(selectedId);
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [undo, redo, copy, paste, removeElement, selectedId, saveProject]);
};
