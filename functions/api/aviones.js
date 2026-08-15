export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "aviones_cadiz_v1";
  
  // 1. Check D1 Cache (4 minutes = 360 requests/day, stays under 400 limit)
  try {
    const row = await env.DB.prepare(`SELECT value, updated_at FROM system_cache WHERE key = ?`).bind(cacheKey).first();
    if (row) {
      const updatedDate = new Date(row.updated_at + 'Z');
      if ((Date.now() - updatedDate.getTime()) < 4 * 60 * 1000) {
        return new Response(row.value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache' }
        });
      }
    }
  } catch(e) { console.error("Cache read error", e); }

  try {
    // 2. Fetch from OpenSky Network
    // Cadiz bounding box
    const url = 'https://opensky-network.org/api/states/all?lamin=35.9&lomin=-6.5&lamax=37.0&lomax=-5.1';
    
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'GaditanApp/1.0 (Contact: local@example.com)'
        }
    });

    if (!res.ok) {
        try {
            const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key = ?`).bind(cacheKey).first();
            if (row) return new Response(row.value, { headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache-Fallback' } });
        } catch(e) {}
        return new Response(JSON.stringify({ aviones: [] }), { status: 500 });
    }

    const data = await res.json();
    
    // 3. Normalize Data
    // OpenSky array format:
    // 0: icao24, 1: callsign, 2: origin_country, 3: time_position, 4: last_contact, 
    // 5: longitude, 6: latitude, 7: baro_altitude, 8: on_ground, 9: velocity, 
    // 10: true_track, 11: vertical_rate, 12: sensors, 13: geo_altitude, 14: squawk, 15: spi, 16: position_source
    const aviones = [];
    if (data.states && Array.isArray(data.states)) {
        for (const state of data.states) {
            if (state[8] === true) continue; // Skip if on ground
            if (state[5] === null || state[6] === null) continue; // Skip if no position
            
            aviones.push({
                icao24: state[0],
                callsign: state[1] ? state[1].trim() : 'Desconocido',
                country: state[2],
                lon: parseFloat(state[5]),
                lat: parseFloat(state[6]),
                alt_m: state[7] !== null ? parseFloat(state[7]) : (state[13] !== null ? parseFloat(state[13]) : 0),
                vel_ms: state[9] !== null ? parseFloat(state[9]) : 0,
                heading: state[10] !== null ? parseFloat(state[10]) : 0
            });
        }
    }

    const finalJson = JSON.stringify({ aviones: aviones, updated: new Date().toISOString() });

    // 4. Save to Cache
    try {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      await env.DB.prepare(`
        INSERT INTO system_cache (key, value, updated_at) 
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(cacheKey, finalJson, nowStr).run();
    } catch(e) { console.error("Cache write error", e); }

    // 5. Return Response
    return new Response(finalJson, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'X-Source': 'API'
      }
    });

  } catch (error) {
    console.error("API Error", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
