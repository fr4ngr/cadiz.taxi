const fs = require('fs');
const proj4 = require('proj4');
const turf = require('@turf/turf');
const osmtogeojson = require('osmtogeojson');

proj4.defs("EPSG:25830", "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

const osmData = JSON.parse(fs.readFileSync('scratch/cadiz_polygons.json', 'utf8'));
const geojson = osmtogeojson(osmData);
const municipalities = geojson.features.filter(f => f.properties && f.properties.admin_level === '8');

const plants = JSON.parse(fs.readFileSync('scratch/wfs_renewables.json', 'utf8'));

const townStats = {};
municipalities.forEach(t => {
    townStats[t.properties.name] = { mw_eol: 0, mw_hid: 0, mw_biomasa: 0, mw_sol: 0 };
});

let mappedCount = 0;

plants.forEach(p => {
    let x, y;
    if (p.geometry.type === 'MultiPoint') { x = p.geometry.coordinates[0][0]; y = p.geometry.coordinates[0][1]; }
    else if (p.geometry.type === 'Point') { x = p.geometry.coordinates[0]; y = p.geometry.coordinates[1]; }
    else if (p.geometry.type === 'MultiPolygon') { x = p.geometry.coordinates[0][0][0][0]; y = p.geometry.coordinates[0][0][0][1]; }
    
    if (!x || !y) return;
    
    const wgs84 = proj4("EPSG:25830", "EPSG:4326", [x, y]);
    const lon = wgs84[0];
    const lat = wgs84[1];
    
    const pt = turf.point([lon, lat]);
    
    let nearest = null;
    for (const town of municipalities) {
        if (town.geometry.type === 'Polygon' || town.geometry.type === 'MultiPolygon') {
            if (turf.booleanPointInPolygon(pt, town)) {
                nearest = town.properties.name;
                break;
            }
        }
    }
    
    // Fallback: If not inside any polygon (e.g., offshore or right on the border), find nearest polygon edge
    if (!nearest) {
        let minDist = Infinity;
        for (const town of municipalities) {
            // pointToLineDistance or something. Let's just use point to point distance for fallback to center
            const center = turf.center(town);
            const d = turf.distance(pt, center);
            if (d < minDist && d < 25) { // 25km threshold
                minDist = d;
                nearest = town.properties.name;
            }
        }
    }
    
    if (!nearest) return;
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

let sql = `
DELETE FROM raipee_municipal;
`;

for (const [name, stats] of Object.entries(townStats)) {
    if (stats.mw_eol > 0 || stats.mw_hid > 0 || stats.mw_biomasa > 0 || stats.mw_sol > 0) {
        sql += `INSERT INTO raipee_municipal (municipio_name, mw_eol, mw_hid, mw_biomasa, mw_sol) VALUES ('${name.replace(/'/g, "''")}', ${stats.mw_eol.toFixed(2)}, ${stats.mw_hid.toFixed(2)}, ${stats.mw_biomasa.toFixed(2)}, ${stats.mw_sol.toFixed(2)});\n`;
    }
}

fs.writeFileSync('scratch/raipee_seed_turf.sql', sql);
console.log('Created scratch/raipee_seed_turf.sql');
