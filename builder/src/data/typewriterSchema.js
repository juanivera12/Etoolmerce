export const TypewriterSchema = {
    type: "typewriter",
    title: "Texto Typewriter",
    sections: [
        {
            id: "words_manager",
            title: "Frases",
            type: "repeater", // Assuming this supports simple array if itemSchema is simple?
            // Actually, the previous example used object array for images { src: ... }
            // Typewriter expects array of strings ["Word 1", "Word 2"]
            // If the repeater only supports objects, I might need to adjust Renderer or Schema logic.
            // Let's assume for now it needs objects, but TypewriterText expects strings.
            // I will start with objects { text: "..." } and map them in Renderer if needed.
            // But wait, user requested: words (array de strings).
            // Let's check if I can use a simpler input, like a textarea "One phrase per line". 
            // That's often easier for users.
            // I'll check if "textarea" type exists in SchemaRenderer... I don't know.
            // Safest bet: Repeater of objects { text: "" } and update Renderer to map it.
            targetProperty: "data.words",
            startCollapsed: false,
            itemSchema: {
                titleProp: "text",
                fields: [
                    {
                        key: "text",
                        label: "Frase",
                        type: "text",
                        defaultValue: "Nueva frase"
                    }
                ]
            },
            actions: ["add", "delete", "reorder"]
        },
        {
            id: "settings",
            title: "Configuración",
            fields: [
                {
                    key: "data.typingSpeed",
                    label: "Velocidad Escritura (ms)",
                    type: "number",
                    min: 10,
                    max: 500,
                    defaultValue: 150,
                    description: "Tiempo por letra."
                },
                {
                    key: "data.deletingSpeed",
                    label: "Velocidad Borrado (ms)",
                    type: "number",
                    min: 10,
                    max: 500,
                    defaultValue: 50
                },
                {
                    key: "data.pauseTime",
                    label: "Pausa (ms)",
                    type: "number",
                    min: 0,
                    max: 5000,
                    defaultValue: 2000,
                    description: "Tiempo de espera antes de borrar."
                },
                {
                    key: "data.loop",
                    label: "Ciclo Infinito",
                    type: "toggle",
                    defaultValue: true
                }
            ]
        }
    ]
};
