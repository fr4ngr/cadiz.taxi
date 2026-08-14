const fs = require('fs');

let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const search = '<span style="font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.2;">Adolfina Martínez Guirado</span>';
const replace = '<a href="https://juntadeandalucia.es/organismos/sostenibilidadymedioambiente.html" target="_blank" style="font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.2; text-decoration: underline; text-decoration-color: #ef4444;">Adolfina Martínez Guirado</a>';

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully added link to Minister profile');
} else {
    console.log('Target string not found');
}
