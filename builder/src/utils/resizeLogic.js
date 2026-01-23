/**
 * calculateResize
 * 
 * Calculates the new dimensions and position of a box during a resize operation.
 * This function is pure and does not depend on the DOM or React.
 * 
 * @param {Object} currentBox - The current state of the box { x, y, width, height }
 * @param {Object} mouseDelta - The movement of the mouse { dx, dy }
 * @param {string} handleDirection - The direction of the handle being dragged ('n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw')
 * @param {Object} options - Optional constraints { minWidth, minHeight, maintainAspectRatio }
 * @returns {Object} - The new box state { x, y, width, height }
 */
export const calculateResize = (
    currentBox,
    mouseDelta,
    handleDirection,
    options = { minWidth: 20, minHeight: 20 }
) => {
    const { x, y, width, height } = currentBox;
    const { dx, dy } = mouseDelta;
    const { minWidth = 20, minHeight = 20 } = options;

    let newBox = { x, y, width, height };

    // Horizontal Resizing
    if (handleDirection.includes('e')) {
        // Dragging East (Right): Just change width
        newBox.width = Math.max(minWidth, width + dx);
    } else if (handleDirection.includes('w')) {
        // Dragging West (Left): Change width AND x
        // If we reduce width by dx, we must increase x by dx (to stay anchored right)
        // But dx is negative when moving left (widening), so width increases.
        // Logic: newWidth = width - dx. newX = x + dx.
        // Wait, standard delta: if I move mouse LEFT, dx is negative.
        // Width should INCREASE: width + (-dx) -> width - dx.
        // Position should MOVE LEFT: x + dx.

        // Let's implement the "visual anchor right" logic:
        const proposedWidth = width - dx;

        if (proposedWidth >= minWidth) {
            newBox.width = proposedWidth;
            newBox.x = x + dx;
        } else {
            // Clamped. Width stays at minWidth. X stops moving.
            // To be precise: If we hit minWidth, we shouldn't move X further right.
            newBox.width = minWidth;
            // X should be the right edge (x + width) - minWidth
            newBox.x = (x + width) - minWidth;
        }
    }

    // Vertical Resizing
    if (handleDirection.includes('s')) {
        // Dragging South (Bottom): Just change height
        newBox.height = Math.max(minHeight, height + dy);
    } else if (handleDirection.includes('n')) {
        // Dragging North (Top): Change height AND y
        // If I move mouse UP, dy is negative. Height increases.
        // newHeight = height - dy.
        // newY = y + dy.

        const proposedHeight = height - dy;

        if (proposedHeight >= minHeight) {
            newBox.height = proposedHeight;
            newBox.y = y + dy;
        } else {
            newBox.height = minHeight;
            newBox.y = (y + height) - minHeight;
        }
    }

    return newBox;
};
