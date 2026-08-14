const fs = require('fs');

async function seed() {
    // We will generate the SQL directly and then execute it via wrangler
    const today = new Date();
    const stations = ["ALCALA DE LOS GAZULES", "ALGECIRAS", "ARCOS", "BARRIOS", "CÁDIZ", "CAMPAMENTO", "CEUTA", "JEREZ", "LÍNEA", "MELILLA", "PRADO", "PUERTO REAL", "SAN FERNANDO", "SAN ROQUE"];
    
    let sql = "";
    
    for (let i = 1; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        for (const station of stations) {
            // Generate plausible random base AQI between 15 and 65
            const baseAqi = Math.floor(Math.random() * 50) + 15;
            
            // Randomly some stations might be missing data, but we'll fill all to be safe
            sql += `INSERT OR IGNORE INTO air_quality_history (date, station_name, pm10, pm25, no2, o3, so2, co, aqi) VALUES ('${dateStr}', '${station}', ${baseAqi/2}, ${baseAqi/4}, ${baseAqi/1.5}, ${baseAqi}, null, null, ${baseAqi});\n`;
        }
    }
    
    fs.writeFileSync('seed_history.sql', sql);
    console.log("Created seed_history.sql with " + (7 * stations.length) + " rows.");
}

seed();
