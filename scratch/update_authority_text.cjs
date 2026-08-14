const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const search = 'El mantenimiento corresponde a la administración pública.';
const replace = 'El mantenimiento corresponde a la Junta de Andalucía (RVCCAA).';

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully updated maintenance authority text');
} else {
    console.log('Could not find the target string to replace');
}
