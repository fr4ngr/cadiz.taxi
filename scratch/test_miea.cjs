const fs = require('fs');
const execSync = require('child_process').execSync;

async function run() {
    console.log("Getting municipalities from D1...");
    // We execute a query on D1 to get the municipalities and their coordinates
    const output = execSync('npx wrangler d1 execute gaditan_data --remote --command="SELECT municipio_name as name, lat, lon as lng FROM autoconsumo_municipal" --json', { encoding: 'utf8' });
    const parsed = JSON.parse(output);
    const muns = parsed[0].results;
    console.log(`Loaded ${muns.length} municipalities.`);

    const capacities = {};
    for (const m of muns) {
        capacities[m.name] = {
            id: m.name,
            lat: m.lat,
            lng: m.lng,
            solar_mw: 0,
            eolica_mw: 0,
            hidro_mw: 0,
            biomasa_mw: 0
        };
    }

    const fetchWfs = async (typeName) => {
        console.log("Fetching", typeName);
        const wfsUrl = `http://www.agenciaandaluzadelaenergia.es/mapwms/MIEA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json&srsName=EPSG:4326`;
        const req = await fetch(wfsUrl);
        if (!req.ok) throw new Error(`Failed to load ${typeName}`);
        return await req.json();
    };

    const parsePotencia = (pStr) => {
        if (!pStr) return 0;
        const match = pStr.match(/([\d,.]+)/);
        if (match) {
            let numStr = match[1].replace(/\./g, '').replace(',', '.');
            return parseFloat(numStr) || 0;
        }
        return 0;
    };

    const types = [
        { id: 'csolares', field: 'solar_mw' },
        { id: 'cEolicas', field: 'eolica_mw' },
        { id: 'cHidroelectricas', field: 'hidro_mw' },
        { id: 'cBiomasa', field: 'biomasa_mw' },
        { id: 'cBiogas_otros', field: 'biomasa_mw' }
    ];

    const getDist = (lat1, lon1, lat2, lon2) => {
        const p = 0.017453292519943295;
        const c = Math.cos;
        const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
        return 12742 * Math.asin(Math.sqrt(a)); 
    };

    let mapped = 0;
    for (const t of types) {
        const geo = await fetchWfs(t.id);
        if (geo && geo.features) {
            for (const f of geo.features) {
                if (f.geometry && f.geometry.coordinates) {
                    let coords = f.geometry.coordinates;
                    if (f.geometry.type === 'MultiPoint') coords = coords[0];
                    if (!coords || coords.length < 2) continue;
                    
                    let minDist = Infinity;
                    let nearest = null;
                    
                    for (const m of muns) {
                        const d = getDist(coords[1], coords[0], m.lat, m.lng);
                        if (d < minDist) {
                            minDist = d;
                            nearest = m.name;
                        }
                    }
                    
                    // Filter those clearly in other provinces
                    if (nearest && minDist <= 25) {
                        const pot = parsePotencia(f.properties.POTENCIA);
                        capacities[nearest][t.field] += pot;
                        mapped++;
                    }
                }
            }
        }
    }

    console.log(`Mapped ${mapped} plants to Cadiz.`);

    const stmts = [];
    for (const munName in capacities) {
        const c = capacities[munName];
        const total = c.solar_mw + c.eolica_mw + c.hidro_mw + c.biomasa_mw;
        
        stmts.push(`
            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('${c.id.replace(/'/g, "''")}', '${c.id.replace(/'/g, "''")}', ${c.lat}, ${c.lng}, ${c.solar_mw}, ${c.eolica_mw}, ${c.hidro_mw}, ${c.biomasa_mw}, ${total})
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        `);
    }

    fs.writeFileSync('scratch/seed_miea.sql', stmts.join('\n'));
    console.log("Saving to D1...");
    execSync('npx wrangler d1 execute gaditan_data --remote --file=scratch/seed_miea.sql', { stdio: 'inherit' });
    console.log("Done!");
}

run().catch(console.error);
