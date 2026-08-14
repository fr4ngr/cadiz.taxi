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
                        if (param && readings[param] !== undefined) {
                            readings[param] = measurement.value;
                        }
                        try {
                            if (measurement.period && measurement.period.datetimeTo && measurement.period.datetimeTo.utc) {
                                const ts = new Date(measurement.period.datetimeTo.utc).getTime();
                                if (ts > stationTimestamp) stationTimestamp = ts;
                            } else if (measurement.datetime && measurement.datetime.utc) {
                                const ts = new Date(measurement.datetime.utc).getTime();
                                if (ts > stationTimestamp) stationTimestamp = ts;
                            } else if (measurement.datetime) {
                                const ts = new Date(measurement.datetime).getTime();
                                if (ts > stationTimestamp) stationTimestamp = ts;
                            }
                        } catch (e) {}
                    });
                    if (stationTimestamp === 0) stationTimestamp = Date.now();

                    // Calculate EAQI (European Air Quality Index) simplification
                    const no2 = readings.no2 || 0;
                    const o3 = readings.o3 || 0;
                    const pm10 = readings.pm10 || 0;
                    const pm25 = readings.pm25 || 0;

                    let aqi = 10; // default good
                    if (no2 > 40 || o3 > 50 || pm10 > 20 || pm25 > 10) aqi = 30; // Fair
                    if (no2 > 90 || o3 > 100 || pm10 > 40 || pm25 > 20) aqi = 60; // Moderate
                    if (no2 > 120 || o3 > 130 || pm10 > 50 || pm25 > 25) aqi = 80; // Poor
                    if (no2 > 230 || o3 > 240 || pm10 > 100 || pm25 > 50) aqi = 110; // Very Poor

                    let status = "Buena";
                    let color = "#10b981"; // Green
                    
                    if (aqi > 20) { status = "Regular"; color = "#eab308"; } // Yellow
                    if (aqi > 40) { status = "Moderada"; color = "#f97316"; } // Orange
                    if (aqi > 60) { status = "Mala"; color = "#ef4444"; } // Red
                    if (aqi > 100) { status = "Muy Mala"; color = "#8b5cf6"; } // Purple

                    finalData.push({
                        name: loc.name,
                        city: loc.locality,
                        lat: loc.coordinates.latitude,
                        lon: loc.coordinates.longitude,
                        pm10: pm10.toFixed(1),
                        pm25: pm25.toFixed(1),
                        no2: no2.toFixed(1),
                        o3: o3.toFixed(1),
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
