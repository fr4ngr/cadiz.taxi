const fs = require('fs');

async function run() {
    const query = `[out:json]; area["name"="Cádiz"]["admin_level"="6"]->.prov; relation["admin_level"="8"](area.prov); out center;`;
    console.log('Fetching municipalities center from overpass...');
    const res = await fetch('https://overpass-api.de/api/interpreter', { 
        method: 'POST', 
        body: 'data=' + encodeURIComponent(query),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Gaditan-App/1.0'
        }
    });
    if (!res.ok) {
        console.log(await res.text());
        throw new Error('Status ' + res.status);
    }
    const data = await res.json();
    const towns = data.elements.map(e => ({
        id: e.id,
        name: e.tags.name,
        lat: e.center ? e.center.lat : (e.lat || 0),
        lon: e.center ? e.center.lon : (e.lon || 0)
    })).filter(t => t.lat !== 0);
    fs.writeFileSync('scratch/cadiz_municipalities_center.json', JSON.stringify(towns, null, 2));
    console.log('Saved', towns.length, 'municipalities');
}
run().catch(console.error);
