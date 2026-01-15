import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Helper to sanitize layer names into CSS classes
const toClassName = (name, type, index) => {
    if (!name) {
        return `${type}-${index}`; // Fallback: button-1
    }
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens
};

// Recursively traverse nodes to build CSS and Map IDs to Classes
const extractStyles = (node, cssMap, classMap, counter = { idx: 0 }) => {
    if (!node) return;

    // Generate safe class name
    counter.idx++;
    const className = toClassName(node.className, node.type, counter.idx);

    // Store mapping for HTML generation (ID -> Class)
    classMap.set(node.id, className);

    // Generate CSS Rule
    if (node.styles && Object.keys(node.styles).length > 0) {
        const rules = Object.entries(node.styles).map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value};`;
        }).join(' ');

        if (!cssMap.has(className)) {
            cssMap.set(className, `.${className} { ${rules} }`);
        } else {
            // Unlikely collision handling or merging could go here
            // distinct IDs usually mean distinct nodes, but same name = same class?
            // If user gives same name, styles might conflict. 
            // For now, we assume user intends to share styles if names are identical, 
            // OR we uniqueness enforce it. 
            // Requirement says: "User assigns custom names... Use the name the user defined".
            // If two buttons are named "Buy Button", they share class ".buy-button".
            // If their styles differ, we have a problem.
            // Professional approach: If styles differ, append index?
            // For simplicity and per request compliance: Append index if collision with DIFFERENT styles.
            // Checking content collision is expensive. Let's just append index if map has it.
            // Wait, "Reuse" is good. If styles match, reuse. If not, make unique.

            const existingRule = cssMap.get(className);
            if (existingRule !== `.${className} { ${rules} }`) {
                // Conflict!
                const uniqueClass = `${className}-${counter.idx}`;
                cssMap.set(uniqueClass, `.${uniqueClass} { ${rules} }`);
                classMap.set(node.id, uniqueClass);
            }
        }
    }

    if (node.children) {
        node.children.forEach(child => extractStyles(child, cssMap, classMap, counter));
    }
};

// Generate HTML for a node using the pre-calculated classes
const generateNodeHTML = (node, pages, classMap) => {
    if (!node) return '';

    const className = classMap.get(node.id) || '';
    const idAttr = node.htmlId ? ` id="${node.htmlId}"` : '';

    let tagName = 'div';
    let href = '';
    let attrs = '';

    // Tag Logic
    if (node.interaction?.type === 'link' && node.interaction?.targetPageId) {
        const target = pages.find(p => p.id === node.interaction.targetPageId);
        if (target) {
            tagName = 'a';
            href = ` href="${target.slug}.html"`;
        }
    } else if (node.type === 'image') {
        tagName = 'img';
    } else if (node.type === 'video') {
        tagName = 'video';
    } else if (node.type === 'text') {
        tagName = 'p';
        if (node.styles?.fontSize && parseInt(node.styles.fontSize) > 24) tagName = 'h1';
        else if (node.styles?.fontSize && parseInt(node.styles.fontSize) > 20) tagName = 'h2';
    } else if (node.type === 'button') {
        tagName = 'button';
    } else if (node.type === 'section') {
        tagName = 'section';
    }

    // Attributes
    attrs = `class="${className}"${idAttr}${href}`;

    // Content
    if (node.type === 'image') {
        return `<img ${attrs} src="${node.content || ''}" alt="Image" />`;
    }
    if (node.type === 'video') {
        return `<video ${attrs} src="${node.content || ''}" controls></video>`;
    }
    if (node.type === 'icon') {
        // Icons are often SVG strings in content
        if (node.content && node.content.startsWith('<svg')) {
            // Inject class into SVG? Or wrap it. Wrapping is safer.
            return `<div ${attrs}>${node.content}</div>`;
        }
        return `<div ${attrs}>${node.content}</div>`;
    }

    let childrenHtml = '';
    if (node.children) {
        childrenHtml = node.children.map(child => generateNodeHTML(child, pages, classMap)).join('\n');
    }

    if (node.type === 'text') {
        return `<${tagName} ${attrs}>${node.content}</${tagName}>`;
    }

    return `<${tagName} ${attrs}>
${childrenHtml}
</${tagName}>`;
};

export const generateZip = async (pages) => {
    const zip = new JSZip();

    // Global Maps
    const cssMap = new Map();
    const classMap = new Map();
    const counter = { idx: 0 };

    // 1. First Pass: Extract Validation & CSS
    pages.forEach(page => {
        extractStyles(page.content, cssMap, classMap, counter);
    });

    // 2. Build CSS File
    const cssContent = Array.from(cssMap.values()).join('\n\n');
    const cssFolder = zip.folder("css");
    cssFolder.file("style.css", cssContent);

    // 3. Build HTML Pages
    pages.forEach(page => {
        const bodyContent = generateNodeHTML(page.content, pages, classMap);
        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name}</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
${bodyContent}
</body>
</html>`;
        zip.file(`${page.slug}.html`, html);
    });

    // 4. Generate Zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "proyecto-web.zip");
};

export const generateProfessionalCode = (pages) => {
    const files = {};
    const cssMap = new Map();
    const classMap = new Map();
    const counter = { idx: 0 };

    // 1. Extract Styles
    pages.forEach(page => extractStyles(page.content, cssMap, classMap, counter));

    // 2. CSS Content
    files['css/style.css'] = Array.from(cssMap.values()).join('\n\n');

    // 3. HTML Content
    pages.forEach(page => {
        const bodyContent = generateNodeHTML(page.content, pages, classMap);
        files[`${page.slug}.html`] = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name}</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
${bodyContent}
</body>
</html>`;
    });

    return files;
};
