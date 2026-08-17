const fs = require('fs');
const content = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');
const scriptMatches = content.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatches) {
    const code = scriptMatches[1];
    try {
        new Function(code);
        console.log('Valid JS');
    } catch (e) {
        console.log('Invalid JS:', e.message);
    }
}
