import { useEffect } from 'react';

/**
 * Tracks mouse position relative to a specific container.
 * Sets --mouse-x and --mouse-y CSS variables on the container.
 * 
 * @param {React.RefObject} ref - Reference to the container element
 * @param {boolean} enabled - Whether the listener should be active
 */
export const useRelativeMouse = (ref, enabled = false) => {
    useEffect(() => {
        const element = ref.current;
        if (!enabled || !element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate percentage just in case, but px is usually safer for gradients
            // const xPct = (x / rect.width) * 100;
            // const yPct = (y / rect.height) * 100;

            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        };

        // We attach to the element itself to only trigger when hovering that specific container
        // Or we can attach to window/document if we want it to react even when valid? 
        // "Interactive Spotlight" usually implies hovering the card.
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseenter', handleMouseMove); // Init on enter

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseenter', handleMouseMove);
            // Cleanup vars? Not strictly necessary.
        };
    }, [ref, enabled]);
};
