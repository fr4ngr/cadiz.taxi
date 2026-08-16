const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// The radial menu button
code = code.replace(
    `<span style="font-size: 16px; margin-right: 4px;">☀️</span>
                    Energía Solar`,
    `<span style="font-size: 16px; margin-right: 4px;">🌱</span>
                    Renovables`
);

// The registry name (could be `name: 'Energía Solar'`)
code = code.replace(/name:\s*'Energía Solar'/g, "name: 'Energías Renovables'");
code = code.replace(/label:\s*'Energía Solar'/g, "label: 'Energías Renovables'");
code = code.replace(/label:\s*'🔆 ENERGÍA SOLAR'/g, "label: '🌱 ENERGÍAS RENOVABLES'");

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed names');
