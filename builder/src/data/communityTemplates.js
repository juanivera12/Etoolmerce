import template1 from '../assets/templates/template2.png'; // Reusing available image
import template2 from '../assets/templates/template2.png';
import template3 from '../assets/templates/template3.png';
import hotwheelsPreview from '../assets/templates/hotwheels_preview.png';

// Assets for Hot Wheels template
import heroVideo from '../assets/Video_Ferrari_F_Hot_Wheels.mp4';
import hotWheelsLogo from '../assets/hd-hot-wheels-logo-transparent-background-7017516947722291jxkavnlmh.png';
import car1 from '../assets/chevy.jpg';
import car2 from '../assets/huracan.jpg';
import car3 from '../assets/porsche.jpg';
import car4 from '../assets/silverado.jpg';

export const COMMUNITY_TEMPLATES = [
    {
        id: 'hw-ultimate',
        name: 'Hot Wheels Ultimate',
        author: 'Mattel Official',
        image: hotwheelsPreview,
        content: {
            id: "root-hw",
            type: "page",
            styles: {
                backgroundColor: "#000000",
                fontFamily: "Exo 2, sans-serif",
                minHeight: "100vh",
                padding: "0px",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                position: "relative",
                isolation: "isolate"
            },
            children: [
                // 1. Navegación (Glassmorphism + Gradient Border)
                {
                    id: "hw-header",
                    type: "header",
                    styles: {
                        padding: "15px 40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker glass
                        backdropFilter: "blur(12px)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        position: "fixed",
                        top: "0",
                        left: "0",
                        right: "0",
                        zIndex: "50",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)"
                    },
                    children: [
                        {
                            id: "hw-logo",
                            type: "image",
                            content: hotWheelsLogo,
                            styles: {
                                width: "100px",
                                height: "auto",
                                objectFit: "contain",
                                filter: "drop-shadow(0 0 10px rgba(255,0,0,0.5))"
                            }
                        },
                        {
                            id: "hw-nav-links",
                            type: "container",
                            styles: {
                                display: "flex",
                                gap: "32px",
                                alignItems: "center"
                            },
                            children: [
                                {
                                    id: "link-1",
                                    type: "link",
                                    content: "COLECCIÓN 2026",
                                    styles: { fontSize: "14px", fontWeight: "800", color: "#ffffff", textDecoration: "none", cursor: "pointer", letterSpacing: "1.5px", fontFamily: "Exo 2, sans-serif", textTransform: "uppercase", transition: "color 0.2s" }
                                },
                                {
                                    id: "link-2",
                                    type: "link",
                                    content: "PISTAS",
                                    styles: { fontSize: "14px", fontWeight: "800", color: "#9ca3af", textDecoration: "none", cursor: "pointer", letterSpacing: "1.5px", fontFamily: "Exo 2, sans-serif", textTransform: "uppercase", transition: "color 0.2s" }
                                },
                                {
                                    id: "cart-btn",
                                    type: "container",
                                    styles: {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        cursor: "pointer"
                                    },
                                    children: [
                                        {
                                            id: "cart-icon",
                                            type: "icon",
                                            content: "ShoppingCart",
                                            styles: { color: "#ffffff", width: "18px" }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                // 2. Hero Section (VIDEO BACKGROUND MODE)
                {
                    id: "hw-hero",
                    type: "section",
                    styles: {
                        height: "100vh",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        padding: "0"
                    },
                    children: [
                        // Video Background Layer (New Implementation)
                        {
                            id: "hw-hero-video",
                            type: "video",
                            content: heroVideo,
                            styles: {
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                zIndex: "0",
                                pointerEvents: "none", // Key property for background mode
                                controls: false,       // Hide controls
                                autoPlay: true,        // Force Props
                                muted: true,
                                loop: true
                            }
                        },
                        // Overlay Gradient Layer
                        {
                            id: "hw-overlay-grad",
                            type: "container",
                            styles: {
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6), #111111)",
                                zIndex: "1"
                            },
                            children: []
                        },
                        // Content Layer
                        {
                            id: "hw-hero-content",
                            type: "container",
                            styles: {
                                zIndex: "10",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "24px",
                                textAlign: "center",
                                transform: "translateY(20px)"
                            },
                            children: [
                                {
                                    id: "hw-h1",
                                    type: "text",
                                    content: "ACEPTA EL RETO",
                                    styles: {
                                        fontSize: "96px",
                                        fontWeight: "900",
                                        color: "#ffffff",
                                        textTransform: "uppercase",
                                        fontStyle: "italic",
                                        letterSpacing: "-2px",
                                        lineHeight: "0.85",
                                        fontFamily: "Racing Sans One, cursive", // Google Font
                                        textShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 0px rgba(0,0,0,0)",
                                        // Creating a "Speed" effect with subtle transform skew could be nice but maybe too much CSS for simple props
                                    }
                                },
                                {
                                    id: "hw-sub",
                                    type: "text",
                                    content: "La velocidad no tiene límites en 2026. Prepárate para quemar llantas.",
                                    styles: {
                                        fontSize: "18px",
                                        color: "#e2e8f0",
                                        fontWeight: "400",
                                        maxWidth: "600px",
                                        letterSpacing: "0.5px",
                                        fontFamily: "Exo 2, sans-serif"
                                    }
                                },
                                {
                                    id: "hw-cta",
                                    type: "button",
                                    content: "VER NUEVA COLECCIÓN",
                                    interaction: { type: "link", targetPageId: "hw-products" },
                                    styles: {
                                        marginTop: "32px",
                                        padding: "18px 48px",
                                        backgroundImage: "linear-gradient(90deg, #eab308, #fbbf24)", // Yellow Hot Wheels
                                        color: "#000000",
                                        borderRadius: "0px", // Sharp, aggressive
                                        border: "none",
                                        fontSize: "16px",
                                        fontWeight: "900",
                                        cursor: "pointer",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        transform: "skew(-12deg)", // Racing aesthetic
                                        boxShadow: "0 0 20px rgba(234, 179, 8, 0.4)",
                                        fontFamily: "Exo 2, sans-serif",
                                        hoverScale: "1.05",
                                        hoverBrightness: "1.1"
                                    }
                                }
                            ]
                        }
                    ]
                },
                // 3. Section Title
                {
                    id: "hw-title-sec",
                    type: "section",
                    styles: {
                        padding: "80px 40px 0px 40px",
                        backgroundColor: "#111111",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    },
                    children: [
                        {
                            id: "hw-prod-title",
                            type: "text",
                            content: "GARAJE EXCLUSIVO",
                            styles: {
                                fontSize: "48px",
                                fontWeight: "900",
                                color: "#ffffff",
                                textTransform: "uppercase",
                                fontStyle: "italic",
                                fontFamily: "Racing Sans One, cursive",
                                letterSpacing: "-1px"
                            }
                        },
                        {
                            id: "hw-prod-line",
                            type: "container",
                            styles: {
                                width: "60px",
                                height: "6px",
                                backgroundColor: "#ef4444", // Red
                                transform: "skew(-20deg)",
                                marginTop: "16px"
                            },
                            children: []
                        }
                    ]
                },
                // 4. Grid de Productos (Enhanced Cards)
                {
                    id: "hw-products",
                    type: "section",
                    styles: {
                        padding: "60px 80px 100px 80px",
                        backgroundColor: "#111111",
                        display: "flex",
                        flexDirection: "column",
                        gap: "60px",
                        alignItems: "center"
                    },
                    children: [
                        {
                            id: "hw-grid",
                            type: "productGrid",
                            styles: {
                                width: "100%",
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "32px"
                            },
                            children: [
                                // Product 1
                                {
                                    id: "prod-1",
                                    type: "container",
                                    styles: {
                                        backgroundColor: "#1a1a1a",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "0",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                                        border: "1px solid #333",
                                        hoverScale: "1.02"
                                    },
                                    children: [
                                        {
                                            id: "img-p1",
                                            type: "image",
                                            content: car1,
                                            styles: { width: "100%", height: "240px", objectFit: "cover", transition: "transform 0.5s" }
                                        },
                                        {
                                            id: "info-p1",
                                            type: "container",
                                            styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #333" },
                                            children: [
                                                { id: "t-p1", type: "text", content: "'55 Chevy Bel Air", styles: { color: "white", fontWeight: "700", fontSize: "16px", fontFamily: "Exo 2, sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" } },
                                                {
                                                    id: "act-p1",
                                                    type: "container",
                                                    styles: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" },
                                                    children: [
                                                        { id: "pr-p1", type: "text", content: "$24.99", styles: { color: "#fbbf24", fontWeight: "800", fontSize: "20px", fontFamily: "Exo 2, sans-serif" } },
                                                        {
                                                            id: "btn-p1",
                                                            type: "button",
                                                            content: "+",
                                                            interaction: { type: "addToCart", product: { id: "p1", name: "'55 Chevy Bel Air", price: 24.99, image: car1 } },
                                                            styles: { width: "32px", height: "32px", borderRadius: "50%", backgroundImage: "linear-gradient(135deg, #ffffff, #e2e8f0)", color: "#000", border: 'none', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', hoverScale: "1.2", cursor: 'pointer' }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                // Product 2
                                {
                                    id: "prod-2",
                                    type: "container",
                                    styles: {
                                        backgroundColor: "#1a1a1a",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "0",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                                        border: "1px solid #333",
                                        hoverScale: "1.02" // New engine feature
                                    },
                                    children: [
                                        {
                                            id: "img-p2",
                                            type: "image",
                                            content: car2,
                                            styles: { width: "100%", height: "240px", objectFit: "cover" }
                                        },
                                        {
                                            id: "info-p2",
                                            type: "container",
                                            styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #333" },
                                            children: [
                                                { id: "t-p2", type: "text", content: "Lamborghini Huracán", styles: { color: "white", fontWeight: "700", fontSize: "16px", fontFamily: "Exo 2, sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" } },
                                                {
                                                    id: "act-p2",
                                                    type: "container",
                                                    styles: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" },
                                                    children: [
                                                        { id: "pr-p2", type: "text", content: "$54.99", styles: { color: "#fbbf24", fontWeight: "800", fontSize: "20px", fontFamily: "Exo 2, sans-serif" } },
                                                        {
                                                            id: "btn-p2",
                                                            type: "button",
                                                            content: "+",
                                                            interaction: { type: "addToCart", product: { id: "p2", name: "Lamborghini Huracán", price: 54.99, image: car2 } },
                                                            styles: { width: "32px", height: "32px", borderRadius: "50%", backgroundImage: "linear-gradient(135deg, #ffffff, #e2e8f0)", color: "#000", border: 'none', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', hoverScale: "1.2", cursor: 'pointer' }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                // Product 3
                                {
                                    id: "prod-3",
                                    type: "container",
                                    styles: {
                                        backgroundColor: "#1a1a1a",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "0",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                                        border: "1px solid #333",
                                        hoverScale: "1.02" // New engine feature
                                    },
                                    children: [
                                        {
                                            id: "img-p3",
                                            type: "image",
                                            content: car3,
                                            styles: { width: "100%", height: "240px", objectFit: "cover" }
                                        },
                                        {
                                            id: "info-p3",
                                            type: "container",
                                            styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #333" },
                                            children: [
                                                { id: "t-p3", type: "text", content: "Porsche 911 GT3", styles: { color: "white", fontWeight: "700", fontSize: "16px", fontFamily: "Exo 2, sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" } },
                                                {
                                                    id: "act-p3",
                                                    type: "container",
                                                    styles: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" },
                                                    children: [
                                                        { id: "pr-p3", type: "text", content: "$29.99", styles: { color: "#fbbf24", fontWeight: "800", fontSize: "20px", fontFamily: "Exo 2, sans-serif" } },
                                                        {
                                                            id: "btn-p3",
                                                            type: "button",
                                                            content: "+",
                                                            interaction: { type: "addToCart", product: { id: "p3", name: "Porsche 911 GT3", price: 29.99, image: car3 } },
                                                            styles: { width: "32px", height: "32px", borderRadius: "50%", backgroundImage: "linear-gradient(135deg, #ffffff, #e2e8f0)", color: "#000", border: 'none', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', hoverScale: "1.2", cursor: 'pointer' }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                // Product 4
                                {
                                    id: "prod-4",
                                    type: "container",
                                    styles: {
                                        backgroundColor: "#1a1a1a",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "0",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                                        border: "1px solid #333",
                                        hoverScale: "1.02" // New engine feature
                                    },
                                    children: [
                                        {
                                            id: "img-p4",
                                            type: "image",
                                            content: car4,
                                            styles: { width: "100%", height: "240px", objectFit: "cover" }
                                        },
                                        {
                                            id: "info-p4",
                                            type: "container",
                                            styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #333" },
                                            children: [
                                                { id: "t-p4", type: "text", content: "Chevy Silverado", styles: { color: "white", fontWeight: "700", fontSize: "16px", fontFamily: "Exo 2, sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" } },
                                                {
                                                    id: "act-p4",
                                                    type: "container",
                                                    styles: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" },
                                                    children: [
                                                        { id: "pr-p4", type: "text", content: "$34.99", styles: { color: "#fbbf24", fontWeight: "800", fontSize: "20px", fontFamily: "Exo 2, sans-serif" } },
                                                        {
                                                            id: "btn-p4",
                                                            type: "button",
                                                            content: "+",
                                                            interaction: { type: "addToCart", product: { id: "p4", name: "Chevy Silverado", price: 34.99, image: car4 } },
                                                            styles: { width: "32px", height: "32px", borderRadius: "50%", backgroundImage: "linear-gradient(135deg, #ffffff, #e2e8f0)", color: "#000", border: 'none', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', hoverScale: "1.2", cursor: 'pointer' }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                // 4. Footer
                {
                    id: "hw-footer",
                    type: "footer",
                    styles: {
                        padding: "80px 40px",
                        backgroundColor: "#000000",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "24px",
                        borderTop: "1px solid #222"
                    },
                    children: [
                        {
                            id: "ft-logo",
                            type: "image",
                            content: hotWheelsLogo,
                            styles: { width: "100px", opacity: "0.4", filter: "grayscale(100%)" }
                        },
                        {
                            id: "ft-text",
                            type: "text",
                            content: "© 2026 MATTEL. TODOS LOS DERECHOS RESERVADOS.",
                            styles: { color: "#444", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "Exo 2, sans-serif", fontWeight: "600" }
                        }
                    ]
                }
            ]
        }
    },
    {
        id: '1',
        name: 'Tienda Minimal',
        author: 'JuanDev',
        image: template1,
        content: {
            id: "root-template-1",
            type: "page",
            styles: {
                backgroundColor: "#ffffff",
                fontFamily: "Inter, sans-serif",
                minHeight: "100vh",
                padding: "0px",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                position: "relative",
                isolation: "isolate"
            },
            children: [
                {
                    id: "header-1",
                    type: "header",
                    styles: {
                        padding: "20px 40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0"
                    },
                    children: [
                        {
                            id: "logo-text-1",
                            type: "text",
                            content: "MINIMAL",
                            styles: { fontSize: "24px", fontWeight: "800", color: "#000" }
                        }
                    ]
                },
                {
                    id: "hero-1",
                    type: "section",
                    styles: {
                        padding: "100px 40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8fafc",
                        gap: "24px"
                    },
                    children: [
                        {
                            id: "hero-title-1",
                            type: "text",
                            content: "Esenciales para tu Vida",
                            styles: { fontSize: "56px", fontWeight: "900", color: "#0f172a", textAlign: "center" }
                        },
                        {
                            id: "hero-sub-1",
                            type: "text",
                            content: "Descubre nuestra nueva colección de verano.",
                            styles: { fontSize: "20px", color: "#64748b", textAlign: "center" }
                        },
                        {
                            id: "hero-btn-1",
                            type: "button",
                            content: "Ver Colección",
                            styles: {
                                padding: "12px 32px",
                                backgroundColor: "#0f172a",
                                color: "white",
                                borderRadius: "4px",
                                border: "none",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        id: '2',
        name: 'Blog Creativo',
        author: 'DesignPro',
        image: template2,
        content: {
            id: "root-template-2",
            type: "page",
            styles: {
                backgroundColor: "#fff1f2",
                fontFamily: "Inter, sans-serif",
                minHeight: "100vh",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                position: "relative"
            },
            children: [
                {
                    id: "section-blog-1",
                    type: "section",
                    styles: {
                        padding: "80px",
                        backgroundColor: "#ffffff",
                        borderRadius: "20px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    },
                    children: [
                        {
                            id: "blog-title-1",
                            type: "text",
                            content: "Historias Creativas",
                            styles: { fontSize: "42px", fontWeight: "bold", color: "#be123c" }
                        },
                        {
                            id: "blog-grid-1",
                            type: "container",
                            styles: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "20px",
                                padding: "20px 0"
                            },
                            children: []
                        }
                    ]
                }
            ]
        }
    },
    {
        id: '3',
        name: 'Landing SaaS',
        author: 'StartupKit',
        image: template3,
        content: {
            id: "root-template-3",
            type: "page",
            styles: {
                backgroundColor: "#0B1120",
                fontFamily: "Inter, sans-serif",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative"
            },
            children: [
                {
                    id: "saas-hero",
                    type: "section",
                    styles: {
                        padding: "120px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "30px",
                        background: "linear-gradient(180deg, #0B1120 0%, #1e293b 100%)"
                    },
                    children: [
                        {
                            id: "saas-h1",
                            type: "text",
                            content: "Software del Futuro",
                            styles: {
                                fontSize: "64px",
                                fontWeight: "800",
                                color: "transparent",
                                backgroundClip: "text",
                                backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)",
                                textAlign: "center",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }
                        },
                        {
                            id: "saas-p",
                            type: "text",
                            content: "Automatiza tu flujo de trabajo con nuestra tecnología avanzada.",
                            styles: { fontSize: "20px", color: "#94a3b8", textAlign: "center", maxWidth: "600px" }
                        }
                    ]
                }
            ]
        }
    },
];
