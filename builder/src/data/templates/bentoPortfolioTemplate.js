export const BentoPortfolioTemplate = {
    id: "template_bento_optixel",
    title: "Optixel Studio",
    description: "Plantilla estilo agencia moderna con diseño Bento Grid, modo oscuro y acentos vibrantes.",
    author: "Juan Ignacio Vera",
    author_name: "Juan Ignacio Vera",
    category: "Portafolio / Agencia",
    thumbnailSrc: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=500&q=60",
    structure_json: {
        id: "root",
        type: "page",
        children: [
            // HERO - Minimalist but Big
            {
                id: "hero_bento",
                type: "section",
                styles: {
                    backgroundColor: "#0a0a0a",
                    padding: "100px 40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderBottom: "1px solid #222"
                },
                children: [
                    {
                        id: "hero_badge",
                        type: "text",
                        content: "ESTUDIO DIGITAL",
                        styles: {
                            color: "#00f0ff", // Cyan accent
                            fontSize: "0.8rem",
                            letterSpacing: "2px",
                            fontWeight: "bold",
                            border: "1px solid #00f0ff",
                            padding: "8px 16px",
                            borderRadius: "50px",
                            marginBottom: "20px",
                            display: "inline-block"
                        },
                        animation: { type: "fade-down" }
                    },
                    {
                        id: "hero_title",
                        type: "text",
                        content: "DISEÑO QUE\nIMPACTA",
                        styles: {
                            color: "#fff",
                            fontSize: "5rem",
                            fontWeight: "900",
                            lineHeight: "1",
                            marginBottom: "20px"
                        },
                        animation: { type: "zoom-in", duration: 800 }
                    },
                    {
                        id: "hero_sub",
                        type: "text",
                        content: "Creamos experiencias digitales que definen marcas y conectan con audiencias globales.",
                        styles: {
                            color: "#888",
                            fontSize: "1.2rem",
                            maxWidth: "600px",
                            margin: "0 auto"
                        },
                        animation: { type: "fade-up", duration: 800, delay: 200 }
                    }
                ]
            },
            // BENTO GRID SECTION
            {
                id: "bento_grid_section",
                type: "section",
                styles: {
                    backgroundColor: "#0a0a0a",
                    padding: "80px 40px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(2, 300px)",
                    gap: "20px"
                },
                children: [
                    // Box 1: Large Project (Span 2 cols, 2 rows)
                    {
                        id: "bento_1",
                        type: "container",
                        styles: {
                            gridColumn: "span 2",
                            gridRow: "span 2",
                            backgroundColor: "#111",
                            borderRadius: "24px",
                            overflow: "hidden",
                            position: "relative",
                            border: "1px solid #222"
                        },
                        children: [
                            {
                                id: "bento_img_1",
                                type: "image",
                                content: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80",
                                styles: { width: "100%", height: "100%", objectFit: "cover", opacity: "0.8" }
                            },
                            {
                                id: "bento_txt_1",
                                type: "text",
                                content: "PROYECTO DESTACADO\nRebranding 2024",
                                styles: {
                                    position: "absolute",
                                    bottom: "30px",
                                    left: "30px",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "1.5rem"
                                }
                            }
                        ]
                    },
                    // Box 2: Service List (Span 1 col, 2 rows)
                    {
                        id: "bento_2",
                        type: "container",
                        styles: {
                            gridColumn: "span 1",
                            gridRow: "span 2",
                            backgroundColor: "#161616",
                            borderRadius: "24px",
                            padding: "30px",
                            border: "1px solid #222",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        },
                        children: [
                            { id: "serv_title", type: "text", content: "SERVICIOS", styles: { color: "#666", fontSize: "0.9rem" } },
                            {
                                id: "serv_list",
                                type: "text",
                                content: "• Branding\n• Web Design\n• 3D Motion\n• UX/UI\n• Desarrollo\n• Marketing",
                                styles: { color: "#fff", fontSize: "1.5rem", lineHeight: "1.8", fontWeight: "500" }
                            },
                            {
                                id: "serv_icon",
                                type: "button",
                                content: "Ver todo →",
                                styles: { background: "transparent", border: "1px solid #333", color: "#fff", padding: "10px", borderRadius: "10px" }
                            }
                        ]
                    },
                    // Box 3: Stat (Span 1 col, 1 row)
                    {
                        id: "bento_3",
                        type: "container",
                        styles: {
                            backgroundColor: "#00f0ff", // Accent
                            borderRadius: "24px",
                            padding: "30px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        },
                        children: [
                            { id: "stat_num", type: "text", content: "95+", styles: { fontSize: "4rem", fontWeight: "900", color: "#000" } },
                            { id: "stat_lbl", type: "text", content: "Proyectos", styles: { fontSize: "1rem", fontWeight: "bold", color: "#000" } }
                        ]
                    },
                    // Box 4: Contact/Social (Span 1 col, 1 row)
                    {
                        id: "bento_4",
                        type: "container",
                        styles: {
                            backgroundColor: "#111",
                            borderRadius: "24px",
                            padding: "30px",
                            border: "1px solid #222",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: [
                            {
                                id: "social_link",
                                type: "text",
                                content: "CONTACTO\nhello@optixel.com",
                                styles: { color: "#fff", textAlign: "center", fontSize: "1.1rem" }
                            }
                        ]
                    }
                ]
            },
            // MARQUEE CLIENTS
            {
                id: "marquee_clients",
                type: "section",
                styles: {
                    backgroundColor: "#0a0a0a",
                    padding: "40px 0",
                    borderTop: "1px solid #222",
                    borderBottom: "1px solid #222",
                    overflow: "hidden"
                },
                children: [
                    {
                        id: "client_marquee",
                        type: "text",
                        content: "GOOGLE • NIKE • APPLE • SONY • SPOTIFY • ADIDAS • TESLA • GOOGLE • NIKE • APPLE •",
                        styles: {
                            color: "#333",
                            fontSize: "3rem",
                            fontWeight: "900",
                            whiteSpace: "nowrap"
                        },
                        animation: { type: "marquee-left", duration: 10000 }
                    }
                ]
            },
            // FOOTER
            {
                id: "footer_bento",
                type: "section",
                styles: {
                    backgroundColor: "#0a0a0a",
                    padding: "80px 40px",
                    textAlign: "center"
                },
                children: [
                    {
                        id: "footer_cta",
                        type: "text",
                        content: "¿Listo para empezar?",
                        styles: { color: "#fff", fontSize: "2rem", marginBottom: "30px", fontWeight: "bold" }
                    },
                    {
                        id: "cta_btn_bento",
                        type: "button",
                        content: "INICIAR PROYECTO",
                        styles: {
                            backgroundColor: "#fff",
                            color: "#000",
                            padding: "15px 40px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "50px",
                            cursor: "pointer"
                        }
                    }
                ]
            }
        ]
    }
};
