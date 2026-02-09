export const EditorialFanningTemplate = {
    id: "template_elle_spotlight",
    title: "i-D Spotlight Editorial",
    description: "Plantilla estilo revista de moda, con tipografía elegante, espacios en blanco y enfoque en fotografía de retrato.",
    author: "Juan Ignacio Vera",
    author_name: "Juan Ignacio Vera",
    category: "Moda / Editorial",
    thumbnailSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60",
    structure_json: {
        id: "root",
        type: "page",
        children: [
            // HERO - Full screen portrait
            {
                id: "hero_editorial",
                type: "section",
                styles: {
                    height: "100vh",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    backgroundColor: "#f4f4f4", // Off-white
                    padding: "0"
                },
                children: [
                    // Left: Text content
                    {
                        id: "hero_text_col",
                        type: "container",
                        styles: {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "4rem",
                            borderRight: "1px solid #000"
                        },
                        children: [
                            {
                                id: "hero_eyebrow",
                                type: "text",
                                content: "THE SPOTLIGHT",
                                styles: {
                                    fontSize: "1rem",
                                    letterSpacing: "4px",
                                    fontWeight: "bold",
                                    marginBottom: "1rem",
                                    color: "#000"
                                }
                            },
                            {
                                id: "hero_main_title",
                                type: "text",
                                content: "ELLE\nFANNING",
                                styles: {
                                    fontSize: "6rem",
                                    lineHeight: "0.9",
                                    fontFamily: "serif",
                                    fontWeight: "400",
                                    color: "#000",
                                    marginBottom: "2rem"
                                },
                                animation: { type: "fade-right", duration: 1000 }
                            },
                            {
                                id: "hero_desc",
                                type: "text",
                                content: "Una exploración visual sobre el estilo, la actuación y la identidad en la era digital.",
                                styles: {
                                    fontSize: "1.2rem",
                                    maxWidth: "400px",
                                    lineHeight: "1.5",
                                    fontFamily: "sans-serif",
                                    color: "#333" // Fixed visibility
                                },
                                animation: { type: "fade-up", duration: 1000, delay: 300 }
                            }
                        ]
                    },
                    // Right: Image
                    {
                        id: "hero_img_col",
                        type: "image",
                        content: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90",
                        styles: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        },
                        animation: { type: "zoom-out", duration: 1500 }
                    }
                ]
            },
            // MARQUEE STRIP (Editorial Style)
            {
                id: "marquee_editorial",
                type: "section",
                styles: {
                    backgroundColor: "#000",
                    padding: "15px 0",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                },
                children: [
                    {
                        id: "marquee_text_ed",
                        type: "text",
                        content: "FASHION • CINEMA • ART • CULTURE • DESIGN • BEAUTY • FASHION • CINEMA • ART •",
                        styles: {
                            color: "#fff",
                            fontSize: "1rem",
                            fontFamily: "serif",
                            fontStyle: "italic",
                            letterSpacing: "2px"
                        },
                        animation: { type: "marquee-right", duration: 20000 }
                    }
                ]
            },
            // ARTICLE LAYOUT
            {
                id: "article_section",
                type: "section",
                styles: {
                    padding: "100px 4rem",
                    backgroundColor: "#fff",
                    display: "flex",
                    gap: "4rem",
                    alignItems: "flex-start"
                },
                children: [
                    {
                        id: "sticky_title",
                        type: "text",
                        content: "ICONIC\nMOMENTS",
                        styles: {
                            width: "30%",
                            fontSize: "3rem",
                            fontFamily: "serif",
                            position: "sticky",
                            top: "100px",
                            color: "#000" // Fixed visibility
                        }
                    },
                    {
                        id: "content_col",
                        type: "container",
                        styles: {
                            width: "70%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "3rem"
                        },
                        children: [
                            {
                                id: "gallery_img_1",
                                type: "image",
                                content: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=1000&q=80",
                                styles: { width: "100%", height: "500px", objectFit: "cover", borderRadius: "0px" },
                                animation: { type: "fade-up", duration: 800 }
                            },
                            {
                                id: "pull_quote",
                                type: "text",
                                content: "\"La moda es el lenguaje instantáneo.\"",
                                styles: {
                                    fontSize: "2rem",
                                    fontFamily: "serif",
                                    fontStyle: "italic",
                                    textAlign: "center",
                                    padding: "2rem 0",
                                    borderTop: "1px solid #eee",
                                    borderBottom: "1px solid #eee",
                                    color: "#111" // Fixed visibility
                                }
                            },
                            {
                                id: "gallery_img_2",
                                type: "image",
                                content: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1000&q=80",
                                styles: { width: "100%", height: "600px", objectFit: "cover", borderRadius: "0px" },
                                animation: { type: "fade-up", duration: 800 }
                            }
                        ]
                    }
                ]
            },
            // CREDITS SECTION
            {
                id: "credits_section",
                type: "section",
                styles: {
                    padding: "40px 4rem",
                    backgroundColor: "#fff",
                    borderTop: "1px solid #eee",
                    fontSize: "0.9rem",
                    color: "#666",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "20px"
                },
                children: [
                    { id: "cred_1", type: "text", content: "PHOTOGRAPHY\nMario Sorrenti" },
                    { id: "cred_2", type: "text", content: "STYLING\nAlastair McKimm" },
                    { id: "cred_3", type: "text", content: "HAIR\nBob Recine" }
                ]
            },
            // RELATED ARTICLES
            {
                id: "related_articles",
                type: "section",
                styles: {
                    padding: "60px 4rem",
                    backgroundColor: "#f9f9f9"
                },
                children: [
                    { id: "related_title", type: "text", content: "READ MORE", styles: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "30px", color: "#000" } }, // Fixed visibility
                    {
                        id: "related_grid",
                        type: "container",
                        styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
                        children: [
                            { id: "rel_1", type: "image", content: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=60", styles: { height: "300px", objectFit: "cover", marginBottom: "10px" } },
                            { id: "rel_2", type: "image", content: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=60", styles: { height: "300px", objectFit: "cover", marginBottom: "10px" } },
                            { id: "rel_3", type: "image", content: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=60", styles: { height: "300px", objectFit: "cover", marginBottom: "10px" } }
                        ]
                    }
                ]
            },
            // FOOTER Minimal
            {
                id: "footer_ed",
                type: "section",
                styles: {
                    backgroundColor: "#f4f4f4",
                    padding: "60px",
                    textAlign: "center"
                },
                children: [
                    {
                        id: "footer_logo",
                        type: "text",
                        content: "i-D",
                        styles: {
                            fontSize: "5rem",
                            fontWeight: "bold",
                            fontFamily: "serif",
                            marginBottom: "1rem",
                            color: "#000"
                        }
                    },
                    {
                        id: "footer_credit",
                        type: "text",
                        content: "Made with E-ToolMerce by Juan Ignacio Vera",
                        styles: { fontSize: "0.8rem", color: "#666" }
                    }
                ]
            }
        ]
    }
};
