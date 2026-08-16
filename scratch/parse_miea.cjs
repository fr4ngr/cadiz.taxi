const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\frn\\.gemini\\antigravity\\brain\\59230b3b-245c-41eb-85a6-b3ab1b3946c6\\.system_generated\\steps\\12990\\content.md', 'utf8');

const regex = /<Layer queryable="1" opaque="0">\s*<Name>(.*?)<\/Name>\s*<Title>(.*?)<\/Title>\s*(?:<Abstract>([\s\S]*?)<\/Abstract>)?/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const title = match[2];
    const abstract = match[3] ? match[3].replace(/\n|\r/g, ' ').replace(/\s+/g, ' ').trim() : 'Sin descripción';
    console.log(`- **${title}** (\`${name}\`): ${abstract}`);
}
