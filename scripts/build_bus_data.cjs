const fs = require('fs');
const path = require('path');

const API_BASE = 'http://api.ctan.es/v1/Consorcios/2';
const OUTPUT_FILE = path.join(__dirname, '../public/data/bus_cadiz.json');

async function fetchJson(url) {
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

async function buildBusData() {
    try {
        console.log('--- Starting Bus Data Build ---');
        
        // 1. Fetch all lines
        const linesData = await fetchJson(`${API_BASE}/lineas`);
        const lineas = linesData.lineas || [];
        console.log(`Found ${lineas.length} lines.`);

        const finalData = {
            last_updated: new Date().toISOString(),
            lineas: {},
            rutas: {}
        };

        // We don't want to hit the API too fast, so we'll fetch sequentially or in small batches
        for (const linea of lineas) {
            const id = linea.idLinea;
            finalData.lineas[id] = {
                codigo: linea.codigo,
                nombre: linea.nombre
            };

            try {
                const horarios = await fetchJson(`${API_BASE}/horarios_lineas?linea=${id}`);
                
                if (horarios.planificadores && horarios.planificadores.length > 0) {
                    const plani = horarios.planificadores[0]; // Take current valid plan
                    
                    finalData.rutas[id] = {
                        nucleosIda: plani.nucleosIda ? plani.nucleosIda.map(n=>n.nombre) : [],
                        bloquesIda: plani.bloquesIda ? plani.bloquesIda.map(b => b.nombre) : [],
                        horarioIda: plani.horarioIda || [],
                        nucleosVuelta: plani.nucleosVuelta ? plani.nucleosVuelta.map(n=>n.nombre) : [],
                        bloquesVuelta: plani.bloquesVuelta ? plani.bloquesVuelta.map(b => b.nombre) : [],
                        horarioVuelta: plani.horarioVuelta || [],
                        frecuencias: horarios.frecuencias || []
                    };
                } else {
                    console.log(`  No schedule data for line ${linea.codigo}`);
                }
            } catch (err) {
                console.error(`  Error fetching schedules for line ${linea.codigo}: ${err.message}`);
            }

            // small delay to be nice to the API
            await new Promise(r => setTimeout(r, 200));
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
        console.log(`--- Bus Data Build Complete ---`);
        console.log(`Saved to ${OUTPUT_FILE}`);

    } catch (e) {
        console.error('Failed to build bus data:', e);
    }
}

buildBusData();
