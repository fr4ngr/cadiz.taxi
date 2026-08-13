export async function onRequest(context) {
    const { env } = context;
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

    const cities = [
        { name: "Cádiz", lat: 36.5298, lon: -6.2924 },
        { name: "Jerez de la Frontera", lat: 36.6850, lon: -6.1261 },
        { name: "Algeciras", lat: 36.1333, lon: -5.4500 },
        { name: "San Fernando", lat: 36.4667, lon: -6.2000 },
        { name: "El Puerto de Santa María", lat: 36.5939, lon: -6.2330 },
        { name: "Chiclana de la Frontera", lat: 36.4167, lon: -6.1500 },
        { name: "Sanlúcar de Barrameda", lat: 36.7781, lon: -6.3515 },
        { name: "La Línea de la Concepción", lat: 36.1667, lon: -5.3500 },
        { name: "Arcos de la Frontera", lat: 36.7483, lon: -5.8058 }
    ];

    try {
        const finalData = await Promise.all(cities.map(async (city) => {
            // Fetch Pollen Data
            const pollenUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen`;
            // Fetch Weather Data (Humidity)
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=relative_humidity_2m`;

            const [pollenRes, weatherRes] = await Promise.all([
                fetch(pollenUrl),
                fetch(weatherUrl)
            ]);

            if (!pollenRes.ok || !weatherRes.ok) {
                console.error(`Error fetching data for ${city.name}`);
                return null;
            }

            const pollenData = await pollenRes.json();
            const weatherData = await weatherRes.json();

            const pCurrent = pollenData.current || {};
            const wCurrent = weatherData.current || {};

            // 1. Olivo (Bajo <50, Medio 50-200, Alto >200)
            const olive = pCurrent.olive_pollen || 0;
            let oliveRisk = "Bajo";
            let oliveColor = "#10b981";
            let oliveScore = 1;
            if (olive >= 200) { oliveRisk = "Alto"; oliveColor = "#ef4444"; oliveScore = 3; }
            else if (olive >= 50) { oliveRisk = "Medio"; oliveColor = "#f97316"; oliveScore = 2; }

            // 2. Gramíneas (Bajo <30, Medio 30-100, Alto >100)
            const grass = pCurrent.grass_pollen || 0;
            let grassRisk = "Bajo";
            let grassColor = "#10b981";
            let grassScore = 1;
            if (grass >= 100) { grassRisk = "Alto"; grassColor = "#ef4444"; grassScore = 3; }
            else if (grass >= 30) { grassRisk = "Medio"; grassColor = "#f97316"; grassScore = 2; }

            // 3. Malezas / Parietaria (Ragweed + Mugwort)
            const weed = (pCurrent.ragweed_pollen || 0) + (pCurrent.mugwort_pollen || 0);
            let weedRisk = "Bajo";
            let weedColor = "#10b981";
            let weedScore = 1;
            if (weed >= 50) { weedRisk = "Alto"; weedColor = "#ef4444"; weedScore = 3; }
            else if (weed >= 10) { weedRisk = "Medio"; weedColor = "#f97316"; weedScore = 2; }

            // 4. Árboles (Alder + Birch)
            const trees = (pCurrent.alder_pollen || 0) + (pCurrent.birch_pollen || 0);
            let treesRisk = "Bajo";
            let treesColor = "#10b981";
            let treesScore = 1;
            if (trees >= 100) { treesRisk = "Alto"; treesColor = "#ef4444"; treesScore = 3; }
            else if (trees >= 50) { treesRisk = "Medio"; treesColor = "#f97316"; treesScore = 2; }

            // 5. Ácaros / Humedad (>75% Alto Riesgo)
            const humidity = wCurrent.relative_humidity_2m || 0;
            let miteRisk = "Bajo";
            let miteColor = "#10b981";
            let miteScore = 1;
            if (humidity > 75) { miteRisk = "Alto"; miteColor = "#ef4444"; miteScore = 3; }
            else if (humidity > 60) { miteRisk = "Medio"; miteColor = "#f97316"; miteScore = 2; }

            // Riesgo General
            const maxScore = Math.max(oliveScore, grassScore, weedScore, treesScore, miteScore);
            let globalRisk = "BAJO";
            let globalColor = "#10b981"; // Verde
            if (maxScore === 2) { globalRisk = "MODERADO"; globalColor = "#f97316"; } // Naranja
            if (maxScore === 3) { globalRisk = "ALTO"; globalColor = "#ef4444"; } // Rojo

            // Calculate exact timestamp (prefer pollen timestamp)
            let ts = Date.now();
            if (pCurrent.time) ts = new Date(pCurrent.time).getTime();

            return {
                name: city.name,
                lat: city.lat,
                lon: city.lon,
                globalRisk: globalRisk,
                color: globalColor,
                timestamp: ts,
                indicators: {
                    olive: { value: olive.toFixed(1), risk: oliveRisk, color: oliveColor },
                    grass: { value: grass.toFixed(1), risk: grassRisk, color: grassColor },
                    weed: { value: weed.toFixed(1), risk: weedRisk, color: weedColor },
                    trees: { value: trees.toFixed(1), risk: treesRisk, color: treesColor },
                    mites: { value: humidity, risk: miteRisk, color: miteColor }
                }
            };
        }));

        const validData = finalData.filter(d => d !== null);

        const finalResponse = new Response(JSON.stringify(validData), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });

        context.waitUntil(cache.put(cacheKey, finalResponse.clone()));
        return finalResponse;

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
