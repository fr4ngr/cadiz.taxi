const fs = require('fs');
async function run() {
    const query = `[out:json];
area["name"="Cádiz"]["admin_level"="6"]->.prov;
relation["admin_level"="8"](area.prov);
node(r:"admin_centre");
out;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', { 
        method: 'POST', 
        body: 'data=' + encodeURIComponent(query),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Gaditan-App/1.0' }
    });
    const d = await res.json();
    console.log('Got', d.elements.length, 'admin centres');
    const j = d.elements.find(e => e.tags && e.tags.name && e.tags.name.includes('Jerez'));
    console.log('Jerez admin_centre:', j);
    fs.writeFileSync('scratch/cadiz_admin_centres.json', JSON.stringify(d.elements, null, 2));
}
run();
