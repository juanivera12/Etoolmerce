
// Assets
// We keep using local assets for the "Fuego Urbano" (Hot Wheels style) distinct look
import template1 from '../assets/templates/template2.png'; // Placeholder thumbnail
import template2 from '../assets/templates/template2.png'; // Placeholder thumbnail
import template3 from '../assets/templates/template3.png'; // Placeholder thumbnail
import hotwheelsPreview from '../assets/templates/hotwheels_preview.png';

// Hot Wheels Assets (Recycled for Fuego Urbano)
import heroVideo from '../assets/Video_Ferrari_F_Hot_Wheels.mp4';
import hotWheelsLogo from '../assets/hd-hot-wheels-logo-transparent-background-7017516947722291jxkavnlmh.png';
import car1 from '../assets/chevy.jpg';
import car2 from '../assets/huracan.jpg';
import car3 from '../assets/porsche.jpg';
import car4 from '../assets/silverado.jpg';

// Helper for generic placeholders
const placeholderUrl = (w, h, text, bg = '1a1a1a', color = 'FFFFFF') =>
    `https://placehold.co/${w}x${h}/${bg}/${color}?text=${encodeURIComponent(text)}`;

/* --- Template 1: Fuego Urbano (Hot Wheels Style) --- */
const fuegoUrbanoContent = {
    id: "root-fuego",
    type: "page",
    styles: {
        backgroundColor: "#050505",
        fontFamily: "Exo 2, sans-serif", // Aggressive font
        minHeight: "100vh",
        padding: "0px",
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        position: "relative",
        isolation: "isolate"
    },
    children: [
        // Header
        {
            id: "fu-header",
            type: "header",
            styles: {
                padding: "20px 5%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(10px)",
                borderBottom: "2px solid #ef4444", // Red accent
                position: "fixed",
                width: "100%",
                zIndex: "100",
                top: "0"
            },
            children: [
                { id: "fu-logo", type: "text", content: "FUEGO URBANO", styles: { fontSize: "24px", fontWeight: "900", color: "#ffffff", fontStyle: "italic", letterSpacing: "-1px" } },
                {
                    id: "fu-nav",
                    type: "container",
                    styles: { display: "flex", gap: "30px" },
                    children: [
                        { id: "fu-l1", type: "link", content: "COLECCIÓN", styles: { color: "white", fontWeight: "700", fontSize: "14px" } },
                        { id: "fu-l2", type: "link", content: "OFERTAS", styles: { color: "#ef4444", fontWeight: "700", fontSize: "14px" } }
                    ]
                }
            ]
        },
        // Hero
        {
            id: "fu-hero",
            type: "section",
            styles: {
                height: "90vh",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${placeholderUrl(1920, 1080, 'STREET RACING', '111', '333')})`, // Fallback if video fails
                backgroundSize: "cover",
                backgroundPosition: "center"
            },
            children: [
                // Video Layer
                {
                    id: "fu-vid",
                    type: "video",
                    content: heroVideo,
                    styles: {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: "0",
                        opacity: "0.6"
                    }
                },
                {
                    id: "fu-hero-content",
                    type: "container",
                    styles: { zIndex: "10", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" },
                    children: [
                        {
                            id: "fu-title",
                            type: "text",
                            content: "ACELERA TU ESTILO",
                            styles: { fontSize: "80px", fontWeight: "900", color: "white", fontStyle: "italic", lineHeight: "1", textShadow: "0 10px 40px rgba(0,0,0,0.8)" },
                            animation: "fade-up" // AOS assumption
                        },
                        {
                            id: "fu-cta",
                            type: "button",
                            content: "COMPRAR AHORA",
                            styles: {
                                backgroundColor: "#ef4444",
                                color: "white",
                                padding: "15px 40px",
                                fontSize: "18px",
                                fontWeight: "800",
                                border: "none",
                                skew: "-10deg", // Custom aesthetic
                                cursor: "pointer",
                                boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)"
                            }
                        }
                    ]
                }
            ]
        },
        // Grid Title
        {
            id: "fu-title-sec",
            type: "section",
            styles: { padding: "80px 5%", backgroundColor: "#111", textAlign: "center" },
            children: [
                { id: "fu-cat-title", type: "text", content: "NOVEDADES 2026", styles: { color: "white", fontSize: "40px", fontWeight: "900", marginBottom: "40px", fontStyle: "italic" } },
                {
                    id: "fu-grid",
                    type: "container",
                    styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
                    children: [
                        // 4 Product Cards
                        ...[car1, car2, car3, car4].map((img, i) => ({
                            id: `fu-prod-${i}`,
                            type: "container",
                            styles: { backgroundColor: "#1a1a1a", borderRadius: "10px", overflow: "hidden", position: "relative" },
                            children: [
                                { id: `fu-img-${i}`, type: "image", content: img || placeholderUrl(400, 400, 'Product'), styles: { width: "100%", height: "250px", objectFit: "cover" } },
                                {
                                    id: `fu-info-${i}`,
                                    type: "container",
                                    styles: { padding: "15px" },
                                    children: [
                                        { id: `fu-n-${i}`, type: "text", content: "Street Racer X", styles: { color: "white", fontWeight: "bold" } },
                                        { id: `fu-p-${i}`, type: "text", content: "$45.00", styles: { color: "#ef4444", fontWeight: "800", marginTop: "5px" } }
                                    ]
                                }
                            ]
                        }))
                    ]
                }
            ]
        },
        // Footer
        {
            id: "fu-footer",
            type: "footer",
            styles: { padding: "50px", backgroundColor: "black", borderTop: "1px solid #333", textAlign: "center" },
            children: [
                { id: "fu-copy", type: "text", content: "© 2026 FUEGO URBANO. TODOS LOS DERECHOS RESERVADOS.", styles: { color: "#666", fontSize: "12px" } }
            ]
        }
    ]
};

/* --- Template 2: NeoFinanzas (SaaS/Tech) --- */
const neoFinanzasContent = {
    id: "root-neo",
    type: "page",
    styles: {
        backgroundColor: "#0f172a", // Slate 900
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
    },
    children: [
        // Navbar
        {
            id: "neo-nav",
            type: "header",
            styles: {
                padding: "20px 10%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                position: "sticky",
                top: "0",
                zIndex: "50"
            },
            children: [
                { id: "neo-logo", type: "text", content: "NeoFinanzas", styles: { color: "#38bdf8", fontWeight: "800", fontSize: "22px" } },
                {
                    id: "neo-cta-nav",
                    type: "button",
                    content: "Empezar Gratis",
                    styles: {
                        padding: "10px 20px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer"
                    }
                }
            ]
        },
        // Hero
        {
            id: "neo-hero",
            type: "section",
            styles: {
                padding: "100px 10%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "50px",
                alignItems: "center",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            },
            children: [
                {
                    id: "neo-hero-txt",
                    type: "container",
                    styles: { display: "flex", flexDirection: "column", gap: "20px" },
                    children: [
                        {
                            id: "neo-h1",
                            type: "text",
                            content: "Tu dinero, inteligente.",
                            styles: {
                                fontSize: "60px",
                                fontWeight: "800",
                                lineHeight: "1.1",
                                background: "linear-gradient(to right, #38bdf8, #818cf8)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }
                        },
                        { id: "neo-p", type: "text", content: "Controla tus gastos, inversiones y ahorros desde una sola plataforma impulsada por algoritmos inteligentes.", styles: { color: "#94a3b8", fontSize: "18px", lineHeight: "1.6" } },
                        {
                            id: "neo-hero-btn",
                            type: "button",
                            content: "Descargar App",
                            styles: { padding: "16px 32px", backgroundColor: "white", color: "#0f172a", border: "none", borderRadius: "8px", fontWeight: "700", marginTop: "10px", width: "fit-content", cursor: "pointer" }
                        }
                    ]
                },
                {
                    id: "neo-hero-img",
                    type: "image",
                    content: placeholderUrl(600, 800, 'App Dashboard', '1e293b', '38bdf8'),
                    styles: { width: "100%", borderRadius: "20px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", transform: "rotate(-2deg)" }
                }
            ]
        },
        // Features
        {
            id: "neo-feat",
            type: "section",
            styles: { padding: "100px 10%", backgroundColor: "#0f172a" },
            children: [
                {
                    id: "neo-grid",
                    type: "container",
                    styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" },
                    children: [
                        { title: "Dashboard", desc: "Vista general en tiempo real." },
                        { title: "Seguridad", desc: "Encriptación de grado militar." },
                        { title: "Reportes", desc: "Análisis detallado mensual." }
                    ].map((f, i) => ({
                        id: `neo-f-${i}`,
                        type: "container",
                        styles: { padding: "30px", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155" },
                        children: [
                            { id: `neo-ft-${i}`, type: "text", content: f.title, styles: { color: "white", fontSize: "20px", fontWeight: "700", marginBottom: "10px" } },
                            { id: `neo-fd-${i}`, type: "text", content: f.desc, styles: { color: "#94a3b8", fontSize: "16px" } }
                        ]
                    }))
                }
            ]
        },
        // Footer
        {
            id: "neo-footer",
            type: "footer",
            styles: { padding: "60px 10%", backgroundColor: "#020617", color: "#64748b", fontSize: "14px" },
            children: [
                { id: "neo-foot-txt", type: "text", content: "© 2026 NeoFinanzas Inc." }
            ]
        }
    ]
};

/* --- Template 3: Portafolio Minimal (Freelancer) --- */
const minimalContent = {
    id: "root-mini",
    type: "page",
    styles: {
        backgroundColor: "#ffffff",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#18181b"
    },
    children: [
        // Navbar
        {
            id: "mini-nav",
            type: "header",
            styles: { padding: "40px 10%", display: "flex", justifyContent: "space-between" },
            children: [
                { id: "mini-logo", type: "text", content: "ANDREA.", styles: { fontSize: "20px", fontWeight: "bold", letterSpacing: "-1px" } },
                { id: "mini-menu", type: "text", content: "Menu", styles: { fontSize: "16px", cursor: "pointer", textDecoration: "underline" } }
            ]
        },
        // Hero
        {
            id: "mini-hero",
            type: "section",
            styles: { padding: "100px 10%", display: "flex", flexDirection: "column", gap: "30px" },
            children: [
                {
                    id: "mini-head",
                    type: "text",
                    content: "Hola, soy Andrea. Creo experiencias digitales que inspiran.",
                    styles: { fontSize: "72px", fontWeight: "300", lineHeight: "1.1", letterSpacing: "-2px", maxWidth: "900px" }
                },
                {
                    id: "mini-sub",
                    type: "text",
                    content: "Diseñadora UI/UX & Desarrolladora Frontend basada en Madrid.",
                    styles: { fontSize: "20px", color: "#71717a", maxWidth: "600px" }
                }
            ]
        },
        // Grid
        {
            id: "mini-work",
            type: "section",
            styles: { padding: "0 10% 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" },
            children: [
                { img: placeholderUrl(800, 1000, 'Project 1', 'f3f4f6', '000'), title: "E-commerce Redesign" },
                { img: placeholderUrl(800, 1000, 'Project 2', 'e5e7eb', '000'), title: "Finance App Hub" },
                { img: placeholderUrl(800, 1000, 'Project 3', 'd1d5db', '000'), title: "Travel Agency Brand" },
                { img: placeholderUrl(800, 1000, 'Project 4', '9ca3af', '000'), title: "Art Gallery Site" }
            ].map((p, i) => ({
                id: `mini-proj-${i}`,
                type: "container",
                styles: { display: "flex", flexDirection: "column", gap: "20px", marginTop: i % 2 !== 0 ? "100px" : "0" }, // Staggered effect
                children: [
                    { id: `mini-img-${i}`, type: "image", content: p.img, styles: { width: "100%", borderRadius: "4px", aspectRatio: "4/5", objectFit: "cover" } },
                    { id: `mini-tit-${i}`, type: "text", content: p.title, styles: { fontSize: "18px", fontWeight: "500" } }
                ]
            }))
        },
        // Footer
        {
            id: "mini-foot",
            type: "footer",
            styles: { padding: "100px 10%", borderTop: "1px solid #f4f4f5", textAlign: "center" },
            children: [
                { id: "mini-ctale", type: "text", content: "¿Hablamos?", styles: { fontSize: "32px", fontWeight: "bold", marginBottom: "20px" } },
                { id: "mini-mail", type: "button", content: "andrea@design.co", styles: { fontSize: "20px", textDecoration: "underline", color: "black", background: "none", border: "none", cursor: "pointer" } }
            ]
        }
    ]
};

export const PREMADE_TEMPLATES = [
    {
        id: 'fuego-urbano',
        name: 'Fuego Urbano',
        category: 'Streetwear',
        description: 'Diseño oscuro y agresivo inspirado en el automovilismo. Ideal para marcas de ropa urbana o accesorios de alto impacto.',
        thumbnailSrc: hotwheelsPreview, // Keeping the cool preview
        structure: fuegoUrbanoContent
    },
    {
        id: 'neo-finanzas',
        name: 'NeoFinanzas',
        category: 'SaaS / Tech',
        description: 'Interfaz limpia y tecnológica con gradientes modernos. Perfecta para apps, software o servicios financieros.',
        thumbnailSrc: placeholderUrl(800, 450, 'NeoFinanzas Preview', '0f172a', '38bdf8'),
        structure: neoFinanzasContent
    },
    {
        id: 'portafolio-minimal',
        name: 'Minimal Portfolio',
        category: 'Personal',
        description: 'Elegancia y espacio en blanco. La mejor opción para diseñadores, fotógrafos o arquitectos que quieren que su trabajo hable.',
        thumbnailSrc: placeholderUrl(800, 450, 'Minimal Preview', 'ffffff', '000000'),
        structure: minimalContent
    }
];
