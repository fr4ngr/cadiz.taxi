const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Rename registry key
code = code.replace(/'autoconsumo':\s*\{/g, "'renovables': {");

// Rename onclick
code = code.replace(/window\.selectMapLayer\('autoconsumo'\)/g, "window.selectMapLayer('renovables')");

// Fix the HTML label (handling CRLF or LF whitespace)
code = code.replace(/<span style="font-size: 16px; margin-right: 4px;">☀️<\/span>\s*Energía Solar/g, '<span style="font-size: 16px; margin-right: 4px;">🌱</span>\n                    Energías Renovables');

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed names and keys.');
