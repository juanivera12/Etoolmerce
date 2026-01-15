
export const parseHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const body = doc.body;

    const createId = (type) => `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const domToNode = (element) => {
        const styles = {};
        if (element.style) {
            for (let i = 0; i < element.style.length; i++) {
                const prop = element.style[i];
                // Convert kebab-case to camelCase
                const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                styles[camelProp] = element.style.getPropertyValue(prop);
            }
        }

        let type = 'container';
        let content = null;

        const tagName = element.tagName.toLowerCase();

        if (tagName === 'img') {
            type = 'image';
            content = element.src;
        } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'p' || tagName === 'span') {
            type = 'text';
            content = element.innerText;
        } else if (tagName === 'section') {
            type = 'section';
        } else if (tagName === 'header') {
            type = 'header';
        } else if (tagName === 'footer') {
            type = 'footer';
        }

        const node = {
            id: createId(type),
            type,
            styles: { ...styles, padding: styles.padding || '10px' }, // ensure some padding
            children: []
        };

        if (content) {
            node.content = content;
        }

        if (type !== 'image' && type !== 'text') { // Text nodes handled via innerText usually, preventing duplicate children if text node
            Array.from(element.children).forEach(child => {
                const childNode = domToNode(child);
                if (childNode) {
                    node.children.push(childNode);
                }
            });
        }

        return node;
    };

    // If body has children, parse them. If it's a root div, use that.
    // For simplicity, we try to find the first wrapper or return a root page structure.

    // Simplistic approach: wrap everything in a root page
    const rootChildren = Array.from(body.children).map(domToNode);

    return {
        id: "root",
        type: "page",
        styles: {
            backgroundColor: "#ffffff",
            fontFamily: "Inter, sans-serif",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        },
        children: rootChildren
    };
};
