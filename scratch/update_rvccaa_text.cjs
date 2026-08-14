const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const search = 'Junta de Andalucía (RVCCAA)';
const replace = 'Junta de Andalucía (Red de Vigilancia y Control de la Calidad del Aire)';

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully expanded RVCCAA acronym');
} else {
    console.log('Could not find the target string to replace');
}
