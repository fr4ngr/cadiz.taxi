export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "ev_chargers_cadiz_v1";
  
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

  // 2. Fetch from Overpass API
  try {
    const query = `
      [out:json];
      area["name"="Cádiz"]["admin_level"="6"]->.searchArea;
      node["amenity"="charging_station"](area.searchArea);
      out;
    `;
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'User-Agent': 'GaditanApp/1.0 (Contact: frn)',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: query
    });

    if (!response.ok) throw new Error('Overpass API response not OK: ' + await response.text());
    
    const data = await response.json();

    // 3. Parse OSM Data
    const chargers = data.elements.map(e => {
      const t = e.tags || {};
      
      // Extract best name / operator
      const operatorName = t.operator || t.brand || t.name || 'Operador Desconocido';
      
      // Parse capacity
      const capacity = parseInt(t.capacity) || 1;
      
      // Parse Max kW output (search through tags for 'output' or 'kW' keywords)
      let maxKw = 0;
      for (const [key, value] of Object.entries(t)) {
        if (key.includes('output') && typeof value === 'string') {
          const match = value.match(/(\d+)\s*(?:kw|kW)/i);
          if (match) {
            const kw = parseInt(match[1]);
            if (kw > maxKw) maxKw = kw;
          }
        }
      }
      
      // Connectors
      const connectors = [];
      if (t['socket:type2'] || t['socket:type2_combo']) connectors.push('Tipo 2 (CCS)');
      if (t['socket:chademo']) connectors.push('CHAdeMO');
      if (t['socket:schuko']) connectors.push('Schuko (Doméstico)');

      return {
        id: e.id,
        lat: e.lat,
        lon: e.lon,
        operator: operatorName,
        capacity: capacity,
        maxKw: maxKw,
        connectors: connectors.length > 0 ? connectors : ['Varios/Desconocido'],
        fee: t.fee === 'no' ? 'Gratis' : (t.fee === 'yes' ? 'De pago' : 'Consultar'),
        network: t.network || null
      };
    });

    const finalJson = JSON.stringify({ chargers, updated: new Date().toISOString() });

    // 4. Save to Cache
    try {
      const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
      await env.DB.prepare(`
        INSERT INTO system_cache (key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(cacheKey, finalJson, now).run();
    } catch(e) { console.error("Cache write error", e); }

    return new Response(finalJson, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    console.error("EV Chargers API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
