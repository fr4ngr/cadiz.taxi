const fs = require('fs');

async function downloadPolygons() {
    console.log("Downloading Cadiz municipalities from Overpass...");
    const query = `
        [out:json];
        area["name"="Cádiz"]["admin_level"="6"]->.cadiz;
        relation["admin_level"="8"](area.cadiz);
        out geom;
    `;
    const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    });
    const data = await res.json();
    
    const geojson = {
        type: "FeatureCollection",
        features: []
    };
    
    for (const rel of data.elements) {
        if (rel.type !== 'relation' || !rel.members) continue;
        
        let coords = [];
        // Combine way members into a polygon outline (naive approach for valid Overpass geoms)
        for (const m of rel.members) {
            if (m.type === 'way' && m.geometry) {
                coords.push(...m.geometry.map(p => [p.lon, p.lat]));
            }
        }
        
        if (coords.length > 0) {
            geojson.features.push({
                type: "Feature",
                properties: {
                    name: rel.tags.name || rel.tags['name:es']
                },
                geometry: {
                    type: "Polygon",
                    coordinates: [coords]
                }
            });
        }
    }
    
    fs.writeFileSync('public/data/cadiz_municipios.geojson', JSON.stringify(geojson));
    console.log("Saved to public/data/cadiz_municipios.geojson! Features:", geojson.features.length);
}

downloadPolygons();
