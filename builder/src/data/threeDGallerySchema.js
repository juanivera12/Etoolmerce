export const ThreeDGallerySchema = {
    type: "threeDGallery",
    title: "Galería 3D Coverflow",
    sections: [
        {
            id: "gallery_manager",
            title: "Gestión de Imágenes",
            type: "repeater",
            targetProperty: "data.images",
            startCollapsed: false,
            itemSchema: {
                titleProp: "src", // Use src as title preview
                fields: [
                    {
                        key: "src",
                        label: "Imagen",
                        type: "image",
                        description: "Sube o pega la URL de la imagen."
                    }
                ]
            },
            actions: ["add", "delete", "reorder"]
        },
        {
            id: "3d_control",
            title: "Control 3D",
            fields: [
                {
                    key: "data.rotate",
                    label: "Rotación (Grados)",
                    type: "slider",
                    min: 0,
                    max: 100,
                    step: 1,
                    defaultValue: 50,
                    showValue: true,
                    description: "Ángulo de giro de las cartas laterales."
                },
                {
                    key: "data.depth",
                    label: "Profundidad (Perspectiva)",
                    type: "slider",
                    min: 0,
                    max: 500,
                    step: 10,
                    defaultValue: 100,
                    showValue: true,
                    description: "Distancia en el eje Z."
                },
                {
                    key: "data.stretch",
                    label: "Separación (Stretch)",
                    type: "slider",
                    min: -100,
                    max: 200,
                    step: 5,
                    defaultValue: 0,
                    showValue: true,
                    description: "Espacio entre las diapositivas."
                },
                {
                    key: "data.shadow",
                    label: "Sombras Realistas",
                    type: "toggle", // Using toggle here, assume SchemaForm handles it
                    defaultValue: true,
                    description: "Activa las sombras en las cartas laterales."
                }
            ]
        }
    ]
};
