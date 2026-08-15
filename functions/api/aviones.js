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
    // 2. Fetch from ADSB.lol (Community driven, no rate limit/datacenter block)
    // 50 nautical miles around center of Cadiz (36.5, -5.8)
    const url = 'https://api.adsb.lol/v2/lat/36.5/lon/-5.8/dist/50';
    
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
        const errorText = await res.text().catch(()=>'');
        return new Response(JSON.stringify({ aviones: [], error: `External API failed: ${res.status} ${res.statusText}`, details: errorText.substring(0, 200) }), { status: 500 });
    }

    const data = await res.json();
    
    // 3. Normalize Data
    const aviones = [];
    if (data.ac && Array.isArray(data.ac)) {
        for (const plane of data.ac) {
            if (plane.lat === undefined || plane.lon === undefined) continue;
            if (plane.alt_baro === "ground") continue; // Skip if on ground
            
            // alt_baro is in feet, convert to meters
            const altM = typeof plane.alt_baro === 'number' ? plane.alt_baro * 0.3048 : 0;
            // gs is ground speed in knots, convert to m/s
            const velMs = typeof plane.gs === 'number' ? plane.gs * 0.514444 : 0;
            
            aviones.push({
                icao24: plane.hex || '',
                callsign: plane.flight ? plane.flight.trim() : (plane.r || 'Desconocido'),
                country: plane.t || 'Desconocido', // Using 'type' (e.g. B738) in place of country for now, more useful!
                category: plane.category || 'unknown',
                lon: plane.lon,
                lat: plane.lat,
                alt_m: altM,
                vel_ms: velMs,
                heading: plane.track || 0
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
