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

    const openaqKey = env.OPENAQ_API_KEY || "1e184a172f89ccb2beef04c48cb08835a073a5650dd35a5171a01ea190e99d1f";
    const headers = {
        'X-API-Key': openaqKey,
        'Content-Type': 'application/json'
    };

    try {
        // 1. Fetch metadata for all locations in Cádiz province bounding box
        const locationsRes = await fetch('https://api.openaq.org/v3/locations?bbox=-6.45,36.00,-5.25,36.95&limit=50', { headers });
        if (!locationsRes.ok) {
            throw new Error(`OpenAQ /locations returned ${locationsRes.status}`);
        }
        const locationsData = await locationsRes.json();
        
        // 2. Select the 5 major locations we want to display
        const targetNames = ["CÁDIZ", "JEREZ DE LA FRONTERA", "SAN FERNANDO", "ALGECIRAS", "PUERTO REAL"]; // Puerto Real represents El Puerto area as it's the closest sensor
        
        // Find best match for each
        const selectedLocations = [];
        for (const target of targetNames) {
            // Find a location whose city matches the target
            const match = locationsData.results.find(l => l.locality && l.locality.toUpperCase().includes(target));
            if (match) {
                selectedLocations.push(match);
            }
        }

        // 3. For each selected location, fetch its latest measurements
        const finalData = [];
        
        await Promise.all(selectedLocations.map(async (loc) => {
            try {
                const latestRes = await fetch(`https://api.openaq.org/v3/locations/${loc.id}/latest`, { headers });
                if (!latestRes.ok) return;
                const latestData = await latestRes.json();
                
                // Map sensor IDs to parameter names using the metadata we fetched earlier
                const sensorMap = {};
                loc.sensors.forEach(s => {
                    sensorMap[s.id] = s.parameter.name; // e.g. 'pm10', 'no2'
                });

                // Extract values
                const readings = { pm10: 0, pm25: 0, no2: 0, o3: 0, so2: 0, co: 0 };
                latestData.results.forEach(measurement => {
                    const param = sensorMap[measurement.sensorsId];
                    if (param && readings[param] !== undefined) {
                        readings[param] = measurement.value;
                    }
                });

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
                    color: color
                });
            } catch (err) {
                console.error(`Error fetching latest for ${loc.name}:`, err);
            }
        }));

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
