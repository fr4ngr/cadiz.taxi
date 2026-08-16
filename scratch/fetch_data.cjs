const fs = require('fs');

async function run() {
    const query = `[out:json]; area["name"="Cádiz"]["admin_level"="6"]->.prov; relation["admin_level"="8"](area.prov); out center;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    const data = await res.json();
    const towns = data.elements.filter(e => e.tags && e.tags.name).map(e => ({
        name: e.tags.name,
        lat: e.center ? e.center.lat : e.lat,
        lon: e.center ? e.center.lon : e.lon
    }));
    fs.writeFileSync('scratch/cadiz_towns.json', JSON.stringify(towns, null, 2));
    console.log('Got', towns.length, 'towns');
}
run().catch(console.error);
