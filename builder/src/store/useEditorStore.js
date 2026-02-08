import { create } from 'zustand';


const createPage = (name, isHome = false) => ({
    id: isHome ? 'root' : `page-${Date.now()}`,
    name: name,
    slug: isHome ? 'index' : name.toLowerCase().replace(/\s+/g, '-'),
    content: {
        id: isHome ? "root" : `root-${Date.now()}`,
        type: "page",
        styles: {
            backgroundColor: "#121212",
            fontFamily: "Inter, sans-serif",
            minHeight: "100vh",
            padding: "0px",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            position: "relative",
            isolation: "isolate"
        },
        children: isHome ? [
            {
                id: "hero-1",
                type: "section",
                styles: {
                    padding: "60px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1E1E1E",
                    borderRadius: "12px",
                    border: "1px dashed #cbd5e1",
                    gap: "16px"
                },
                children: [
                    {
                        id: "text-1",
                        type: "text",
                        content: "Bienvenido a tu Tienda",
                        styles: {
                            fontSize: "48px",
                            fontWeight: "800",
                            color: "#FFFFFF",
                            textAlign: "center"
                        }
                    },
                    {
                        id: "text-2",
                        type: "text",
                        content: "Arrastra elementos aquí para construir tu tienda ideal.",
                        styles: {
                            fontSize: "18px",
                            color: "#9CA3AF",
                            textAlign: "center"
                        }
                    }
                ]
            }
        ] : [
            {
                id: `section-${Date.now()}`,
                type: "section",
                styles: {
                    padding: "60px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1E1E1E",
                    border: "1px dashed #e2e8f0",
                    gap: "16px",
                    minHeight: "300px",
                    position: "relative"
                },
                children: [
                    {
                        id: `title-${Date.now()}`,
                        type: "text",
                        content: name,
                        styles: { fontSize: "32px", fontWeight: "700", color: "#334155" }
                    },
                    {
                        id: `subtitle-${Date.now()}`,
                        type: "text",
                        content: "Página vacía. Arrastra elementos desde la izquierda.",
                        styles: { fontSize: "16px", color: "#94a3b8" }
                    }
                ]
            }
        ]
    }
});

const initialHome = createPage("Inicio", true);

const createNode = (type, customStyles = {}) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


    const baseStyles = {
        position: 'relative',
        zIndex: '10'
    };


    let node = {
        id,
        type,
        className: '',
        styles: {
            padding: "10px",
            ...baseStyles,
            ...customStyles
        },
        children: []
    };

    switch (type) {

        case 'header':
            return {
                id, type,
                content: "Tu E-commerce",
                className: "bg-surface text-text border-b border-border",
                styles: {
                    backgroundColor: "#1E1E1E",
                    color: "#FFFFFF",
                    padding: "16px 32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    borderBottom: "1px solid #333",
                    ...baseStyles
                },
                children: [
                    {
                        id: `${id}-brand`,
                        type: "container",
                        styles: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "transparent" },
                        children: [

                            { id: `${id}-logo-icon`, type: "icon", content: "Store", styles: { fontSize: "24px", color: "#FFD700" } },
                            { id: `${id}-logo-text`, type: "text", content: "Tu E-commerce", styles: { fontSize: "20px", fontWeight: "bold", color: "#FFFFFF" } }
                        ]
                    },
                    {
                        id: `${id}-nav`,
                        type: "container",
                        layoutMode: "stack",
                        styles: {
                            display: "flex",
                            gap: "24px",
                            backgroundColor: "transparent"
                        },
                        children: [
                            { id: `${id}-link1`, type: "link", content: "Inicio", href: "#", styles: { color: "#FFFFFF", textDecoration: "none", fontWeight: "500" } },
                            { id: `${id}-link2`, type: "link", content: "Productos", href: "#", styles: { color: "#B0B0B0", textDecoration: "none" } },
                            { id: `${id}-link3`, type: "link", content: "Contacto", href: "#", styles: { color: "#B0B0B0", textDecoration: "none" } }
                        ]
                    }
                ]
            };
        case 'section':
        case 'container':
            return {
                id,
                type,
                styles: {
                    padding: "20px",
                    minHeight: "100px",
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    border: "none",
                    gap: "10px",
                    ...baseStyles,
                    ...customStyles
                },
                layoutMode: 'stack',
                children: []
            };

        case 'header':
            return {
                id, type,
                styles: {
                    width: '100%',
                    padding: '16px 40px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: '100',
                    ...customStyles
                },
                children: [
                    {
                        id: `${id}-logo`,
                        type: 'image',
                        content: 'https://via.placeholder.com/120x40?text=LOGO',
                        styles: { width: '120px', height: 'auto', objectFit: 'contain' }
                    },
                    {
                        id: `${id}-nav`, type: 'container',
                        styles: { display: 'flex', gap: '32px', alignItems: 'center' },
                        children: [
                            { id: `${id}-l1`, type: 'link', content: 'Inicio', href: '#' },
                            { id: `${id}-l2`, type: 'link', content: 'Productos', href: '#' },
                            { id: `${id}-l3`, type: 'link', content: 'Sobre Nosotros', href: '#' }
                        ]
                    },
                    {
                        id: `${id}-actions`, type: 'container',
                        styles: { display: 'flex', gap: '16px' },
                        children: [
                            { id: `${id}-search`, type: 'icon', content: 'Search', styles: { cursor: 'pointer', color: '#1e293b' } }
                        ]
                    }
                ]
            };

        case 'footer':
            return {
                id, type,
                styles: {
                    width: '100%',
                    padding: '60px 40px 20px',
                    backgroundColor: '#111111',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    position: 'relative',
                    marginTop: 'auto',
                    ...customStyles
                },
                children: [

                    {
                        id: `${id}-cols`, type: 'container',
                        styles: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            width: '100%',
                            flexWrap: 'wrap',
                            gap: '40px'
                        },
                        children: [

                            {
                                id: `${id}-c1`, type: 'container', styles: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [
                                    { id: `${id}-c1-1`, type: 'text', content: 'BUSCAR TIENDA', styles: { fontSize: '14px', fontWeight: '800', cursor: 'pointer' } },
                                    { id: `${id}-c1-2`, type: 'text', content: 'HACETE MIEMBRO', styles: { fontSize: '14px', fontWeight: '800', cursor: 'pointer' } },
                                    { id: `${id}-c1-3`, type: 'text', content: 'ENVÍO', styles: { fontSize: '14px', fontWeight: '800', cursor: 'pointer' } }
                                ]
                            },

                            {
                                id: `${id}-c2`, type: 'container', styles: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [
                                    { id: `${id}-c2-h`, type: 'text', content: 'AYUDA', styles: { fontSize: '14px', fontWeight: '800', marginBottom: '4px' } },
                                    { id: `${id}-c2-1`, type: 'text', content: 'Envíos y entregas', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-c2-2`, type: 'text', content: 'Devoluciones', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-c2-3`, type: 'text', content: 'Contacto', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } }
                                ]
                            },

                            {
                                id: `${id}-c3`, type: 'container', styles: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [
                                    { id: `${id}-c3-h`, type: 'text', content: 'ACERCA DE', styles: { fontSize: '14px', fontWeight: '800', marginBottom: '4px' } },
                                    { id: `${id}-c3-1`, type: 'text', content: 'Noticias', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-c3-2`, type: 'text', content: 'Inversores', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-c3-3`, type: 'text', content: 'Sustentabilidad', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } }
                                ]
                            },

                            {
                                id: `${id}-soc`, type: 'container', styles: { display: 'flex', gap: '16px' }, children: [
                                    { id: `${id}-s1`, type: 'icon', content: 'Twitter', styles: { color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-s2`, type: 'icon', content: 'Facebook', styles: { color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-s3`, type: 'icon', content: 'Youtube', styles: { color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-s4`, type: 'icon', content: 'Instagram', styles: { color: '#7e7e7e', cursor: 'pointer' } }
                                ]
                            }
                        ]
                    },

                    {
                        id: `${id}-legal`, type: 'container',
                        styles: {
                            borderTop: '1px solid #333333',
                            paddingTop: '20px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '20px'
                        },
                        children: [
                            { id: `${id}-copy`, type: 'text', content: '© 2024 EToolMerce, Inc. Todos los derechos reservados.', styles: { fontSize: '12px', color: '#7e7e7e' } },
                            {
                                id: `${id}-lnks`, type: 'container', styles: { display: 'flex', gap: '20px' }, children: [
                                    { id: `${id}-lgl1`, type: 'text', content: 'Guías', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-lgl2`, type: 'text', content: 'Términos de Uso', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } },
                                    { id: `${id}-lgl3`, type: 'text', content: 'Política de Privacidad', styles: { fontSize: '12px', color: '#7e7e7e', cursor: 'pointer' } }
                                ]
                            }
                        ]
                    }
                ]
            };

        case 'text': {
            const { styles: passedStyles = {}, ...restProps } = customStyles;
            return {
                id,
                type,
                content: "Edita este texto",
                children: [],
                ...restProps,
                styles: {
                    fontSize: "16px",
                    color: "#334155",
                    padding: "8px",
                    ...baseStyles,
                    ...passedStyles
                }
            };
        }


        case 'image': {
            const { styles: passedStyles = {}, ...restProps } = customStyles;
            return {
                id,
                type,
                content: "https://via.placeholder.com/300x200",
                children: [],
                ...restProps,
                styles: {
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                    ...baseStyles,
                    ...passedStyles
                }
            };
        }
        case 'video': {
            const { styles: passedStyles = {}, ...restProps } = customStyles;
            return {
                id,
                type,
                content: "https://www.w3schools.com/html/mov_bbb.mp4",
                children: [],
                ...restProps,
                styles: {
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                    ...baseStyles,
                    ...passedStyles
                }
            };
        }
        case 'product':
            return {
                id,
                type,
                styles: {
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "250px",
                    ...baseStyles
                },
                children: [
                    {
                        id: `${id}-img`,
                        type: 'image',
                        content: "https://via.placeholder.com/200",
                        styles: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }
                    },
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Título del Producto",
                        styles: { fontSize: "18px", fontWeight: "bold", color: "#334155" }
                    },
                    {
                        id: `${id}-price`,
                        type: 'text',
                        content: "$99.00",
                        styles: { fontSize: "16px", color: "#4f46e5" }
                    }
                ]
            };
        case 'hero':
            return {
                id,
                type: 'section',
                styles: {
                    padding: "80px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1e293b",
                    color: "white",
                    gap: "24px",
                    textAlign: "center",
                    ...baseStyles
                },
                children: [
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Título Impactante",
                        styles: { fontSize: "48px", fontWeight: "800", marginBottom: "16px" }
                    },
                    {
                        id: `${id}-desc`,
                        type: 'text',
                        content: "Subtítulo descriptivo para captar la atención del cliente.",
                        styles: { fontSize: "20px", color: "#cbd5e1", maxWidth: "600px" }
                    },
                    {
                        id: `${id}-btn`,
                        type: 'text',
                        content: "Comprar Ahora",
                        styles: {
                            padding: "12px 32px",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            borderRadius: "8px",
                            fontWeight: "600",
                            marginTop: "16px",
                            cursor: "pointer"
                        }
                    }
                ]
            };
        case 'card':
            return {
                id,
                type: 'container',
                styles: {
                    padding: "24px",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    width: "300px",
                    border: "1px solid #e2e8f0",
                    ...baseStyles
                },
                children: [
                    {
                        id: `${id}-icon`,
                        type: 'text',
                        content: "✨",
                        styles: { fontSize: "40px" }
                    },
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Característica",
                        styles: { fontSize: "24px", fontWeight: "bold", color: "#1e293b" }
                    },
                    {
                        id: `${id}-text`,
                        type: 'text',
                        content: "Descripción breve de la característica o servicio ofrecido.",
                        styles: { fontSize: "16px", color: "#64748b" }
                    }
                ]
            };

        case 'spacer':
            return {
                id, type,
                styles: { height: '50px', width: '100%', backgroundColor: 'transparent', ...baseStyles }
            };
        case 'icon': {
            const { styles: passedStyles = {}, ...restProps } = customStyles;
            return {
                id, type,
                content: 'Star',
                ...restProps,
                styles: {
                    fontSize: '24px',
                    color: '#64748b',
                    display: 'inline-block',
                    width: '48px',
                    height: '48px',
                    ...baseStyles,
                    ...passedStyles
                }
            };
        }
        case 'accordion':
            return {
                id, type,
                content: 'Título del Acordeón',
                styles: {
                    width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden',
                    backgroundColor: 'white', display: 'flex', flexDirection: 'column', ...baseStyles
                },
                children: [
                    { id: `${id}-content`, type: 'container', styles: { padding: '16px', backgroundColor: '#f8fafc', minHeight: '50px' } }
                ]
            };
        case 'newsletter':
            return {
                id, type,
                styles: {
                    width: '100%',
                    padding: '40px 20px',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    borderRadius: '8px',
                    ...baseStyles
                },
                children: [
                    { id: `${id}-title`, type: 'text', content: 'Suscríbete a nuestro Newsletter', styles: { fontSize: '20px', fontWeight: 'bold' } },
                    { id: `${id}-desc`, type: 'text', content: 'Recibe las mejores ofertas y novedades directamente en tu email.', styles: { fontSize: '14px', color: '#64748b', textAlign: 'center' } },
                    {
                        id: `${id}-form`, type: 'container',
                        styles: { display: 'flex', gap: '10px', width: '100%', maxWidth: '400px' },
                        children: [
                            { id: `${id}-input`, type: 'input', inputType: 'email', placeholder: 'Tu correo electrónico', styles: { flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' } },
                            { id: `${id}-btn`, type: 'button', content: 'Suscribirse', styles: { padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '4px', fontWeight: 'bold' } }
                        ]
                    }
                ]
            };
        case 'carousel':
            return {
                id, type,
                styles: { width: '100%', height: '400px', position: 'relative', overflow: 'hidden', ...baseStyles, ...customStyles },
                data: {
                    slides: [
                        { id: 's1', src: 'https://placehold.co/800x400?text=Slide+1' },
                        { id: 's2', src: 'https://placehold.co/800x400?text=Slide+2' },
                        { id: 's3', src: 'https://placehold.co/800x400?text=Slide+3' }
                    ],
                    autoplayEnabled: true,
                    autoplayDelay: 3000,
                    showArrows: true,
                    showDots: true,
                    effect: 'slide'
                },
                children: []
            };
        case 'tabs':
            return {
                id, type,
                styles: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0', ...baseStyles },
                children: [
                    {
                        id: `${id}-header`, type: 'container',
                        styles: { display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0', backgroundColor: '#f1f5f9' },
                        children: [
                            { id: `${id}-btn1`, type: 'text', content: 'Tab 1', styles: { padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', color: '#4f46e5', borderBottom: '2px solid #4f46e5' } },
                            { id: `${id}-btn2`, type: 'text', content: 'Tab 2', styles: { padding: '10px 20px', cursor: 'pointer', color: '#64748b' } }
                        ]
                    },
                    { id: `${id}-content`, type: 'container', styles: { padding: '20px', border: '1px solid #e2e8f0', borderTop: 'none', backgroundColor: 'white', minHeight: '100px' } }
                ]
            };
        case 'productGrid':
            return {
                id, type,
                layoutMode: 'grid',
                styles: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    width: '100%',
                    padding: '20px',
                    ...baseStyles
                },
                children: [
                    {
                        id: `${id}-p1`, type: 'product',
                        styles: { padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "12px", width: "100%" },
                        children: [
                            { id: `${id}-p1-img`, type: 'image', content: "https://via.placeholder.com/200", styles: { width: "100%", height: "200px", objectFit: "cover" } },
                            { id: `${id}-p1-t`, type: 'text', content: "Producto 1", styles: { fontSize: "16px", fontWeight: "bold", color: "#334155" } },
                            { id: `${id}-p1-p`, type: 'text', content: "$49.00", styles: { color: "#4f46e5" } }
                        ]
                    },
                    {
                        id: `${id}-p2`, type: 'product',
                        styles: { padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "12px", width: "100%" },
                        children: [
                            { id: `${id}-p2-img`, type: 'image', content: "https://via.placeholder.com/200", styles: { width: "100%", height: "200px", objectFit: "cover" } },
                            { id: `${id}-p2-t`, type: 'text', content: "Producto 2", styles: { fontSize: "16px", fontWeight: "bold", color: "#334155" } },
                            { id: `${id}-p2-p`, type: 'text', content: "$59.00", styles: { color: "#4f46e5" } }
                        ]
                    },
                    {
                        id: `${id}-p3`, type: 'product',
                        styles: { padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "12px", width: "100%" },
                        children: [
                            { id: `${id}-p3-img`, type: 'image', content: "https://via.placeholder.com/200", styles: { width: "100%", height: "200px", objectFit: "cover" } },
                            { id: `${id}-p3-t`, type: 'text', content: "Producto 3", styles: { fontSize: "16px", fontWeight: "bold", color: "#334155" } },
                            { id: `${id}-p3-p`, type: 'text', content: "$69.00", styles: { color: "#4f46e5" } }
                        ]
                    }
                ]
            };
        case 'checkout':
            return {
                id,
                type,
                styles: {
                    padding: "20px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                    width: "100%",
                    maxWidth: "400px",
                    margin: "0 auto",
                    ...baseStyles,
                    ...customStyles
                },
                mercadoPago: {
                    publicKey: '',
                    accessToken: '',
                    autoRedirect: false
                },
                children: [
                    {
                        id: `${id}-title`,
                        type: 'text',
                        content: "Finalizar Compra",
                        styles: { fontSize: "20px", fontWeight: "bold", color: "#0f172a" }
                    },
                    {
                        id: `${id}-summary`,
                        type: 'text',
                        content: "Total a pagar: $120.00",
                        styles: { fontSize: "16px", color: "#64748b", marginBottom: "8px" }
                    },
                    {
                        id: `${id}-btn`,
                        type: 'button',
                        content: "Pagar con Mercado Pago",
                        styles: {
                            padding: "12px 24px",
                            backgroundColor: "#009ee3", // MP Blue
                            color: "white",
                            borderRadius: "6px",
                            fontWeight: "600",
                            width: "100%",
                            cursor: "pointer",
                            border: "none",
                            fontSize: "16px"
                        }
                    },
                    {
                        id: `${id}-secure`,
                        type: 'text',
                        content: "Pago procesado de forma segura",
                        styles: { fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }
                    }
                ]
            };
        case 'cartWidget':
            return {
                id, type,
                styles: {
                    position: 'relative', display: 'flex', alignItems: 'center', zIndex: '40',
                    ...baseStyles, zIndex: '40'
                },
                children: [

                    {
                        id: `${id}-btn`, type: 'container',
                        styles: {
                            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                            padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '12px',
                            backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease'
                        },
                        children: [
                            {
                                id: `${id}-icon`, type: 'icon',
                                content: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
                                styles: { color: '#0f172a' }
                            },
                            {
                                id: `${id}-info`, type: 'container',
                                styles: { display: 'flex', flexDirection: 'column', gap: '0', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-count`, type: 'text', content: '2 Items', styles: { fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' } },
                                    { id: `${id}-total`, type: 'text', content: '$120.00', styles: { fontSize: '14px', fontWeight: 'bold', color: '#0f172a' } }
                                ]
                            }
                        ]
                    },

                    {
                        id: `${id}-dropdown`, type: 'container',
                        styles: {
                            position: 'absolute', top: '120%', right: '0', width: '320px',
                            backgroundColor: 'white', borderRadius: '16px',
                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0', padding: '20px',
                            display: 'none', flexDirection: 'column', gap: '16px', zIndex: '50'
                        },
                        children: [
                            { id: `${id}-d-title`, type: 'text', content: 'Tu Carrito', styles: { fontSize: '16px', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' } },

                            {
                                id: `${id}-it1`, type: 'container',
                                styles: { display: 'flex', gap: '12px', alignItems: 'center', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-img1`, type: 'image', content: 'https://via.placeholder.com/60', styles: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' } },
                                    {
                                        id: `${id}-inf1`, type: 'container',
                                        styles: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, padding: 0, border: 'none', background: 'transparent' },
                                        children: [
                                            { id: `${id}-nm1`, type: 'text', content: 'Camiseta Básica', styles: { fontSize: '14px', fontWeight: '500', color: '#334155' } },
                                            { id: `${id}-pr1`, type: 'text', content: '$20.00 x 1', styles: { fontSize: '12px', color: '#64748b' } }
                                        ]
                                    }
                                ]
                            },

                            {
                                id: `${id}-it2`, type: 'container',
                                styles: { display: 'flex', gap: '12px', alignItems: 'center', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-img2`, type: 'image', content: 'https://via.placeholder.com/60', styles: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' } },
                                    {
                                        id: `${id}-inf2`, type: 'container',
                                        styles: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, padding: 0, border: 'none', background: 'transparent' },
                                        children: [
                                            { id: `${id}-nm2`, type: 'text', content: 'Pantalón Vaquero', styles: { fontSize: '14px', fontWeight: '500', color: '#334155' } },
                                            { id: `${id}-pr2`, type: 'text', content: '$80.00 x 1', styles: { fontSize: '12px', color: '#64748b' } }
                                        ]
                                    }
                                ]
                            },
                            { id: `${id}-div`, type: 'divider', styles: { margin: '8px 0' } },
                            {
                                id: `${id}-actions`, type: 'container',
                                styles: { display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-checkout`, type: 'button', content: 'Pagar Ahora ($120.00)', styles: { width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', borderRadius: '8px', fontWeight: '600' } },
                                    { id: `${id}-view`, type: 'text', content: 'Ver Carrito Completo', styles: { width: '100%', textAlign: 'center', fontSize: '13px', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' } }
                                ]
                            }
                        ]
                    }
                ]
            };
        case 'searchBar':
            return {
                id, type,
                styles: {
                    position: 'relative', width: '100%', maxWidth: '300px', zIndex: '30'
                },
                children: [
                    {
                        id: `${id}-container`, type: 'container',
                        styles: {
                            display: 'flex', alignItems: 'center', backgroundColor: 'white',
                            borderRadius: '8px', padding: '12px 16px', width: '100%',
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        },
                        children: [
                            {
                                id: `${id}-input`, type: 'input', content: '', placeholder: 'Buscar productos...',
                                styles: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', flex: 1, color: '#334155', width: '100%' }
                            },
                            {
                                id: `${id}-icon`, type: 'icon',
                                content: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
                                styles: { color: '#cbd5e1', cursor: 'pointer' }
                            }
                        ]
                    },

                    {
                        id: `${id}-results`, type: 'container',
                        styles: {
                            position: 'absolute', top: '110%', left: '0', width: '100%',
                            backgroundColor: 'white', borderRadius: '12px',
                            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0', padding: '16px',
                            display: 'none', flexDirection: 'column', gap: '12px', zIndex: '50'
                        },
                        children: [
                            { id: `${id}-r-title`, type: 'text', content: 'Sugerencias', styles: { fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' } },
                            {
                                id: `${id}-r1`, type: 'container',
                                styles: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', ':hover': { backgroundColor: '#f1f5f9' } },
                                children: [
                                    { id: `${id}-img1`, type: 'image', content: 'https://via.placeholder.com/40', styles: { width: '32px', height: '32px', borderRadius: '6px' } },
                                    { id: `${id}-txt1`, type: 'text', content: 'Zapatillas Running', styles: { fontSize: '14px', color: '#334155' } }
                                ]
                            },
                            {
                                id: `${id}-r2`, type: 'container',
                                styles: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', ':hover': { backgroundColor: '#f1f5f9' } },
                                children: [
                                    { id: `${id}-img2`, type: 'image', content: 'https://via.placeholder.com/40', styles: { width: '32px', height: '32px', borderRadius: '6px' } },
                                    { id: `${id}-txt2`, type: 'text', content: 'Camisa Oxford', styles: { fontSize: '14px', color: '#334155' } }
                                ]
                            },
                            { id: `${id}-all`, type: 'text', content: 'Ver todos los resultados', styles: { fontSize: '13px', color: '#4f46e5', textAlign: 'center', cursor: 'pointer', marginTop: '4px' } }
                        ]
                    }
                ]
            };
        case 'breadcrumbs':
            return {
                id, type,
                styles: { display: 'flex', gap: '8px', fontSize: '14px', color: '#64748b', padding: '10px 0' },
                children: [
                    { id: `${id}-1`, type: 'text', content: 'Inicio', styles: { cursor: 'pointer', textDecoration: 'underline' } },
                    { id: `${id}-sep1`, type: 'text', content: '>', styles: { textDecoration: 'none', opacity: 0.5 } },
                    { id: `${id}-2`, type: 'text', content: 'Ropa', styles: { cursor: 'pointer', textDecoration: 'underline' } },
                    { id: `${id}-sep2`, type: 'text', content: '>', styles: { textDecoration: 'none', opacity: 0.5 } },
                    { id: `${id}-3`, type: 'text', content: 'Camisetas', styles: { color: '#0f172a', fontWeight: '600' } },
                ]
            };
        case 'countdown':
            return {
                id, type,
                targetDate: new Date(Date.now() + 86400000).toISOString(),
                styles: {
                    display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', padding: '20px',
                    backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px'
                },
                children: [
                    { id: `${id}-h`, type: 'text', content: '23', styles: { fontSize: '32px', fontWeight: 'bold', color: '#ea580c', lineHeight: 1 } },
                    { id: `${id}-sep1`, type: 'text', content: ':', styles: { fontSize: '24px', fontWeight: 'bold', color: '#fed7aa', marginBottom: '4px' } },
                    { id: `${id}-m`, type: 'text', content: '59', styles: { fontSize: '32px', fontWeight: 'bold', color: '#ea580c', lineHeight: 1 } },
                    { id: `${id}-sep2`, type: 'text', content: ':', styles: { fontSize: '24px', fontWeight: 'bold', color: '#fed7aa', marginBottom: '4px' } },
                    { id: `${id}-s`, type: 'text', content: '00', styles: { fontSize: '32px', fontWeight: 'bold', color: '#ea580c', lineHeight: 1 } }
                ]
            };
        case 'promoBanner':
            return {
                id, type,
                styles: {
                    width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '12px',
                    textAlign: 'center', fontSize: '14px', fontWeight: '500',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                },
                children: [
                    { id: `${id}-txt`, type: 'text', content: '🎉 Oferta Flash: ¡Envío GRATIS en compras +$50!', styles: { color: 'white' } },
                ]
            };
        case 'testimonial':
            return {
                id, type,
                styles: {
                    padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0',
                    width: '320px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                },
                children: [
                    { id: `${id}-stars`, type: 'text', content: '⭐⭐⭐⭐⭐', styles: { fontSize: '18px' } },
                    { id: `${id}-quote`, type: 'text', content: '"La calidad de la tela es increíble y el envío fue súper rápido. Definitivamente volveré a comprar aquí."', styles: { fontSize: '15px', fontStyle: 'italic', color: '#475569', lineHeight: '1.5' } },
                    {
                        id: `${id}-author-cont`, type: 'container',
                        styles: { display: 'flex', alignItems: 'center', gap: '12px', padding: 0, background: 'transparent', border: 'none' },
                        children: [
                            { id: `${id}-avatar`, type: 'image', content: 'https://i.pravatar.cc/150?img=32', styles: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' } },
                            { id: `${id}-name`, type: 'text', content: 'Maria García', styles: { fontSize: '14px', fontWeight: 'bold', color: '#0f172a' } }
                        ]
                    }
                ]
            };
        case 'menu':
            return {
                id, type,
                styles: { display: 'flex', gap: '30px', alignItems: 'center', padding: '10px' },
                children: [
                    { id: `${id}-1`, type: 'link', content: 'Inicio', styles: { color: '#0f172a', fontWeight: '500', textDecoration: 'none' } },
                    { id: `${id}-2`, type: 'link', content: 'Colección', styles: { color: '#64748b', fontWeight: '500', textDecoration: 'none' } },
                    { id: `${id}-3`, type: 'link', content: 'Rebajas', styles: { color: '#ef4444', fontWeight: '600', textDecoration: 'none' } },
                    { id: `${id}-4`, type: 'link', content: 'Ayuda', styles: { color: '#64748b', fontWeight: '500', textDecoration: 'none' } }
                ]
            };
        case 'filters':
            return {
                id, type,
                styles: {
                    width: '280px', padding: '24px', borderRight: '1px solid #f1f5f9',
                    display: 'flex', flexDirection: 'column', gap: '24px',
                    backgroundColor: 'white', height: '100%',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
                },
                children: [
                    {
                        id: `${id}-head`, type: 'container',
                        styles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-t`, type: 'text', content: 'Filtros', styles: { fontSize: '20px', fontWeight: 'bold', color: '#0f172a' } },
                            {
                                id: `${id}-icon`, type: 'icon',
                                content: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
                                styles: { color: '#94a3b8' }
                            }
                        ]
                    },
                    {
                        id: `${id}-cat`, type: 'container',
                        styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-cl`, type: 'text', content: 'Categoría', styles: { fontSize: '14px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' } },
                            { id: `${id}-c1`, type: 'checkbox', content: 'Ropa Hombre', checked: false, styles: { fontSize: '14px', color: '#64748b' } },
                            { id: `${id}-c2`, type: 'checkbox', content: 'Ropa Mujer', checked: false, styles: { fontSize: '14px', color: '#64748b' } },
                            { id: `${id}-c3`, type: 'checkbox', content: 'Accesorios', checked: false, styles: { fontSize: '14px', color: '#64748b' } }
                        ]
                    },
                    { id: `${id}-div`, type: 'divider', styles: { opacity: 0.5, margin: '10px 0' } },
                    {
                        id: `${id}-pr`, type: 'container',
                        styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-pl`, type: 'text', content: 'Rango de Precio', styles: { fontSize: '14px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' } },
                            {
                                id: `${id}-range`, type: 'container',
                                styles: { width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', position: 'relative', marginTop: '10px' },
                                children: [
                                    { id: `${id}-fill`, type: 'container', styles: { width: '60%', height: '100%', backgroundColor: '#4f46e5', borderRadius: '2px', position: 'absolute', top: 0, left: '0' } },
                                    { id: `${id}-knob`, type: 'container', styles: { width: '16px', height: '16px', backgroundColor: 'white', border: '2px solid #4f46e5', borderRadius: '50%', position: 'absolute', top: '-6px', left: '60%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }
                                ]
                            },
                            {
                                id: `${id}-labels`, type: 'container',
                                styles: { display: 'flex', justifyContent: 'space-between', marginTop: '4px', padding: 0, background: 'transparent', border: 'none' },
                                children: [
                                    { id: `${id}-min`, type: 'text', content: '$0', styles: { fontSize: '12px', color: '#94a3b8' } },
                                    { id: `${id}-max`, type: 'text', content: '$500', styles: { fontSize: '12px', color: '#94a3b8' } }
                                ]
                            }
                        ]
                    }
                ]
            };
        case 'pricingTable':
            return {
                id, type,
                styles: {
                    padding: '32px', border: '1px solid #e2e8f0', borderRadius: '24px',
                    display: 'flex', flexDirection: 'column', gap: '24px',
                    backgroundColor: 'white', width: '320px', alignItems: 'center',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease',
                    color: '#0f172a'
                },
                children: [
                    { id: `${id}-plan`, type: 'text', content: 'Pro', styles: { fontSize: '18px', fontWeight: '600', color: '#6366f1' } },
                    {
                        id: `${id}-price-cont`, type: 'container',
                        styles: { display: 'flex', alignItems: 'baseline', gap: '4px', padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-currency`, type: 'text', content: '$', styles: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a' } },
                            { id: `${id}-amt`, type: 'text', content: '49', styles: { fontSize: '48px', fontWeight: '800', color: '#0f172a', lineHeight: 1 } },
                            { id: `${id}-period`, type: 'text', content: '/mes', styles: { fontSize: '16px', color: '#64748b' } }
                        ]
                    },
                    { id: `${id}-div`, type: 'divider' },
                    {
                        id: `${id}-features`, type: 'container',
                        styles: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-f1`, type: 'checkbox', content: 'Usuarios Ilimitados', checked: true, styles: { pointerEvents: 'none', color: '#334155' } },
                            { id: `${id}-f2`, type: 'checkbox', content: '20GB Almacenamiento', checked: true, styles: { pointerEvents: 'none', color: '#334155' } },
                            { id: `${id}-f3`, type: 'checkbox', content: 'Soporte 24/7', checked: true, styles: { pointerEvents: 'none', color: '#334155' } }
                        ]
                    },
                    { id: `${id}-btn`, type: 'button', content: 'Comenzar Ahora', styles: { width: '100%', padding: '14px', borderRadius: '12px', fontSize: '16px' } }
                ]
            };
        case 'social':
            return {
                id, type,
                styles: { display: 'flex', gap: '16px', justifyContent: 'center', padding: '10px' },
                children: [
                    {
                        id: `${id}-fb`, type: 'icon',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
                        styles: { color: '#3b5998', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }
                    },
                    {
                        id: `${id}-tw`, type: 'icon',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
                        styles: { color: '#1DA1F2', cursor: 'pointer' }
                    },
                    {
                        id: `${id}-in`, type: 'icon',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
                        styles: { color: '#E1306C', cursor: 'pointer' }
                    },
                    {
                        id: `${id}-gh`, type: 'icon',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
                        styles: { color: '#333333', cursor: 'pointer' }
                    }
                ]
            };
        case 'price':
            return {
                id, type,
                content: '$99.00',
                styles: { fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', display: 'inline-block' }
            };
        case 'header':
            return {
                id,
                type,
                styles: {
                    order: '-9999',
                    width: '100%',
                    padding: "20px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #e2e8f0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    position: 'relative',
                    zIndex: '100',
                    ...customStyles
                },
                children: [

                    {
                        id: `${id}-brand`,
                        type: 'container',
                        styles: { display: "flex", alignItems: "center", gap: "12px", padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            {
                                id: `${id}-logo`,
                                type: 'image',
                                content: "",
                                styles: { width: "40px", height: "40px", objectFit: "contain" }
                            },
                            {
                                id: `${id}-title`,
                                type: 'text',
                                content: "Mi E-Commerce",
                                styles: { fontSize: "20px", fontWeight: "700", color: "#1e293b", letterSpacing: "-0.5px" }
                            }
                        ]
                    },

                    {
                        id: `${id}-nav`,
                        type: 'container',
                        styles: { display: "flex", gap: "32px", padding: '0', border: 'none', backgroundColor: 'transparent', alignItems: 'center', '@media (max-width: 768px)': { display: 'none' } },
                        children: [
                            { id: `${id}-l1`, type: 'text', content: "Inicio", styles: { fontSize: "15px", fontWeight: "500", color: "#64748b", cursor: 'pointer', transition: 'color 0.2s', ':hover': { color: '#4f46e5' } } },
                            { id: `${id}-l2`, type: 'text', content: "Productos", styles: { fontSize: "15px", fontWeight: "500", color: "#64748b", cursor: 'pointer', transition: 'color 0.2s', ':hover': { color: '#4f46e5' } } },
                            { id: `${id}-l3`, type: 'text', content: "Sobre Nosotros", styles: { fontSize: "15px", fontWeight: "500", color: "#64748b", cursor: 'pointer', transition: 'color 0.2s', ':hover': { color: '#4f46e5' } } }
                        ]
                    },

                    {
                        id: `${id}-bgr`,
                        type: 'icon',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
                        styles: { cursor: 'pointer', display: 'none', '@media (max-width: 768px)': { display: 'block' }, color: '#1e293b' }
                    },

                    {
                        id: `${id}-mob`,
                        type: 'container',
                        styles: {
                            position: 'absolute', top: '100%', left: 0, width: '100%',
                            backgroundColor: 'white', borderBottom: '1px solid #e2e8f0',
                            padding: '20px', display: 'none', flexDirection: 'column', gap: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        },
                        children: [
                            { id: `${id}-m1`, type: 'text', content: "Inicio", styles: { fontSize: "16px", fontWeight: "500", color: "#334155", padding: '8px' } },
                            { id: `${id}-m2`, type: 'text', content: "Productos", styles: { fontSize: "16px", fontWeight: "500", color: "#334155", padding: '8px' } },
                            { id: `${id}-m3`, type: 'text', content: "Sobre Nosotros", styles: { fontSize: "16px", fontWeight: "500", color: "#334155", padding: '8px' } }
                        ]
                    }
                ]
            };


        case 'form':
            return {
                id,
                type,
                styles: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: '#ffffff'
                },
                children: []
            };
        case 'input':
            return {
                id,
                type,
                content: '',
                placeholder: 'Escribe aquí...',
                inputType: 'text',
                styles: {
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    width: '100%',
                    backgroundColor: '#ffffff'
                }
            };
        case 'textarea':
            return {
                id,
                type,
                content: '',
                placeholder: 'Escribe tu mensaje...',
                styles: {
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    width: '100%',
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                }
            };
        case 'label':
            return {
                id,
                type,
                content: 'Etiqueta',
                styles: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#334155',
                    marginBottom: '6px',
                    display: 'block'
                }
            };
        case 'button':
            return {
                id,
                type,
                content: 'Botón',
                styles: {
                    padding: '10px 24px',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    width: 'auto',
                    display: 'inline-block'
                }
            };
        case 'checkbox':
            return {
                id,
                type,
                content: 'Opción',
                checked: false,
                styles: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#334155',
                    cursor: 'pointer'
                }
            };
        case 'select':
            return {
                id,
                type,
                options: 'Opción 1, Opción 2, Opción 3',
                styles: {
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                }
            };


        case 'link':
            return {
                id,
                type,
                content: 'Enlace de texto',
                href: '#',
                styles: {
                    color: '#4f46e5',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                }
            };
        case 'divider':
            return {
                id,
                type,
                styles: {
                    height: '1px',
                    backgroundColor: '#e2e8f0',
                    width: '100%',
                    margin: '24px 0',
                    border: 'none'
                }
            };

        case 'header':
            return {
                id,
                type,
                styles: {
                    order: '-9999',
                    width: '100%',
                    padding: '16px 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    zIndex: '50',
                    ...customStyles
                },
                children: [
                    {
                        id: `${id}-brand`,
                        type: 'container',
                        styles: { display: "flex", alignItems: "center", gap: "10px", padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-logo`, type: 'icon', content: 'Store', styles: { width: '28px', height: '28px', color: '#4f46e5' } },
                            { id: `${id}-title`, type: 'text', content: 'Mi Store', styles: { fontSize: "20px", fontWeight: "700", color: "#0f172a" } }
                        ]
                    },
                    {
                        id: `${id}-nav`,
                        type: 'container',
                        styles: { display: "flex", alignItems: "center", gap: "32px", padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-l1`, type: 'link', content: 'Inicio', href: '#', styles: { color: "#64748b", fontWeight: "500", fontSize: '14px' } },
                            { id: `${id}-l2`, type: 'link', content: 'Productos', href: '#', styles: { color: "#64748b", fontWeight: "500", fontSize: '14px' } },
                            { id: `${id}-l3`, type: 'link', content: 'Ofertas', href: '#', styles: { color: "#64748b", fontWeight: "500", fontSize: '14px' } },
                        ]
                    },
                    {
                        id: `${id}-actions`,
                        type: 'container',
                        styles: { display: "flex", alignItems: "center", gap: "16px", padding: 0, border: 'none', background: 'transparent' },
                        children: [
                            { id: `${id}-search`, type: 'icon', content: 'Search', styles: { width: '20px', height: '20px', color: '#64748b', cursor: 'pointer' } },
                            { id: `${id}-cart`, type: 'icon', content: 'ShoppingBag', styles: { width: '20px', height: '20px', color: '#64748b', cursor: 'pointer' } }
                        ]
                    }
                ]
            };

        case 'footer':
            return {
                id,
                type,
                styles: {
                    order: '9999',
                    marginTop: 'auto',
                    width: '100%',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    padding: '60px 20px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '60px',
                    ...customStyles
                },
                children: [

                    {
                        id: `${id}-top`,
                        type: 'container',
                        styles: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '40px',
                            width: '100%',
                            maxWidth: '1200px',
                            margin: '0 auto',
                            padding: 0,
                            background: 'transparent',
                            border: 'none',
                            alignItems: 'flex-start'
                        },
                        children: [

                            {
                                id: `${id}-c1`,
                                type: 'container',
                                styles: { display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-a1`, type: 'text', content: 'BUSCAR TIENDA', styles: { fontSize: '14px', fontWeight: '800', color: '#ffffff', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' } },
                                    { id: `${id}-a2`, type: 'text', content: 'HACETE MIEMBRO', styles: { fontSize: '14px', fontWeight: '800', color: '#ffffff', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' } },
                                    { id: `${id}-a3`, type: 'text', content: 'DESCUENTOS', styles: { fontSize: '14px', fontWeight: '800', color: '#ffffff', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' } },
                                ]
                            },

                            {
                                id: `${id}-c2`,
                                type: 'container',
                                styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-h1`, type: 'text', content: 'AYUDA', styles: { fontSize: '14px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'Inter, sans-serif' } },
                                    { id: `${id}-l1`, type: 'text', content: 'Envíos y entregas', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                    { id: `${id}-l2`, type: 'text', content: 'Devoluciones', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                    { id: `${id}-l3`, type: 'text', content: 'Opciones de pago', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                    { id: `${id}-l4`, type: 'text', content: 'Contacto', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                ]
                            },

                            {
                                id: `${id}-c3`,
                                type: 'container',
                                styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-h2`, type: 'text', content: 'ACERCA DE', styles: { fontSize: '14px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'Inter, sans-serif' } },
                                    { id: `${id}-l5`, type: 'text', content: 'Noticias', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                    { id: `${id}-l6`, type: 'text', content: 'Inversores', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                    { id: `${id}-l7`, type: 'text', content: 'Sustentabilidad', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                ]
                            },

                            {
                                id: `${id}-c4`,
                                type: 'container',
                                styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    { id: `${id}-h3`, type: 'text', content: 'NOVEDADES', styles: { fontSize: '14px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'Inter, sans-serif' } },
                                    { id: `${id}-l8`, type: 'text', content: 'Lanzamientos', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                    { id: `${id}-l9`, type: 'text', content: 'Eventos', styles: { fontSize: '12px', color: '#9ca3af', cursor: 'pointer', fontWeight: '500' } },
                                ]
                            },

                            {
                                id: `${id}-c5`,
                                type: 'container',
                                styles: { display: 'flex', gap: '16px', padding: 0, border: 'none', background: 'transparent', alignItems: 'start' },
                                children: [
                                    { id: `${id}-s1`, type: 'icon', content: 'Twitter', styles: { fontSize: '20px', color: '#9ca3af', cursor: 'pointer', width: '24px', height: '24px' } },
                                    { id: `${id}-s2`, type: 'icon', content: 'Facebook', styles: { fontSize: '20px', color: '#9ca3af', cursor: 'pointer', width: '24px', height: '24px' } },
                                    { id: `${id}-s3`, type: 'icon', content: 'Youtube', styles: { fontSize: '20px', color: '#9ca3af', cursor: 'pointer', width: '24px', height: '24px' } },
                                    { id: `${id}-s4`, type: 'icon', content: 'Instagram', styles: { fontSize: '20px', color: '#9ca3af', cursor: 'pointer', width: '24px', height: '24px' } },
                                ]
                            }
                        ]
                    },

                    {
                        id: `${id}-bottom`,
                        type: 'container',
                        styles: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: '1200px',
                            margin: '0 auto',
                            paddingTop: '20px',
                            borderTop: '1px solid #333333',
                            background: 'transparent',
                            flexWrap: 'wrap-reverse',
                            gap: '20px'
                        },
                        children: [

                            {
                                id: `${id}-legal-l`,
                                type: 'container',
                                styles: { display: 'flex', alignItems: 'center', gap: '16px', padding: 0, border: 'none', background: 'transparent' },
                                children: [
                                    {
                                        id: `${id}-loc-container`,
                                        type: 'container',
                                        styles: { display: 'flex', alignItems: 'center', gap: '4px', padding: 0, border: 'none', background: 'transparent' },
                                        children: [
                                            { id: `${id}-loc-icon`, type: 'icon', content: 'MapPin', styles: { width: '14px', height: '14px', color: '#ffffff' } },
                                            { id: `${id}-loc-text`, type: 'text', content: 'Argentina', styles: { fontSize: '12px', color: '#ffffff', fontWeight: '600' } }
                                        ]
                                    },
                                    { id: `${id}-copy`, type: 'text', content: '© 2026 Mi E-Commerce. Todos los derechos reservados.', styles: { fontSize: '11px', color: '#6b7280' } }
                                ]
                            },

                            {
                                id: `${id}-legal-r`,
                                type: 'container',
                                styles: { display: 'flex', gap: '20px', padding: 0, border: 'none', background: 'transparent', flexWrap: 'wrap' },
                                children: [
                                    { id: `${id}-lg1`, type: 'text', content: 'Términos y Condiciones', styles: { fontSize: '11px', color: '#6b7280', cursor: 'pointer' } },
                                    { id: `${id}-lg2`, type: 'text', content: 'Política de Privacidad', styles: { fontSize: '11px', color: '#6b7280', cursor: 'pointer' } },
                                ]
                            }
                        ]
                    }
                ]
            };
        default:
            return {
                id,
                type,
                styles: { padding: "10px", ...customStyles }
            };
    }
};


const updateNode = (node, id, updateFn) => {
    if (node.id === id) {
        return updateFn(node);
    }
    if (node.children) {
        return {
            ...node,
            children: node.children.map(child => updateNode(child, id, updateFn))
        };
    }
    return node;
};


export const selectActivePageContent = (state) => {
    return state.pages.find(p => p.id === state.activePageId)?.content || null;
};

export const useEditorStore = create((set, get) => ({
    pages: [initialHome],
    activePageId: initialHome.id,

    selectedId: null,
    activeTool: 'select', // 'select', 'hand', 'multiselect'
    isPreviewMode: false,
    viewMode: 'desktop',
    isTutorialActive: false,

    setTool: (tool) => set({ activeTool: tool }),
    setViewMode: (mode) => set({ viewMode: mode }),


    projectConfig: {
        targetFramework: 'html',
    },

    setProjectConfig: (config) => set((state) => ({
        projectConfig: { ...state.projectConfig, ...config }
    })),



    addPage: (name) => set((state) => {
        const newPage = createPage(name);
        return {
            pages: [...state.pages, newPage],
            activePageId: newPage.id,
            selectedId: null
        };
    }),

    setActivePage: (pageId) => set({ activePageId: pageId, selectedId: null }),

    deletePage: (pageId) => set((state) => {
        if (state.pages.length <= 1) return state;
        const newPages = state.pages.filter(p => p.id !== pageId);
        return {
            pages: newPages,
            activePageId: state.activePageId === pageId ? newPages[0].id : state.activePageId,
            selectedId: null
        };
    }),

    renamePage: (pageId, newName) => set((state) => ({
        pages: state.pages.map(p => p.id === pageId ? { ...p, name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-') } : p)
    })),




    selectElement: (id) => set({ selectedId: id }),
    togglePreview: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
    toggleTutorial: () => set((state) => ({ isTutorialActive: !state.isTutorialActive })),

    updateStyles: (id, newStyles) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;

        const updatedContent = updateNode(activePage.content, id, (node) => ({
            ...node,
            styles: { ...node.styles, ...newStyles }
        }));

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p)
        };
    }),

    updateContent: (id, newContent) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;

        const updatedContent = updateNode(activePage.content, id, (node) => ({
            ...node,
            content: newContent
        }));

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p)
        };
    }),

    updateProperty: (id, key, value) => set((state) => {
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;

        const updatedContent = updateNode(activePage.content, id, (node) => ({
            ...node,
            [key]: value
        }));

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p)
        };
    }),

    removeElement: (id) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;

        const removeNode = (node, targetId) => {
            if (node.children) {
                return {
                    ...node,
                    children: node.children
                        .filter(child => child.id !== targetId)
                        .map(child => removeNode(child, targetId))
                };
            }
            return node;
        };

        const updatedContent = removeNode(activePage.content, id);
        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p),
            selectedId: null
        };
    }),

    addElement: (parentId, type, customStyles = {}) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;


        let targetId = parentId;
        if (type === 'header' || type === 'footer') {
            targetId = activePage.content.id;
        }

        const updatedContent = updateNode(activePage.content, targetId, (node) => {
            // If absolute, ensure width is not 100% to avoid overflow/invisibility
            const isAbsolute = customStyles.position === 'absolute';

            if (type === 'header' || type === 'footer') {
                customStyles = { ...customStyles, position: 'relative', width: '100%' }; // Headers always full width relative
            } else if (isAbsolute && (type === 'container' || type === 'section')) {
                customStyles = {
                    ...customStyles,
                    width: '300px', // Default box size for drag
                    height: '200px',
                    minHeight: '200px',
                    backgroundColor: '#f8fafc', // Light gray background so it's visible on black
                    border: '1px dashed #cbd5e1'
                };
            } else if (isAbsolute && type === 'text') {
                customStyles = { ...customStyles, width: 'auto', minWidth: '100px' };
            }

            const newNode = createNode(type, customStyles);
            let newChildren = [...(node.children || [])];

            if (type === 'header') {
                newChildren.unshift(newNode);
            } else if (type === 'footer') {
                newChildren.push(newNode);
            } else {
                const footerIndex = newChildren.findIndex(c => c.type === 'footer');
                if (footerIndex !== -1) {
                    newChildren.splice(footerIndex, 0, newNode);
                } else {
                    newChildren.push(newNode);
                }
            }

            return {
                ...node,
                children: newChildren
            };
        });

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p)
        };
    }),

    addImageElement: (parentId, imageUrl) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;

        const updatedContent = updateNode(activePage.content, parentId, (node) => {
            const newNode = createNode('image');
            newNode.content = imageUrl;
            return {
                ...node,
                children: [...(node.children || []), newNode]
            };
        });

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p)
        };
    }),

    moveElement: (draggedId, targetId, position) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;


        const findNodeAndParent = (node, id, parent = null) => {
            if (node.id === id) return { node, parent };
            if (node.children) {
                for (const child of node.children) {
                    const result = findNodeAndParent(child, id, node);
                    if (result) return result;
                }
            }
            return null;
        };

        const pageContent = activePage.content;
        const draggedData = findNodeAndParent(pageContent, draggedId);
        const targetData = findNodeAndParent(pageContent, targetId);

        if (!draggedData || !targetData) return state;

        const { node: draggedNode, parent: oldParent } = draggedData;
        const { node: targetNode, parent: targetParent } = targetData;




        const clonedContent = JSON.parse(JSON.stringify(activePage.content));


        const findInClone = (node, id) => {
            if (node.id === id) return node;
            if (node.children) {
                for (const child of node.children) {
                    const found = findInClone(child, id);
                    if (found) return found;
                }
            }
            return null;
        };
        const findParentInClone = (node, id) => {
            if (node.children && node.children.some(c => c.id === id)) return node;
            if (node.children) {
                for (const child of node.children) {
                    const found = findParentInClone(child, id);
                    if (found) return found;
                }
            }
            return null;
        }

        const draggedNodeClone = findInClone(clonedContent, draggedId);
        const oldParentClone = findParentInClone(clonedContent, draggedId);

        if (!draggedNodeClone || !oldParentClone) return state;


        oldParentClone.children = oldParentClone.children.filter(c => c.id !== draggedId);












        if (position === 'inside') {
            const newParentClone = findInClone(clonedContent, targetId);
            if (newParentClone) {
                if (!newParentClone.children) newParentClone.children = [];
                newParentClone.children.push(draggedNodeClone);
            }
        } else {




            const newParentClone = findParentInClone(clonedContent, targetId);
            if (newParentClone) {
                const targetIndex = newParentClone.children.findIndex(c => c.id === targetId);
                const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
                newParentClone.children.splice(insertIndex, 0, draggedNodeClone);
            }
        }

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: clonedContent } : p)
        };
    }),


    reparentElement: (draggedId, newParentId) => get().moveElement(draggedId, newParentId, 'inside'),


    past: [],
    future: [],
    clipboard: null,

    addToHistory: () => {
        set((state) => {
            const currentContent = JSON.parse(JSON.stringify(state.pages.find(p => p.id === state.activePageId).content));

            const newPast = [...state.past, currentContent].slice(-50);
            return {
                past: newPast,
                future: []
            };
        });
    },

    undo: () => {
        set((state) => {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, -1);



            const current = JSON.parse(JSON.stringify(state.pages.find(p => p.id === state.activePageId).content));

            const updatedPages = state.pages.map(p => p.id === state.activePageId ? { ...p, content: previous } : p);

            return {
                past: newPast,
                future: [current, ...state.future],
                pages: updatedPages,
                selectedId: null
            };
        });
    },

    redo: () => {
        set((state) => {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);

            const current = JSON.parse(JSON.stringify(state.pages.find(p => p.id === state.activePageId).content));

            const updatedPages = state.pages.map(p => p.id === state.activePageId ? { ...p, content: next } : p);

            return {
                past: [...state.past, current],
                future: newFuture,
                pages: updatedPages,
                selectedId: null
            };
        });
    },

    copy: () => {
        const state = get();
        if (!state.selectedId) return;


        const findNode = (node, id) => {
            if (node.id === id) return node;
            if (node.children) {
                for (const child of node.children) {
                    const found = findNode(child, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const activePage = state.pages.find(p => p.id === state.activePageId);
        const nodeToCopy = findNode(activePage.content, state.selectedId);

        if (nodeToCopy && nodeToCopy.type !== 'page') {
            set({ clipboard: JSON.parse(JSON.stringify(nodeToCopy)) });
        }
    },

    paste: () => {
        const state = get();
        if (!state.clipboard) return;

        state.addToHistory();

        const regenerateIds = (node) => {
            const newNode = { ...node };
            newNode.id = `${newNode.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            if (newNode.children) {
                newNode.children = newNode.children.map(regenerateIds);
            }
            return newNode;
        };

        const clonedNode = regenerateIds(state.clipboard);


        if (clonedNode.styles?.position === 'absolute') {
            const oldLeft = parseFloat(clonedNode.styles.left) || 0;
            const oldTop = parseFloat(clonedNode.styles.top) || 0;
            clonedNode.styles.left = `${oldLeft + 20}px`;
            clonedNode.styles.top = `${oldTop + 20}px`;
        }




        const activePage = state.pages.find(p => p.id === state.activePageId);

        const updatedContent = {
            ...activePage.content,
            children: [...(activePage.content.children || []), clonedNode]
        };

        set({
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: updatedContent } : p),
            selectedId: clonedNode.id
        });
    },

    loadTemplate: (templateContent) => set((state) => {
        get().addToHistory();
        const activePage = state.pages.find(p => p.id === state.activePageId);
        if (!activePage) return state;

        const regenerateIds = (node) => {
            const newNode = { ...node };
            newNode.id = `${newNode.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            if (newNode.children) {
                newNode.children = newNode.children.map(regenerateIds);
            }
            return newNode;
        };

        const newContent = regenerateIds(templateContent);

        return {
            pages: state.pages.map(p => p.id === state.activePageId ? { ...p, content: newContent } : p),
            selectedId: null
        };
    }),
}));
