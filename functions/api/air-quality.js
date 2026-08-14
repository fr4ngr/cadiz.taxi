export async function onRequest(context) {
    const { env } = context;
    // Check cache first
    const cache = caches.default;
    const url = new URL(context.request.url);
    const cacheKey = new Request(url.toString(), {
        headers: context.request.headers,
        method: 'GET'
    });
    
    let response = await cache.match(cacheKey);
    if (response) {
        return response;
    }

    const openaqKey = env.OPENAQ_API_KEY;
    const headers = {
        'X-API-Key': openaqKey,
        'Content-Type': 'application/json'
    };

    try {
        // 1. Fetch metadata for all locations in Cádiz province bounding box
        // 1. Fetch metadata for all locations in the expanded bounding box (Cadiz, Ceuta, Melilla)
        const locationsRes = await fetch('https://api.openaq.org/v3/locations?bbox=-6.5,35.0,-2.5,37.0&limit=100', { headers });
        if (!locationsRes.ok) {
            throw new Error(`OpenAQ /locations returned ${locationsRes.status}`);
        }
        const locationsData = await locationsRes.json();
        
        // 2. Filter locations to only include Cadiz province, Ceuta, and Melilla
        const allowedLocalities = ["SAN ROQUE", "ALGECIRAS", "SAN FERNANDO", "CÁDIZ", "ARCOS", "JEREZ", "BARRIOS", "PUERTO REAL", "LÍNEA", "PRADO", "CEUTA", "MELILLA"];
        
        const selectedLocations = locationsData.results.filter(l => 
            l.locality && allowedLocalities.some(allowed => l.locality.toUpperCase().includes(allowed))
        );

        // 3. For each selected location, fetch its latest measurements
        const finalData = [];
        
        // Batch the requests to avoid hitting OpenAQ rate limits (5 req/sec)
        const batchSize = 5;
        for (let i = 0; i < selectedLocations.length; i += batchSize) {
            const batch = selectedLocations.slice(i, i + batchSize);
            await Promise.all(batch.map(async (loc) => {
                try {
                    const latestRes = await fetch(`https://api.openaq.org/v3/locations/${loc.id}/latest`, { headers });
                    if (!latestRes.ok) {
                        console.error(`Rate limited or error for ${loc.name}: ${latestRes.status}`);
                        return;
                    }
                    const latestData = await latestRes.json();
                    
                    // Map sensor IDs to parameter names using the metadata we fetched earlier
                    const sensorMap = {};
                    loc.sensors.forEach(s => {
                        sensorMap[s.id] = s.parameter.name; // e.g. 'pm10', 'no2'
                    });

                    // Extract values
                    const readings = { pm10: null, pm25: null, no2: null, o3: null, so2: null, co: null };
                    let stationTimestamp = 0;
                    latestData.results.forEach(measurement => {
                        const param = sensorMap[measurement.sensorsId];
                        
                        let ts = 0;
                        try {
                            if (measurement.period && measurement.period.datetimeTo && measurement.period.datetimeTo.utc) {
                                ts = new Date(measurement.period.datetimeTo.utc).getTime();
                            } else if (measurement.datetime && measurement.datetime.utc) {
                                ts = new Date(measurement.datetime.utc).getTime();
                            } else if (measurement.datetime) {
                                ts = new Date(measurement.datetime).getTime();
                            }
                            if (ts > stationTimestamp) stationTimestamp = ts;
                        } catch (e) {}

                        if (param && readings[param] !== undefined) {
                            // Ignore negative values (sensor error codes like -1 or -999)
                            // Ignore stale values (> 24 hours old)
                            const isStale = ts > 0 && (Date.now() - ts) > 1440 * 60000;
                            if (measurement.value >= 0 && !isStale) {
                                readings[param] = measurement.value;
                            }
                        }
                    });
                    if (stationTimestamp === 0) stationTimestamp = Date.now();

                    // Calculate EAQI (European Air Quality Index) simplification
                    const hasAnyData = readings.no2 !== null || readings.o3 !== null || readings.pm10 !== null || readings.pm25 !== null;
                    
                    let aqi = 'N/D';
                    let status = "Sin Datos";
                    let color = "#94a3b8"; // Gray

                    if (hasAnyData) {
                        const no2 = readings.no2 || 0;
                        const o3 = readings.o3 || 0;
                        const pm10 = readings.pm10 || 0;
                        const pm25 = readings.pm25 || 0;

                        aqi = 10; // default good
                        if (no2 > 40 || o3 > 50 || pm10 > 20 || pm25 > 10) aqi = 30; // Fair
                        if (no2 > 90 || o3 > 100 || pm10 > 40 || pm25 > 20) aqi = 60; // Moderate
                        if (no2 > 120 || o3 > 130 || pm10 > 50 || pm25 > 25) aqi = 80; // Poor
                        if (no2 > 230 || o3 > 240 || pm10 > 100 || pm25 > 50) aqi = 110; // Very Poor

                        status = "Buena";
                        color = "#10b981"; // Green
                        
                        if (aqi > 20) { status = "Regular"; color = "#eab308"; } // Yellow
                        if (aqi > 40) { status = "Moderada"; color = "#f97316"; } // Orange
                        if (aqi > 60) { status = "Mala"; color = "#ef4444"; } // Red
                        if (aqi > 100) { status = "Muy Mala"; color = "#8b5cf6"; } // Purple
                    }

                    const supportedSensors = loc.sensors.map(s => s.parameter.name);

                    finalData.push({
                        name: loc.name,
                        city: loc.locality,
                        lat: loc.coordinates.latitude,
                        lon: loc.coordinates.longitude,
                        pm10: supportedSensors.includes('pm10') ? (readings.pm10 !== null ? readings.pm10.toFixed(1) : null) : undefined,
                        pm25: supportedSensors.includes('pm25') ? (readings.pm25 !== null ? readings.pm25.toFixed(1) : null) : undefined,
                        no2: supportedSensors.includes('no2') ? (readings.no2 !== null ? readings.no2.toFixed(1) : null) : undefined,
                        o3: supportedSensors.includes('o3') ? (readings.o3 !== null ? readings.o3.toFixed(1) : null) : undefined,
                        so2: supportedSensors.includes('so2') ? (readings.so2 !== null ? readings.so2.toFixed(1) : null) : undefined,
                        co: supportedSensors.includes('co') ? (readings.co !== null ? readings.co.toFixed(1) : null) : undefined,
                        aqi: aqi,
                        status: status,
                        color: color,
                        timestamp: stationTimestamp
                    });
                } catch (err) {
                    console.error(`Error fetching latest for ${loc.name}:`, err);
                }
            }));
            
            // Wait 250ms between batches to prevent 429 Too Many Requests
            if (i + batchSize < selectedLocations.length) {
                await new Promise(resolve => setTimeout(resolve, 250));
            }
        }

                // DB History Integration
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const { results: history } = await env.DB.prepare('SELECT * FROM air_quality_history WHERE date >= date(\'now\', \'-7 days\')').all();
            
            // Group by station
            const historyByStation = {};
            history.forEach(row => {
                if (!historyByStation[row.station_name]) historyByStation[row.station_name] = [];
                historyByStation[row.station_name].push(row);
            });

            const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            let needsInsertToday = false;

            finalData.forEach(station => {
                const h = historyByStation[station.name] || [];
                const yesterdayRow = h.find(r => r.date === yesterdayStr);
                
                if (yesterdayRow && yesterdayRow.aqi) {
                    station.trend_yesterday_aqi = Math.round(((station.aqi - yesterdayRow.aqi) / yesterdayRow.aqi) * 100);
                }
                
                const last7d = h.filter(r => r.date !== todayStr);
                if (last7d.length > 0) {
                    const sumAqi = last7d.reduce((sum, r) => sum + (r.aqi || 0), 0);
                    const avg7d = sumAqi / last7d.length;
                    station.trend_7d_aqi = Math.round(((station.aqi - avg7d) / avg7d) * 100);
                }
                
                if (!h.find(r => r.date === todayStr)) needsInsertToday = true;
            });

            if (needsInsertToday && finalData.length > 0) {
                const stmt = env.DB.prepare('INSERT OR IGNORE INTO air_quality_history (date, station_name, pm10, pm25, no2, o3, so2, co, aqi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
                const batch = finalData.map(s => stmt.bind(todayStr, s.name, s.pm10, s.pm25, s.no2, s.o3, s.so2, s.co, s.aqi));
                context.waitUntil(env.DB.batch(batch));
            }
        } catch(e) { console.error('DB Error', e); }

        const finalResponse = new Response(JSON.stringify(finalData), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });

        // Store in cache
        context.waitUntil(cache.put(cacheKey, finalResponse.clone()));

        return finalResponse;

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
