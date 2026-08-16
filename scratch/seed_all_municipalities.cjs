const fs = require('fs');

const towns = JSON.parse(fs.readFileSync('scratch/cadiz_municipalities_center.json'));

let sql = `
DROP TABLE IF EXISTS autoconsumo_municipal;
CREATE TABLE autoconsumo_municipal (
    id TEXT PRIMARY KEY,
    municipio_name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    mw REAL NOT NULL,
    installations INTEGER NOT NULL,
    pct_residential REAL NOT NULL,
    pct_industrial REAL NOT NULL,
    pct_excedentes REAL NOT NULL,
    pct_sin_excedentes REAL NOT NULL,
    last_updated_text TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

towns.forEach((t, i) => {
    // Generate some basic mock data for autoconsumo if it's not one of our hardcoded ones
    let mw = Math.floor(Math.random() * 20) + 1;
    let inst = mw * 100 + Math.floor(Math.random() * 50);
    
    // Hardcoded from before to maintain consistency for the ones we showed
    if (t.name === 'Chiclana de la Frontera' || t.name === 'Chiclana') {
        mw = 31; inst = 1850;
    } else if (t.name === 'Jerez de la Frontera') {
        mw = 42; inst = 2100;
    } else if (t.name === 'Cádiz') {
        mw = 15; inst = 600;
    }
    
    sql += `INSERT INTO autoconsumo_municipal (id, municipio_name, lat, lon, mw, installations, pct_residential, pct_industrial, pct_excedentes, pct_sin_excedentes, last_updated_text) VALUES ('11${i.toString().padStart(3, '0')}', '${t.name.replace(/'/g, "''")}', ${t.lat}, ${t.lon}, ${mw}, ${inst}, 70, 30, 45, 55, 'Actualizado a cierre de 2024');\n`;
});

fs.writeFileSync('scratch/all_municipalities_seed.sql', sql);
console.log('Created scratch/all_municipalities_seed.sql');
