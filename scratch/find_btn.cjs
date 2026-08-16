const fs = require('fs');
const content = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('data-layer=')) {
        console.log(i + ':', l.trim());
    }
});
