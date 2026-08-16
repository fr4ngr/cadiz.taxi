const fs = require('fs');
const content = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('gasolineras') || l.includes('aviones') || l.includes('Gasolineras') || l.includes('Vuelos')) {
        console.log(i + ':', l.trim());
    }
});
