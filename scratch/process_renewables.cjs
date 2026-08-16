const fs = require('fs');
const proj4 = require('proj4');

// EPSG:25830 is UTM Zone 30N which covers Andalusia
proj4.defs("EPSG:25830", "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

const towns = JSON.parse(fs.readFileSync('scratch/cadiz_municipalities_center.json'));
const plants = JSON.parse(fs.readFileSync('scratch/wfs_renewables.json'));

// Haversine distance
function distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const townStats = {};
towns.forEach(t => {
    townStats[t.name] = { mw_eol: 0, mw_hid: 0, mw_biomasa: 0, mw_sol: 0, lat: t.lat, lon: t.lon };
});

let mappedCount = 0;

plants.forEach(p => {
    // some geometries are MultiPoint, some might be Point or MultiPolygon
    let x, y;
    if (p.geometry.type === 'MultiPoint') {
        x = p.geometry.coordinates[0][0];
        y = p.geometry.coordinates[0][1];
    } else if (p.geometry.type === 'Point') {
        x = p.geometry.coordinates[0];
        y = p.geometry.coordinates[1];
    } else if (p.geometry.type === 'MultiPolygon') {
        x = p.geometry.coordinates[0][0][0][0];
        y = p.geometry.coordinates[0][0][0][1];
    }
    
    if (!x || !y) return;
    
    const wgs84 = proj4("EPSG:25830", "EPSG:4326", [x, y]);
    const lon = wgs84[0];
    const lat = wgs84[1];
    
    // We only care about plants in Cádiz (Rough bounding box for Cádiz province)
    if (lat < 35.7 || lat > 37.1 || lon < -6.5 || lon > -5.1) return;
    
    // Find nearest town
    let nearest = null;
    let minDist = Infinity;
    towns.forEach(t => {
        const d = distance(lat, lon, t.lat, t.lon);
        if (d < minDist) {
            minDist = d;
            nearest = t.name;
        }
    });
    
    // If it's more than 25km away from any Cadiz town center, it might belong to Sevilla/Malaga
    if (minDist > 25) return;
    
    mappedCount++;
    
    let mw = 0;
    if (p.properties.POTENCIA) {
        mw = parseFloat(p.properties.POTENCIA.replace(',', '.').replace(/[^\d.]/g, ''));
    }
    
    if (p.properties._type === 'cEolicas') townStats[nearest].mw_eol += mw;
    if (p.properties._type === 'cHidroelectricas') townStats[nearest].mw_hid += mw;
    if (p.properties._type === 'cBiomasa') townStats[nearest].mw_biomasa += mw;
    if (p.properties._type === 'csolares') townStats[nearest].mw_sol += mw;
});

console.log('Mapped', mappedCount, 'plants to Cadiz municipalities');

// Output SQL to update or insert
let sql = `
CREATE TABLE IF NOT EXISTS raipee_municipal (
    municipio_name TEXT PRIMARY KEY,
    mw_eol REAL DEFAULT 0,
    mw_hid REAL DEFAULT 0,
    mw_biomasa REAL DEFAULT 0,
    mw_sol REAL DEFAULT 0
);
DELETE FROM raipee_municipal;
`;

for (const [name, stats] of Object.entries(townStats)) {
    if (stats.mw_eol > 0 || stats.mw_hid > 0 || stats.mw_biomasa > 0 || stats.mw_sol > 0) {
        sql += `INSERT INTO raipee_municipal (municipio_name, mw_eol, mw_hid, mw_biomasa, mw_sol) VALUES ('${name.replace(/'/g, "''")}', ${stats.mw_eol.toFixed(2)}, ${stats.mw_hid.toFixed(2)}, ${stats.mw_biomasa.toFixed(2)}, ${stats.mw_sol.toFixed(2)});\n`;
    }
}

fs.writeFileSync('scratch/raipee_seed.sql', sql);
console.log('Created scratch/raipee_seed.sql');
