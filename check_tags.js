
const fs = require('fs');
const path = require('path');

const filePath = 'builder/src/components/layout/PropertiesPanel.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Primitive tag matcher
// We will look for <tag and </tag
// ignoring self-closing <tag />

let openTags = [];
const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

// Regex to find tags
const regex = /<\/?([a-zA-Z0-9\-\.]+)([^>]*?)(\/?)>/g;
let match;

// We need to handle lines to report error
function getLineNumber(index) {
    return content.substring(0, index).split('\n').length;
}

while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const isClosing = fullMatch.startsWith('</');
    const tagName = match[1];
    const attributes = match[2];
    const isSelfClosing = match[3] === '/' || voidElements.includes(tagName.toLowerCase());

    // Ignore JSDoc kind of things or fragments if handled poorly
    if (tagName === '') continue; // <> fragment

    if (isClosing) {
        if (openTags.length === 0) {
            console.log(`Unexpected closing tag </${tagName}> at line ${getLineNumber(match.index)}`);
        } else {
            const last = openTags.pop();
            if (last.tagName !== tagName) {
                // If fragments, matches usually are empty string?
                if (tagName === '>' && last.tagName === '') {
                    // Fragment close </> matches <>
                } else {
                    console.log(`Mismatch: Expected </${last.tagName}> but found </${tagName}> at line ${getLineNumber(match.index)}. Last opened at line ${last.line}`);
                    // Push it back to keep checking? Or assume missed closing?
                    // Let's simple validation
                }
            }
        }
    } else {
        if (!isSelfClosing) {
            openTags.push({ tagName, line: getLineNumber(match.index) });
        }
    }
}

if (openTags.length > 0) {
    console.log('Unclosed tags:');
    openTags.forEach(t => console.log(`${t.tagName} at line ${t.line}`));
} else {
    console.log('Tags balanced');
}
