const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

code = code.replace(/Agencia Andaluza de Energía y ESIOS/g, "Agencia Andaluza de la Energía y Red Eléctrica de España");

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed acronyms in footer.');
