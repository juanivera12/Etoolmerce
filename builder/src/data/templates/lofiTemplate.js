export const LoFiTemplate = {
    id: "template_lofi_juan",
    title: "LoFi Developer Portfolio",
    description: "Plantilla minimalista de alta fidelidad estilo 'raw' o 'brutalist', ideal para desarrolladores. Basada en currículum real.",
    author: "Equipo E-ToolMerce",
    author_name: "Equipo E-ToolMerce",
    category: "Portafolio / Dev",
    thumbnailSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=60", // Code/Terminal Aesthetic
    structure_json: {
        id: "root",
        type: "page",
        children: [
            // HEADER / NAME
            {
                id: "header_lofi",
                type: "section",
                styles: {
                    padding: "60px 20px",
                    backgroundColor: "#f0f0f0",
                    borderBottom: "2px solid #000",
                    textAlign: "center"
                },
                children: [
                    {
                        id: "lofi_profile_img",
                        type: "image",
                        content: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", // Placeholder
                        styles: {
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            margin: "0 auto 20px auto",
                            border: "3px solid #000",
                            filter: "grayscale(100%)" // LoFi/Raw aesthetic
                        }
                    },
                    {
                        id: "name_title",
                        type: "text",
                        content: "Tu Nombre Aquí",
                        styles: {
                            fontSize: "4rem",
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            color: "#000",
                            marginBottom: "10px",
                            letterSpacing: "-2px"
                        }
                    },
                    {
                        id: "role_subtitle",
                        type: "text",
                        content: "TECNICO EN PROGRAMACION | DESARROLLADOR FULL STACK",
                        styles: {
                            fontSize: "1.2rem",
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            color: "#333",
                            textTransform: "uppercase",
                            marginBottom: "20px"
                        }
                    },
                    {
                        id: "summary_text",
                        type: "text",
                        content: "Desarrollador con visión integral del software y capacidad para abordar proyectos de principio a fin. Me apasiona transformar necesidades complejas en aplicaciones web intuitivas y funcionales. Soy una persona proactiva y orientada a la mejora continua.",
                        styles: {
                            fontSize: "1rem",
                            fontFamily: "monospace",
                            color: "#444",
                            maxWidth: "800px",
                            margin: "0 auto",
                            lineHeight: "1.6"
                        }
                    }
                ]
            },
            // CONTACT BAR
            {
                id: "contact_bar",
                type: "section",
                styles: {
                    padding: "20px",
                    backgroundColor: "#fff",
                    borderBottom: "2px solid #000",
                    display: "flex",
                    justifyContent: "center",
                    gap: "40px",
                    flexWrap: "wrap"
                },
                children: [
                    { id: "contact_phone", type: "text", content: "📞 +542615946530", styles: { fontFamily: "monospace", fontWeight: "bold" } },
                    { id: "contact_email", type: "text", content: "✉️ juanignaciovera15@gmail.com", styles: { fontFamily: "monospace", fontWeight: "bold" } },
                    { id: "contact_loc", type: "text", content: "📍 Mendoza, Carrodilla", styles: { fontFamily: "monospace", fontWeight: "bold" } }
                ]
            },
            // MAIN CONTENT GRID
            {
                id: "main_content",
                type: "section",
                styles: {
                    display: "grid",
                    gridTemplateColumns: "1fr", // Mobile first, can be adjusted manually
                    backgroundColor: "#fff"
                },
                children: [
                    // LEFT COLUMN (Experience & Education)
                    {
                        id: "left_col",
                        type: "container",
                        styles: {
                            padding: "40px",
                            borderRight: "2px solid #000" // Might need media query handling in real CSS, but here hardcoded
                        },
                        children: [
                            // EDUCATION
                            {
                                id: "edu_section",
                                type: "container",
                                styles: { marginBottom: "40px" },
                                children: [
                                    { id: "edu_title", type: "text", content: "FORMACIÓN", styles: { fontSize: "1.5rem", fontFamily: "monospace", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px", fontWeight: "bold" } },
                                    {
                                        id: "edu_item",
                                        type: "text",
                                        content: "2024 - 2025: TECNICATURA EN PROGRAMACION\nUniversidad Tecnologica Nacional San Rafael",
                                        styles: { fontFamily: "monospace", whiteSpace: "pre-line", lineHeight: "1.6" }
                                    }
                                ]
                            },
                            // EXPERIENCE
                            {
                                id: "exp_section",
                                type: "container",
                                styles: { marginBottom: "40px" },
                                children: [
                                    { id: "exp_title", type: "text", content: "EXPERIENCIA", styles: { fontSize: "1.5rem", fontFamily: "monospace", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px", fontWeight: "bold" } },
                                    {
                                        id: "exp_item_1",
                                        type: "container",
                                        styles: { marginBottom: "30px" },
                                        children: [
                                            { id: "exp_1_role", type: "text", content: "PASANTIAS: AVIV S.A / TOANPE S.R.L", styles: { fontSize: "1.2rem", fontWeight: "bold", fontFamily: "monospace" } },
                                            { id: "exp_1_date", type: "text", content: "AGOSTO 2025 - OCTUBRE 2025", styles: { fontSize: "0.9rem", color: "#666", marginBottom: "10px", fontFamily: "monospace" } },
                                            {
                                                id: "exp_1_desc",
                                                type: "text",
                                                content: "• Automatización del filtrado y selección de candidatos (80% ahorro tiempo).\n• Desarrollo de módulos para gestión de solicitudes.\n• Diseño e implementación de bases de datos para CVs y usuarios.",
                                                styles: { fontFamily: "monospace", lineHeight: "1.6", whiteSpace: "pre-line" }
                                            }
                                        ]
                                    },
                                    {
                                        id: "exp_item_2",
                                        type: "container",
                                        children: [
                                            { id: "exp_2_role", type: "text", content: "DESARROLLADOR BACKEND / FREELANCE", styles: { fontSize: "1.2rem", fontWeight: "bold", fontFamily: "monospace" } },
                                            { id: "exp_2_date", type: "text", content: "AGOSTO 2025 - DICIEMBRE 2025", styles: { fontSize: "0.9rem", color: "#666", marginBottom: "10px", fontFamily: "monospace" } },
                                            {
                                                id: "exp_2_desc",
                                                type: "text",
                                                content: "• Desarrollo de sistemas de atención al cliente automatizados.\n• Backend en Python y PostgreSQL.\n• Integración de WhatsApp Business API.",
                                                styles: { fontFamily: "monospace", lineHeight: "1.6", whiteSpace: "pre-line" }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    // RIGHT COLUMN (Skills & Socials)
                    {
                        id: "right_col",
                        type: "container",
                        styles: {
                            padding: "40px",
                            backgroundColor: "#fafafa"
                        },
                        children: [
                            // SKILLS
                            {
                                id: "skills_section",
                                type: "container",
                                styles: { marginBottom: "40px" },
                                children: [
                                    { id: "skills_title", type: "text", content: "HABILIDADES", styles: { fontSize: "1.5rem", fontFamily: "monospace", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px", fontWeight: "bold" } },
                                    {
                                        id: "skills_list",
                                        type: "text",
                                        content: "• Python, React, JavaScript\n• HTML, CSS, Flask\n• SQL, SQLite, PostgreSQL\n• Java, SpringBoot\n• Git / GitHub\n• TypeScript, API REST\n• Figma, UI/UX\n• Scrum, Trello, Clickup",
                                        styles: { fontFamily: "monospace", lineHeight: "1.8", whiteSpace: "pre-line" }
                                    }
                                ]
                            },
                            // CERTIFICATIONS
                            {
                                id: "cert_section",
                                type: "container",
                                styles: { marginBottom: "40px" },
                                children: [
                                    { id: "cert_title", type: "text", content: "CERTIFICACIÓN", styles: { fontSize: "1.5rem", fontFamily: "monospace", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px", fontWeight: "bold" } },
                                    { id: "cert_list", type: "text", content: "• Cloud Computing Fundamentals\n• Tecnico en programacion", styles: { fontFamily: "monospace", lineHeight: "1.6", whiteSpace: "pre-line" } }
                                ]
                            },
                            // SOCIALS
                            {
                                id: "social_section",
                                type: "container",
                                children: [
                                    { id: "social_title", type: "text", content: "REDES", styles: { fontSize: "1.5rem", fontFamily: "monospace", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px", fontWeight: "bold" } },
                                    {
                                        id: "social_links",
                                        type: "text",
                                        content: "LinkedIn: linkedin.com/in/juan-ignacio-vera\nPortafolio: jignaciovportfolio.netlify.app",
                                        styles: { fontFamily: "monospace", lineHeight: "1.6", whiteSpace: "pre-line", wordBreak: "break-all" }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
