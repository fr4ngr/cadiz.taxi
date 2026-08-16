const fs = require('fs');

async function run() {
    // Fetch polygons of Cádiz municipalities
    const query = `[out:json]; area["name"="Cádiz"]["admin_level"="6"]->.prov; relation["admin_level"="8"](area.prov); out geom;`;
    console.log('Fetching municipalities polygons from overpass...');
    
    // We need to use overpass interpreter with geom, which might be large.
    const res = await fetch('https://overpass-api.de/api/interpreter', { 
        method: 'POST', 
        body: 'data=' + encodeURIComponent(query),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Gaditan-App/1.0' }
    });
    
    if (!res.ok) {
        throw new Error('Status ' + res.status);
    }
    
    const d = await res.json();
    fs.writeFileSync('scratch/cadiz_polygons.json', JSON.stringify(d));
    console.log('Saved polygons for', d.elements.length, 'municipalities');
}
run().catch(console.error);
