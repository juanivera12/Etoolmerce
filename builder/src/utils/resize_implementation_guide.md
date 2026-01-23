# Guía de Implementación: Redimensionamiento Robusto

Esta guía explica cómo utilizar la función matemática pura `calculateResize` que hemos creado en `src/utils/resizeLogic.js` tanto en entornos React como Vanilla JS.

## 1. La Lógica Pura (`src/utils/resizeLogic.js`)

Esta función maneja toda la complejidad matemática, incluidos los casos difíciles como redimensionar desde la izquierda (West) o arriba (North) donde tanto la posición como el tamaño deben cambiar coordinadamente.

```javascript
/* src/utils/resizeLogic.js */
export const calculateResize = (currentBox, mouseDelta, handleDirection, options) => {
    // ... lógica implementada ...
    // Maneja restricciones minWidth/minHeight y evita el "flipping" o roturas.
};
```

---

## 2. Implementación en React

En React, usamos `useState` o `useRef` para guardar el estado y actualizamos durante `onMouseMove` (o eventos de puntero).

### Ejemplo de Componente `ResizableBox.jsx`

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { calculateResize } from '../utils/resizeLogic';

export const ResizableBox = () => {
    const [box, setBox] = useState({ x: 100, y: 100, width: 200, height: 150 });
    const [isResizing, setIsResizing] = useState(false);
    
    // Guardamos el estado inicial de la interacción para calcular deltas precisos
    const dragStartRef = useRef(null); // { x, y, initialBox }

    const handleMouseDown = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialBox: { ...box }, // Copia del estado al empezar
            direction: direction
        };
        
        // Bloquear selección de texto globalmente mientras arrastramos
        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing || !dragStartRef.current) return;

            const { startX, startY, initialBox, direction } = dragStartRef.current;
            
            // Calculamos el delta TOTAL desde el inicio del arrastre
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Llamamos a nuestra función pura
            const newBoxState = calculateResize(
                initialBox,        // IMPORTANTE: Usar siempre el estado inicial del arrastre como base
                { dx, dy }, 
                direction,
                { minWidth: 20, minHeight: 20 }
            );

            setBox(newBoxState);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            dragStartRef.current = null;
            document.body.style.userSelect = '';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div 
            style={{ 
                position: 'absolute', 
                left: box.x, 
                top: box.y, 
                width: box.width, 
                height: box.height, 
                border: '2px solid blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)'
            }}
        >
            {/* Renderizar manejadores */}
            {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(dir => (
                <div 
                    key={dir}
                    onMouseDown={(e) => handleMouseDown(e, dir)}
                    className={`handle handle-${dir}`} // Asigna estilos CSS para posicionar cada punto
                    style={{ position: 'absolute', width: 8, height: 8, background: 'white', border: '1px solid black' }} 
                />
            ))}
        </div>
    );
};
```

---

## 3. Implementación en Vanilla JS

En Vanilla JS, manipulamos el DOM directamente para máximo rendimiento.

```javascript
import { calculateResize } from './utils/resizeLogic.js';

const element = document.getElementById('my-resizable');
const handles = document.querySelectorAll('.handle');

let isResizing = false;
let startX, startY;
let initialBox = { x: 0, y: 0, width: 0, height: 0 };
let currentDirection = '';

handles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;
        currentDirection = handle.dataset.direction; // ej: data-direction="ne"
        
        startX = e.clientX;
        startY = e.clientY;
        
        // Leer valores actuales (parsear '100px' a 100)
        const rect = element.getBoundingClientRect();
        // Nota: para posicion absoluta, mejor leer element.style.left/top si están seteados
        initialBox = {
            x: parseFloat(element.style.left) || 0,
            y: parseFloat(element.style.top) || 0,
            width: parseFloat(element.style.width) || rect.width,
            height: parseFloat(element.style.height) || rect.height
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

function onMouseMove(e) {
    if (!isResizing) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Cálculo Puro
    const newBox = calculateResize(
        initialBox,
        { dx, dy },
        currentDirection,
        { minWidth: 20, minHeight: 20 }
    );

    // Aplicación al DOM
    element.style.left = `${newBox.x}px`;
    element.style.top = `${newBox.y}px`;
    element.style.width = `${newBox.width}px`;
    element.style.height = `${newBox.height}px`;
}

function onMouseUp() {
    isResizing = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}
```

## Claves para evitar "Roturas"

1.  **Siempre calcular desde el estado inicial (`initialBox`)**: No sumar delta sobre delta frame a frame porque acumula errores de redondeo. Suma siempre `initial + currentDelta`.
2.  **Manejo de Ejes Inversos**: La función `calculateResize` maneja correctamente que al arrastrar desde la izq, `width` aumenta y `x` disminuye.
3.  **Límites (`Math.max`)**: Asegura que el width nunca sea negativo, evitando que el elemento se invierta.
