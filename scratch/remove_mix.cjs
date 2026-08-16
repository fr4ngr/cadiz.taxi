const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const startStr = '<!-- Andalucia Mix -->';
const endStr = '<!-- National Mix -->';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex > -1 && endIndex > -1) {
    code = code.substring(0, startIndex) + code.substring(endIndex);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
    console.log('Removed Andalucian mix.');
} else {
    console.log('Could not find markers for Andalucian mix.');
}
