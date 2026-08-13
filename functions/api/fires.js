// functions/api/fires.js

export async function onRequest(context) {
    const { request, env } = context;

    try {
        const urls = [
            'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Europe_7d.csv',
            'https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Europe_7d.csv',
            'https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Europe_7d.csv',
            'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Northern_and_Central_Africa_7d.csv',
            'https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Northern_and_Central_Africa_7d.csv',
            'https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Northern_and_Central_Africa_7d.csv'
        ];

        const responses = await Promise.all(urls.map(u => fetch(u, {
            headers: { 'User-Agent': 'Gaditan-App/1.0' }
        })));
        const texts = await Promise.all(responses.map(r => r.text()));
        
        // Polígonos aproximados para aislar España/Portugal y evitar Marruecos/Argelia
        const isInSpainOrPortugal = (lat, lon) => {
            if (lat >= 35.95 && lat <= 44.0 && lon >= -9.5 && lon <= 4.5) return true; // Peninsula & Baleares
            if (lat >= 27.5 && lat <= 29.5 && lon >= -18.5 && lon <= -13.0) return true; // Canarias
            if (lat >= 35.85 && lat <= 35.92 && lon >= -5.40 && lon <= -5.25) return true; // Ceuta
            if (lat >= 35.25 && lat <= 35.33 && lon >= -3.00 && lon <= -2.90) return true; // Melilla
            return false;
        };
        
        // Grid para clustering espacial (1x1 km aprox = 2 decimales)
        const grid = new Map();
        
        for (const text of texts) {
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            // Header: latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_t31,frp,daynight
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',');
                if (parts.length < 10) continue;
                
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                
                if (isInSpainOrPortugal(lat, lon)) {
                    // Correct column indices: 
                    // 7: satellite, 8: confidence, 9: version, 11: frp, 12: daynight
                    const confidence = parts[8];
                    if (confidence === 'low' || confidence === 'l') continue;

                    // Parse timestamp: YYYY-MM-DD y HHMM (UTC)
                    const acq_date = parts[5];
                    const acq_time = parts[6].padStart(4, '0');
                    const timestamp = new Date(`${acq_date}T${acq_time.slice(0, 2)}:${acq_time.slice(2, 4)}:00Z`).getTime();
                    
                    if (isNaN(timestamp)) continue;

                    // Clave del grid para clustering espacial a 2 decimales (~1.1 km)
                    const gridLat = Math.round(lat * 100) / 100;
                    const gridLon = Math.round(lon * 100) / 100;
                    const gridId = `${gridLat.toFixed(2)}_${gridLon.toFixed(2)}`;

                    if (!grid.has(gridId)) {
                        grid.set(gridId, {
                            gridLat, gridLon,
                            firstSeen: timestamp,
                            lastSeen: timestamp,
                            points: []
                        });
                    }

                    const cell = grid.get(gridId);
                    if (timestamp < cell.firstSeen) cell.firstSeen = timestamp;
                    if (timestamp > cell.lastSeen) cell.lastSeen = timestamp;
                    
                    // Mapeo de satélites
                    let satName = parts[7];
                    if (satName === 'A') satName = 'Aqua (NASA/MODIS)';
                    else if (satName === 'T') satName = 'Terra (NASA/MODIS)';
                    else if (satName === 'N20' || satName === 'J1') satName = 'NOAA-20 (NOAA/VIIRS)';
                    else if (satName === '1' || satName === 'N' || satName === 'S') satName = 'Suomi NPP (NASA/VIIRS)';

                    // Guardar el punto (redondeado a 3 decimales para id único de capa renderizada)
                    const latRound = lat.toFixed(3);
                    const lonRound = lon.toFixed(3);
                    const id = `${latRound}_${lonRound}`;
                    
                    // No añadir duplicados exactos en la misma celda
                    if (!cell.points.some(p => p.id === id)) {
                        cell.points.push({
                            id: id,
                            lat: lat,
                            lon: lon,
                            tempC: Math.round(parseFloat(parts[2]) - 273.15),
                            date: acq_date,
                            time: acq_time,
                            confidence: confidence,
                            satellite: satName,
                            frp: parseFloat(parts[11]) || 0,
                            daynight: (parts[12] || 'D').trim(),
                            timestamp: timestamp
                        });
                    }
                }
            }
        }
        
        const now = Date.now();
        const activeFires = [];

        // Evaluar lógica espaciotemporal en cada celda del grid
        for (const [gridId, cell] of grid.entries()) {
            const ageHours = (cell.lastSeen - cell.firstSeen) / (1000 * 60 * 60);
            const hoursSinceLastDetection = (now - cell.lastSeen) / (1000 * 60 * 60);

            // FILTRO 1: Fuegos Extinguidos
            // Si hace más de 24 horas que el satélite no detecta calor aquí, se asume extinguido
            if (hoursSinceLastDetection > 24) continue;

            // FILTRO 2: Falsos Positivos Industriales (Persistencia)
            // Si la celda lleva dando calor más de 72 horas (3 días)...
            if (ageHours > 72) {
                // Comprobar si se ha propagado a celdas vecinas
                let hasNeighbors = false;
                for (let dLat = -0.01; dLat <= 0.01; dLat += 0.01) {
                    for (let dLon = -0.01; dLon <= 0.01; dLon += 0.01) {
                        if (dLat === 0 && dLon === 0) continue;
                        const nLat = (cell.gridLat + dLat).toFixed(2);
                        const nLon = (cell.gridLon + dLon).toFixed(2);
                        if (grid.has(`${nLat}_${nLon}`)) {
                            hasNeighbors = true;
                            break;
                        }
                    }
                    if (hasNeighbors) break;
                }
                
                // Si es un foco estático sin propagación tras 3 días, es industria (descartar)
                if (!hasNeighbors) continue;
            }

            // Si pasa los filtros, enviar solo el punto más intenso/reciente o todos.
            // Para mantener el efecto visual de "área", enviamos todos los puntos activos de la celda.
            activeFires.push(...cell.points.filter(p => (now - p.timestamp) / (1000 * 60 * 60) <= 24));
        }

        const response = new Response(JSON.stringify(activeFires), {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store',
                'X-Fire-Count': String(activeFires.length)
            }
        });

        return response;

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
