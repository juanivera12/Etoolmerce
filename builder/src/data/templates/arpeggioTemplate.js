export const ArpeggioTemplate = {
    id: "template_arpeggio",
    title: "Arpeggio Portfolio",
    description: "Diseño minimalista estilo editorial con enfoque en tipografía y espacios en blanco. Ideal para directores de arte.",
    author: "Equipo E-ToolMerce",
    author_name: "Equipo E-ToolMerce",
    author_pfp: null, // Use system default or user's if logged in
    author_role: "Diseño Editorial",
    author_bio: "Plantilla oficial de E-ToolMerce para portafolios profesionales.",
    category: "Portafolio / Editorial",
    thumbnailSrc: "https://images.unsplash.com/photo-1481480746201-1e43c5cc15ad?auto=format&fit=crop&w=500&q=60", // Minimalist White Portfolio Vibe
    structure_json: {
        id: "root",
        type: "page",
        styles: { backgroundColor: "#ffffff", color: "#1a1a1a", fontFamily: "serif" },
        children: [
            // HEADER / NAV
            {
                id: "nav_arpeggio",
                type: "header",
                styles: { padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
                children: [
                    { id: "logo", type: "text", content: "J.I.V.", styles: { fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "1px" } },
                    { id: "menu", type: "text", content: "Proyectos   Sobre Mí   Contacto", styles: { fontSize: "0.9rem", color: "#666", wordSpacing: "20px" } }
                ]
            },
            // HERO SECTION
            {
                id: "hero_arpeggio",
                type: "section",
                styles: { padding: "100px 40px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" },
                children: [
                    {
                        id: "profile_pic_hero",
                        type: "image",
                        content: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                        styles: { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 30px auto" }
                    },
                    {
                        id: "hero_title",
                        type: "text",
                        content: "Juan Ignacio Vera",
                        styles: { fontSize: "4.5rem", fontWeight: "400", marginBottom: "20px", fontFamily: "serif" },
                        animation: { type: "fade-up", duration: 800 }
                    },
                    {
                        id: "hero_subtitle",
                        type: "text",
                        content: "Director de Arte & Diseñador Digital",
                        styles: { fontSize: "1.2rem", color: "#666", fontStyle: "italic", marginBottom: "40px" },
                        animation: { type: "fade-up", duration: 800, delay: 200 }
                    },
                    {
                        id: "hero_text",
                        type: "text",
                        content: "Combino estrategia y diseño para construir marcas con propósito. Especializado en identidades visuales y experiencias web inmersivas.",
                        styles: { fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto", color: "#444" },
                        animation: { type: "fade-up", duration: 800, delay: 400 }
                    }
                ]
            },
            // SELECTED WORKS GRID (Masonry feel)
            {
                id: "works_section",
                type: "section",
                styles: { padding: "60px 40px", backgroundColor: "#fcfcfc" },
                children: [
                    { id: "works_title", type: "text", content: "Proyectos Seleccionados", styles: { fontSize: "2rem", marginBottom: "60px", textAlign: "center", fontFamily: "serif" } },
                    {
                        id: "works_grid",
                        type: "container",
                        styles: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "60px", maxWidth: "1200px", margin: "0 auto" },
                        children: [
                            // Project 1
                            {
                                id: "proj_1",
                                type: "container",
                                styles: { display: "flex", flexDirection: "column", gap: "15px" },
                                children: [
                                    { id: "img_p1", type: "image", content: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=800&q=80", styles: { width: "100%", height: "500px", objectFit: "cover" } },
                                    { id: "title_p1", type: "text", content: "Casa Mínima", styles: { fontSize: "1.5rem", fontWeight: "bold" } },
                                    { id: "desc_p1", type: "text", content: "Arquitectura / Branding", styles: { color: "#666", fontSize: "0.9rem" } }
                                ]
                            },
                            // Project 2 (Offset top margin for masonry effect)
                            {
                                id: "proj_2",
                                type: "container",
                                styles: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "100px" },
                                children: [
                                    { id: "img_p2", type: "image", content: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", styles: { width: "100%", height: "500px", objectFit: "cover" } },
                                    { id: "title_p2", type: "text", content: "Studio Lumière", styles: { fontSize: "1.5rem", fontWeight: "bold" } },
                                    { id: "desc_p2", type: "text", content: "Identidad Visual", styles: { color: "#666", fontSize: "0.9rem" } }
                                ]
                            },
                            // Project 3
                            {
                                id: "proj_3",
                                type: "container",
                                styles: { display: "flex", flexDirection: "column", gap: "15px" },
                                children: [
                                    { id: "img_p3", type: "image", content: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80", styles: { width: "100%", height: "500px", objectFit: "cover" } },
                                    { id: "title_p3", type: "text", content: "Revista Vibe", styles: { fontSize: "1.5rem", fontWeight: "bold" } },
                                    { id: "desc_p3", type: "text", content: "Diseño Editorial", styles: { color: "#666", fontSize: "0.9rem" } }
                                ]
                            },
                            // Project 4 
                            {
                                id: "proj_4",
                                type: "container",
                                styles: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "100px" },
                                children: [
                                    { id: "img_p4", type: "image", content: "https://images.unsplash.com/photo-1524143878548-c387dfe8360d?auto=format&fit=crop&w=800&q=80", styles: { width: "100%", height: "500px", objectFit: "cover" } },
                                    { id: "title_p4", type: "text", content: "Línea Botánica", styles: { fontSize: "1.5rem", fontWeight: "bold" } },
                                    { id: "desc_p4", type: "text", content: "Packaging", styles: { color: "#666", fontSize: "0.9rem" } }
                                ]
                            }
                        ]
                    }
                ]
            },
            // FOOTER with Text Rotation example (since requested)
            {
                id: "footer_arpeggio",
                type: "section",
                styles: { padding: "100px 40px", backgroundColor: "#111", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
                children: [
                    {
                        id: "footer_left",
                        type: "container",
                        styles: { display: "flex", flexDirection: "column", gap: "20px" },
                        children: [
                            { id: "collab", type: "text", content: "¿Trabajamos juntos?", styles: { fontSize: "3rem", fontFamily: "serif" } },
                            { id: "mail", type: "text", content: "hola@juanignacio.com", styles: { fontSize: "1.2rem", textDecoration: "underline" } }
                        ]
                    },
                    {
                        id: "vertical_text_example",
                        type: "text",
                        content: "SCROLL TO TOP",
                        styles: {
                            writingMode: "vertical-rl",
                            textOrientation: "mixed", // or upright can test
                            fontSize: "0.8rem",
                            letterSpacing: "2px",
                            opacity: "0.5",
                            transform: "rotate(180deg)" // To read bottom-up
                        }
                    }
                ]
            }
        ]
    }
};
