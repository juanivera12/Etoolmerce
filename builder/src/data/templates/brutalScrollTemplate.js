export const BrutalScrollTemplate = {
    id: "template_brutal_scroll",
    title: "Brutal Scroll Animation",
    description: "Diseño de alto impacto con animaciones de scroll, tipografía gigante y galería 3D.",
    author: "Juan Ignacio Vera",
    author_name: "Juan Ignacio Vera", // Ensure compatibility with card
    category: "Destacado",
    thumbnailSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=60",
    structure_json: {
        id: "root",
        type: "page",
        children: [
            // HERO SECTION
            {
                id: "hero_brutal",
                type: "hero",
                styles: {
                    backgroundColor: "#000000",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                },
                backgroundConfig: {
                    type: "solid",
                    ambientType: "noise", // grainy texture
                    ambientOpacity: 0.1
                },
                children: [
                    {
                        id: "hero_title_1",
                        type: "text",
                        content: "DISEÑO",
                        styles: {
                            fontSize: "12rem",
                            fontWeight: "900",
                            color: "#ffffff",
                            lineHeight: "0.8",
                            letterSpacing: "-5px",
                            textAlign: "center",
                            textTransform: "uppercase"
                        },
                        animation: { type: "zoom-in", duration: 1000 }
                    },
                    {
                        id: "hero_title_2",
                        type: "text",
                        content: "BRUTAL",
                        styles: {
                            fontSize: "12rem",
                            fontWeight: "900",
                            color: "transparent",
                            WebkitTextStroke: "2px #b0ff00", // Neon Green Stroke
                            lineHeight: "0.8",
                            letterSpacing: "-5px",
                            textAlign: "center",
                            textTransform: "uppercase"
                        },
                        animation: { type: "zoom-in", duration: 1000, delay: 200 }
                    },
                    {
                        id: "hero_subtitle",
                        type: "text",
                        content: "DESPLAZA PARA EXPLORAR",
                        styles: {
                            color: "#b0ff00",
                            marginTop: "2rem",
                            fontFamily: "monospace",
                            letterSpacing: "4px"
                        },
                        animation: { type: "fade-up", duration: 1000, delay: 500 }
                    }
                ]
            },
            // MARQUEE STRIP
            {
                id: "marquee_strip",
                type: "section",
                styles: {
                    backgroundColor: "#b0ff00",
                    padding: "20px 0",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex" // Ensure flex for marquee alignment if needed
                },
                children: [
                    {
                        id: "marquee_text",
                        type: "text",
                        content: "ANIMACIÓN SCROLL • INTERACTIVO • GALERÍA 3D • EFECTO PARALLAX • ANIMACIÓN SCROLL • INTERACTIVO • GALERÍA 3D • EFECTO PARALLAX • ANIMACIÓN SCROLL • INTERACTIVO • GALERÍA 3D • EFECTO PARALLAX •",
                        styles: {
                            color: "#000",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            fontFamily: "monospace",
                            display: "inline-block" // Required for transform
                        },
                        // We could add a continuous scroll animation if we had a marquee block, for now static or simple animation
                        animation: { type: "marquee-left", duration: 20000 }
                    }
                ]
            },
            // 3D GALLERY SECTION
            {
                id: "gallery_section",
                type: "section",
                styles: {
                    backgroundColor: "#111",
                    padding: "100px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                },
                children: [
                    {
                        id: "gallery_title",
                        type: "text",
                        content: "GALERÍA 3D",
                        styles: {
                            color: "#fff",
                            fontSize: "3rem",
                            fontWeight: "bold",
                            marginBottom: "50px",
                            textAlign: "center"
                        },
                        animation: { type: "fade-up" }
                    },
                    {
                        id: "my_3d_gallery",
                        type: "threeDGallery", // The new component
                        data: {
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            shadow: true,
                            images: [
                                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
                                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
                                "https://images.unsplash.com/photo-1535376472810-5d229c65da09?auto=format&fit=crop&w=600&q=80",
                                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                            ]
                        }
                    }
                ]
            },
            // PARALLAX GRID
            {
                id: "grid_section",
                type: "section",
                styles: {
                    backgroundColor: "#000",
                    padding: "100px 20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "40px"
                },
                children: [
                    {
                        id: "grid_item_1",
                        type: "image",
                        content: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                        styles: {
                            width: "100%",
                            height: "400px",
                            objectFit: "cover",
                            borderRadius: "0px",
                            filter: "grayscale(100%) hover:grayscale(0%)",
                            transition: "filter 0.5s"
                        },
                        animation: { type: "fade-right", duration: 1000 }
                    },
                    {
                        id: "grid_text_1",
                        type: "text",
                        content: "ESTÉTICA MINIMALISTA\n\nMenos es más. Centrándose en el contenido puro y la tipografía audaz.",
                        styles: {
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            lineHeight: "1.6"
                        },
                        animation: { type: "fade-left", duration: 1000, delay: 200 }
                    },
                    {
                        id: "grid_text_2",
                        type: "text",
                        content: "ALTO CONTRASTE\n\nUsando colores extremos para crear jerarquía visual e impacto.",
                        styles: {
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            lineHeight: "1.6",
                            textAlign: "right"
                        },
                        animation: { type: "fade-right", duration: 1000, delay: 200 }
                    },
                    {
                        id: "grid_item_2",
                        type: "image",
                        content: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
                        styles: {
                            width: "100%",
                            height: "400px",
                            objectFit: "cover",
                            borderRadius: "0px"
                        },
                        animation: { type: "fade-left", duration: 1000 }
                    }
                ]
            },
            // MANIFESTO SECTION
            {
                id: "manifesto_section",
                type: "section",
                styles: {
                    backgroundColor: "#111",
                    padding: "100px 40px",
                    textAlign: "center"
                },
                children: [
                    {
                        id: "manifesto_title",
                        type: "text",
                        content: "ROMPE LAS REGLAS",
                        styles: {
                            color: "#b0ff00",
                            fontSize: "2rem",
                            marginBottom: "20px",
                            fontFamily: "monospace"
                        }
                    },
                    {
                        id: "manifesto_text",
                        type: "text",
                        content: "Las experiencias digitales deben ser memorables. Rechazamos lo aburrido. Abrazamos lo audaz. Únete a la revolución del diseño brutalista.",
                        styles: {
                            color: "#fff",
                            fontSize: "3rem",
                            fontWeight: "bold",
                            lineHeight: "1.2",
                            maxWidth: "800px",
                            margin: "0 auto"
                        },
                        animation: { type: "zoom-in", duration: 1000 }
                    }
                ]
            },
            // BIG IMAGES GRID
            {
                id: "team_section",
                type: "section",
                styles: {
                    backgroundColor: "#000",
                    padding: "100px 0",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px"
                },
                children: [
                    { id: "img_g1", type: "image", content: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04", styles: { height: "400px", objectFit: "cover", filter: "grayscale(100%)" } },
                    { id: "img_g2", type: "image", content: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", styles: { height: "400px", objectFit: "cover", filter: "grayscale(100%)" } },
                    { id: "img_g3", type: "image", content: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", styles: { height: "400px", objectFit: "cover", filter: "grayscale(100%)" } }
                ]
            },
            // FOOTER call to action
            {
                id: "cta_footer",
                type: "section",
                styles: {
                    backgroundColor: "#b0ff00",
                    height: "50vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: [
                    {
                        id: "cta_btn",
                        type: "button",
                        content: "EMPEZAR A CREAR",
                        styles: {
                            backgroundColor: "#000",
                            color: "#fff",
                            padding: "20px 60px",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "0px",
                            cursor: "pointer"
                        },
                        animation: { type: "pulse", duration: 2000 }
                    }
                ]
            }
        ]
    }
};
