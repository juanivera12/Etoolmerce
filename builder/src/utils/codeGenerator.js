export const generateHTML = (node) => {
    if (!node) return '';

    const styleString = Object.entries(node.styles || {})
        .map(([key, value]) => `${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value}`)
        .join('; ');

    if (node.type === 'text') {
        return `<div style="${styleString}">${node.content}</div>`;
    }

    if (node.type === 'image') {
        return `<img src="${node.content}" style="${styleString}" alt="Exported Image" />`;
    }

    const childrenHTML = node.children ? node.children.map(generateHTML).join('') : '';

    if (node.id === 'root') {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Site</title>
    <style>
        body { margin: 0; font-family: system-ui, sans-serif; }
        * { box-sizing: border-box; }
    </style>
</head>
<body>
    <div style="${styleString}; min-height: 100vh;">
        ${childrenHTML}
    </div>
</body>
</html>`;
    }

    return `<div style="${styleString}">${childrenHTML}</div>`;
};

export const generateReact = (node) => {
    const renderNode = (n, indent = 0) => {
        const spaces = ' '.repeat(indent);
        const styleObj = JSON.stringify(n.styles || {});

        if (n.type === 'text') {
            return `${spaces}<div style={${styleObj}}>${n.content}</div>`;
        }

        if (n.type === 'image') {
            return `${spaces}<img src="${n.content}" style={${styleObj}} alt="Exported" />`;
        }

        const children = n.children ? n.children.map(c => renderNode(c, indent + 2)).join('\n') : '';

        if (n.id === 'root') {
            return `export default function Page() {
  return (
    <div style={${styleObj}}>
${children}
    </div>
  );
}`;
        }

        return `${spaces}<div style={${styleObj}}>\n${children}\n${spaces}</div>`;
    };

    return renderNode(node);
};
