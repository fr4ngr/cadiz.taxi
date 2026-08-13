export async function onRequest(context) {
    const { request } = context;

    const cities = [
        { name: "Cádiz Capital", lat: 36.529, lon: -6.292 },
        { name: "Jerez de la Frontera", lat: 36.686, lon: -6.136 },
        { name: "Algeciras", lat: 36.133, lon: -5.450 },
        { name: "San Fernando", lat: 36.465, lon: -6.198 },
        { name: "El Puerto de Sta. María", lat: 36.600, lon: -6.226 }
    ];

    const lats = cities.map(c => c.lat).join(',');
    const lons = cities.map(c => c.lon).join(',');

    try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Gaditan-App/1.0',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Open-Meteo API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Open-Meteo returns an array when multiple coordinates are passed
        const results = data.map((res, index) => {
            const current = res.current || {};
            const aqi = current.european_aqi || 0;
            
            let status = 'Desconocido';
            let color = '#9ca3af'; // gris
            
            if (aqi > 0 && aqi <= 20) {
                status = '🟢 Buena';
                color = '#10b981'; // verde
            } else if (aqi > 20 && aqi <= 40) {
                status = '🟡 Regular';
                color = '#eab308'; // amarillo
            } else if (aqi > 40 && aqi <= 60) {
                status = '🟠 Moderada';
                color = '#f97316'; // naranja
            } else if (aqi > 60) {
                status = '🔴 Mala';
                color = '#ef4444'; // rojo
            }

            return {
                id: index,
                name: cities[index].name,
                lat: cities[index].lat,
                lon: cities[index].lon,
                aqi: aqi,
                status: status,
                color: color,
                pm10: current.pm10 || 0,
                pm25: current.pm2_5 || 0,
                no2: current.nitrogen_dioxide || 0,
                o3: current.ozone || 0
            };
        });

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600' // cache 1 hora
            }
        });

    } catch (error) {
        console.error("Error fetching air quality:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
