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
        const baseRules = [];
        const mediaQueries = [];

        Object.entries(node.styles).forEach(([key, value]) => {
            if (key.startsWith('@media')) {
                // Handle Media Query Object
                const mediaRules = Object.entries(value).map(([mk, mv]) => {
                    const cssMk = mk.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return `${cssMk}: ${mv};`;
                }).join(' ');
                mediaQueries.push({ query: key, rules: mediaRules });
            } else {
                // Handle Normal Style
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                baseRules.push(`${cssKey}: ${value};`);
            }
        });

        const rulesString = baseRules.join(' ');

        let finalClassName = className;

        if (!cssMap.has(className)) {
            cssMap.set(className, `.${className} { ${rulesString} }`);
        } else {
            const existingRule = cssMap.get(className);
            // Simple collision check for base rules
            if (!existingRule.includes(rulesString)) {
                finalClassName = `${className}-${counter.idx}`;
                cssMap.set(finalClassName, `.${finalClassName} { ${rulesString} }`);
                classMap.set(node.id, finalClassName);
            }
        }

        // 3. Append Media Queries
        mediaQueries.forEach(mq => {
            // Append to map. We need a unique key for the map, but the CSS output will be concatenated.
            // We can treat media queries as separate "classes" in the map but they wrap the selector.
            const uniqueMqKey = `${finalClassName}-${mq.query}`;
            // Format: @media (...) { .classname { rules } }
            cssMap.set(uniqueMqKey, `${mq.query} { .${finalClassName} { ${mq.rules} } }`);
        });
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

const extractScripts = (node, scriptList) => {
    if (!node) return;

    if (node.type === 'cartWidget') {
        const btnId = `${node.id}-btn`;
        const dropdownId = `${node.id}-dropdown`;

        scriptList.push(`
            // Cart Widget Toggle Logic for ${node.id}
            const cartBtn_${node.id} = document.getElementById('${btnId}');
            const cartDropdown_${node.id} = document.getElementById('${dropdownId}');
            
            if(cartBtn_${node.id} && cartDropdown_${node.id}) {
                cartBtn_${node.id}.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isHidden = cartDropdown_${node.id}.style.display === 'none' || cartDropdown_${node.id}.style.display === '';
                    
                    // Close all other dropdowns
                    document.querySelectorAll('[id$="-dropdown"]').forEach(el => el.style.display = 'none');
                    
                    cartDropdown_${node.id}.style.display = isHidden ? 'flex' : 'none';
                });

                // Close on click outside
                document.addEventListener('click', (e) => {
                    if (!cartBtn_${node.id}.contains(e.target) && !cartDropdown_${node.id}.contains(e.target)) {
                        cartDropdown_${node.id}.style.display = 'none';
                    }
                });
            }
        `);
    }

    if (node.type === 'header') {
        const burgerId = `${node.id}-bgr`;
        const mobileMenuId = `${node.id}-mob`;

        scriptList.push(`
            // Mobile Menu Logic for ${node.id}
            const burger_${node.id} = document.getElementById('${burgerId}');
            const mobileMenu_${node.id} = document.getElementById('${mobileMenuId}');
            
            if(burger_${node.id} && mobileMenu_${node.id}) {
                burger_${node.id}.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isHidden = mobileMenu_${node.id}.style.display === 'none' || mobileMenu_${node.id}.style.display === '';
                    mobileMenu_${node.id}.style.display = isHidden ? 'flex' : 'none';
                });
                
                // Close menu on resize to desktop
                window.addEventListener('resize', () => {
                     if(window.innerWidth > 768) {
                         mobileMenu_${node.id}.style.display = 'none';
                     }
                });
            }
        `);
    }

    if (node.type === 'searchBar') {
        const inputId = `${node.id}-input`;
        const resultsId = `${node.id}-results`;

        scriptList.push(`
            // Search Bar Interactions for ${node.id}
            const searchInput_${node.id} = document.getElementById('${inputId}');
            const searchResults_${node.id} = document.getElementById('${resultsId}');
            
            if(searchInput_${node.id} && searchResults_${node.id}) {
                // Show interactions
                const showResults = () => {
                    searchResults_${node.id}.style.display = 'flex';
                };
                
                const hideResults = () => {
                   // Delay to allow clicking on results
                   setTimeout(() => {
                       searchResults_${node.id}.style.display = 'none';
                   }, 200);
                };

                searchInput_${node.id}.addEventListener('focus', showResults);
                searchInput_${node.id}.addEventListener('input', showResults);
                searchInput_${node.id}.addEventListener('blur', hideResults);
                
                // Clicking results handles
                searchResults_${node.id}.addEventListener('click', () => {
                    alert('Navegando al producto...');
                });
            }
        `);
    }

    if (node.type === 'filters') {
        const knobId = `${node.id}-knob`;
        const fillId = `${node.id}-fill`;
        const minId = `${node.id}-min`;
        const maxId = `${node.id}-max`;

        scriptList.push(`
            // Filters Logic for ${node.id}
            const knob_${node.id} = document.getElementById('${knobId}');
            const minLabel_${node.id} = document.getElementById('${minId}');
            const maxLabel_${node.id} = document.getElementById('${maxId}');
            
            if(knob_${node.id}) {
                knob_${node.id}.style.cursor = 'grab';
                
                // Simulación visual: Al hacer click, cambiar precio random
                knob_${node.id}.addEventListener('mousedown', () => {
                   const randomMax = Math.floor(Math.random() * 500) + 100;
                   if(maxLabel_${node.id}) maxLabel_${node.id}.innerText = '$' + randomMax;
                   alert('Filtro de precio actualizado: $0 - $' + randomMax);
                });
            }
        `);
    }

    if (node.type === 'countdown') {
        const hId = `${node.id}-h`;
        const mId = `${node.id}-m`;
        const sId = `${node.id}-s`;

        scriptList.push(`
             // Countdown Logic for ${node.id}
             const countDownDate_${node.id} = new Date(Date.now() + 86400000).getTime(); // 24h from now

             const x_${node.id} = setInterval(function() {
                const now = new Date().getTime();
                const distance = countDownDate_${node.id} - now;

                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const hEl = document.getElementById('${hId}');
                const mEl = document.getElementById('${mId}');
                const sEl = document.getElementById('${sId}');

                if(hEl) hEl.innerText = hours < 10 ? '0' + hours : hours;
                if(mEl) mEl.innerText = minutes < 10 ? '0' + minutes : minutes;
                if(sEl) sEl.innerText = seconds < 10 ? '0' + seconds : seconds;

                if (distance < 0) {
                    clearInterval(x_${node.id});
                    if(hEl) hEl.innerText = "00";
                    if(mEl) mEl.innerText = "00";
                    if(sEl) sEl.innerText = "00";
                }
             }, 1000);
        `);
    }

    // Check for newsletter input/button if applicable in specific structures
    // Assuming generic newsletter with button type='button' inside acting as submit

    if (node.children) {
        node.children.forEach(child => extractScripts(child, scriptList));
    }
};

export const generateZip = async (pages) => {
    const zip = new JSZip();

    // Global Maps
    const cssMap = new Map();
    const classMap = new Map();
    const counter = { idx: 0 };
    const scriptList = [];

    // 1. First Pass: Extract Validation, CSS & Scripts
    pages.forEach(page => {
        extractStyles(page.content, cssMap, classMap, counter);
        extractScripts(page.content, scriptList);
    });

    // 2. Build CSS File
    const cssContent = Array.from(cssMap.values()).join('\n\n');
    const cssFolder = zip.folder("css");
    cssFolder.file("style.css", cssContent);

    // 3. Build JS File
    const jsContent = `document.addEventListener('DOMContentLoaded', () => {
        console.log('E-Commerce Builder Scripts Loaded');
        ${scriptList.join('\n')}
    });`;
    const jsFolder = zip.folder("js");
    jsFolder.file("script.js", jsContent);

    // 4. Build HTML Pages
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
    <script src="js/script.js"></script>
</body>
</html>`;
        zip.file(`${page.slug}.html`, html);
    });

    // 5. Generate Zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "proyecto-web.zip");
};

export const generateProfessionalCode = (pages) => {
    const files = {};
    const cssMap = new Map();
    const classMap = new Map();
    const counter = { idx: 0 };
    const scriptList = [];

    // 1. Extract Styles & Scripts
    pages.forEach(page => {
        extractStyles(page.content, cssMap, classMap, counter);
        extractScripts(page.content, scriptList);
    });

    // 2. CSS Content
    files['css/style.css'] = Array.from(cssMap.values()).join('\n\n');

    // 3. JS Content
    files['js/script.js'] = `document.addEventListener('DOMContentLoaded', () => {
        ${scriptList.join('\n')}
    });`;

    // 4. HTML Content
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
    <script src="js/script.js"></script>
</body>
</html>`;
    });

    return files;
};
