export const CarouselSchema = {
    type: "carousel",
    title: "Configuración de Carrusel",
    sections: [
        {
            id: "slides_manager",
            title: "Gestión de Slides",
            type: "repeater", // Special UI for list management
            targetProperty: "data.slides", // Path in node object
            startCollapsed: false,
            itemSchema: {
                titleProp: "id", // Use 'id' or index as title? Or 'Image'
                fields: [
                    {
                        key: "src",
                        label: "URL de Imagen",
                        type: "image",
                        description: "Enlace directo a la imagen."
                    },
                    {
                        key: "showButton",
                        label: "Mostrar Botón",
                        type: "toggle",
                        defaultValue: false
                    },
                    {
                        key: "buttonText",
                        label: "Texto del Botón",
                        type: "text",
                        defaultValue: "Ver Detalles",
                        condition: {
                            key: "showButton",
                            operator: "eq",
                            value: true
                        }
                    },
                    {
                        key: "modalTitle",
                        label: "Título del Modal",
                        type: "text",
                        defaultValue: "Título del Producto",
                        condition: {
                            key: "showButton",
                            operator: "eq",
                            value: true
                        }
                    },
                    {
                        key: "modalContent",
                        label: "Contenido del Modal",
                        type: "textarea", // SchemaRenderer needs to support this or fall back to text
                        defaultValue: "Descripción detallada...",
                        condition: {
                            key: "showButton",
                            operator: "eq",
                            value: true
                        }
                    },
                    {
                        key: "borderColor",
                        label: "Color de Borde",
                        type: "color",
                        defaultValue: "#000000"
                    },
                    {
                        key: "borderWidth",
                        label: "Grosor Borde (px)",
                        type: "number",
                        defaultValue: 0
                    },
                    {
                        key: "borderRadius",
                        label: "Redondeo (px)",
                        type: "number",
                        defaultValue: 0
                    }
                ]
            },
            actions: ["add", "delete", "reorder"]
        },
        {
            id: "behavior",
            title: "Comportamiento",
            fields: [
                {
                    key: "data.autoplayEnabled", // Dot notation for node.data.autoplayEnabled
                    label: "Reproducción Automática",
                    type: "toggle",
                    defaultValue: true
                },
                {
                    key: "data.autoplayDelay",
                    label: "Velocidad / Delay (ms)",
                    type: "slider",
                    min: 2000,
                    max: 10000,
                    step: 500,
                    defaultValue: 3000,
                    showValue: true,
                    condition: {
                        key: "data.autoplayEnabled",
                        operator: "eq",
                        value: true
                    }
                },
                {
                    key: "data.showArrows",
                    label: "Mostrar Flechas",
                    type: "toggle",
                    defaultValue: true
                },
                {
                    key: "data.showDots",
                    label: "Mostrar Puntos",
                    type: "toggle",
                    defaultValue: true
                },
                {
                    key: "data.objectFit",
                    label: "Ajuste de Imagen (Uniformidad)",
                    type: "select",
                    options: [
                        { value: "cover", label: "Cover (Llenar y Recortar)" },
                        { value: "contain", label: "Contain (Ver Completa)" },
                        { value: "fill", label: "Fill (Estirar - No recomendado)" }
                    ],
                    defaultValue: "cover",
                    description: "Define como se ajustan las imágenes al espacio del carrusel."
                }
            ]
        },
        {
            id: "effects",
            title: "Efectos de Transición",
            fields: [
                {
                    key: "data.effect",
                    label: "Efecto de Animación",
                    type: "select",
                    options: [
                        { value: "slide", label: "Slide (Clásico)" },
                        { value: "fade", label: "Fade (Suave)" },
                        { value: "cube", label: "Cubo 3D (Impactante)" },
                        { value: "coverflow", label: "Coverflow (Profundidad)" },
                        { value: "flip", label: "Flip (Giro 3D)" }
                    ],
                    defaultValue: "slide",
                    description: "Elige como cambian las diapositivas."
                }
            ]
        }
    ]
};
