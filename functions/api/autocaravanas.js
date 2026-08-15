export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "autocaravanas_cadiz_v1";
  
  // 1. Check D1 Cache (24 hours)
  try {
    const row = await env.DB.prepare(`SELECT value, updated_at FROM system_cache WHERE key = ?`).bind(cacheKey).first();
    if (row) {
      const updatedDate = new Date(row.updated_at + 'Z');
      if ((Date.now() - updatedDate.getTime()) < 24 * 60 * 60 * 1000) {
        return new Response(row.value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache' }
        });
      }
    }
  } catch(e) { console.error("Cache read error", e); }

  try {
    // 2. Fetch from OpenStreetMap Overpass API
    const query = `[out:json][timeout:25];(node["tourism"="caravan_site"](35.9,-6.5,37.0,-5.1);way["tourism"="caravan_site"](35.9,-6.5,37.0,-5.1););out center;`;
    
    // We must pass data as application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('data', query);
    
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'GaditanApp/1.0 (Contact: local@example.com)'
      },
      body: params.toString()
    });

    if (!res.ok) {
        // Fallback to cache if overpass fails
        try {
            const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key = ?`).bind(cacheKey).first();
            if (row) return new Response(row.value, { headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache-Fallback' } });
        } catch(e) {}
        return new Response(JSON.stringify({ areas: [] }), { status: 500 });
    }

    const data = await res.json();
    
    // 3. Normalize Data
    const areas = [];
    if (data.elements) {
        for (const el of data.elements) {
            const lat = el.lat || (el.center && el.center.lat);
            const lon = el.lon || (el.center && el.center.lon);
            
            if (!lat || !lon) continue;
            
            const tags = el.tags || {};
            
            areas.push({
                id: el.id,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                name: tags.name || 'Área de Autocaravanas',
                operator: tags.operator || null,
                fee: tags.fee || 'unknown',
                capacity: tags.capacity || null,
                water: tags.water_point || 'unknown',
                power: tags.power_supply || 'unknown',
                sanitary: tags.sanitary_dump_station || 'unknown',
                network: 'OpenStreetMap'
            });
        }
    }

    const finalJson = JSON.stringify({ areas: areas, updated: new Date().toISOString() });

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
