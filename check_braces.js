
const fs = require('fs');
const path = require('path');

const filePath = 'builder/src/components/layout/PropertiesPanel.jsx';
const content = fs.readFileSync(filePath, 'utf8');

let braces = 0;
let parens = 0;
let brackets = 0;

let stack = [];

for (let i = 0; i < content.length; i++) {
    const char = content[i];

    // Simple state machine to skip strings and comments would be better, but let's try strict counting first
    // Note: This simple counter will fail on braces inside strings/regex, so it's an approximation.

    if (char === '{') {
        braces++;
        stack.push({ char, index: i });
    } else if (char === '}') {
        braces--;
        if (stack.length > 0 && stack[stack.length - 1].char === '{') {
            stack.pop();
        } else {
            console.log(`Unexpected } at index ${i} (line ${getLineNumber(i)})`);
        }
    } else if (char === '(') {
        parens++;
        stack.push({ char, index: i });
    } else if (char === ')') {
        parens--;
        if (stack.length > 0 && stack[stack.length - 1].char === '(') {
            stack.pop();
        } else {
            console.log(`Unexpected ) at index ${i} (line ${getLineNumber(i)})`);
        }
    } else if (char === '[') {
        brackets++;
        stack.push({ char, index: i });
    } else if (char === ']') {
        brackets--;
        if (stack.length > 0 && stack[stack.length - 1].char === '[') {
            stack.pop();
        } else {
            console.log(`Unexpected ] at index ${i} (line ${getLineNumber(i)})`);
        }
    }
}

if (stack.length > 0) {
    console.log('Unclosed items:');
    stack.forEach(item => {
        console.log(`Type: ${item.char}, Line: ${getLineNumber(item.index)}`);
    });
} else {
    console.log('All balanced!');
}

function getLineNumber(index) {
    return content.substring(0, index).split('\n').length;
}
