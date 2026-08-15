export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "ev_chargers_cadiz_v3";
  
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

    // 2. Fetch from REVE API (Official MITECO map)
    const boundsPayload = {
      "latitude_ne": 37.0,
      "longitude_ne": -5.1,
      "latitude_sw": 35.9,
      "longitude_sw": -6.5,
      "zoom": 10
    };

    const fetchPage = async (page) => {
      const p = { ...boundsPayload, page };
      const res = await fetch('https://www.mapareve.es/api/public/v1/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify(p)
      });
      if (!res.ok) return { data: [] };
      return res.json();
    };

    // Fetch page 1 to get total pages
    const firstPage = await fetchPage(1);
    const totalPages = firstPage.pagination ? firstPage.pagination.total_pages : 1;
    let allLocations = firstPage.data || [];

    // Fetch remaining pages concurrently
    if (totalPages > 1) {
      const promises = [];
      for (let i = 2; i <= totalPages; i++) {
        promises.push(fetchPage(i));
      }
      const results = await Promise.all(promises);
      for (const res of results) {
        if (res.data) {
          allLocations = allLocations.concat(res.data);
        }
      }
    }

    // 3. Parse and standardize REVE data
    const finalData = allLocations.map(e => {
      // Some results from zoom:10 might be clusters, skip them if they don't have location data
      if (e.type === 'cluster' && !e.owner) return null;
      
      const loc = e.type === 'location' && e.location ? e.location : e;
      if (!loc.coordinates) return null;

      const operatorName = loc.owner && loc.owner.name ? loc.owner.name : 'Operador no especificado';
      const capacity = loc.total_evse || null;

      let maxKw = 0;
      const connectors = [];
      
      if (loc.evses && Array.isArray(loc.evses)) {
        loc.evses.forEach(evse => {
          if (evse.connectors && Array.isArray(evse.connectors)) {
            evse.connectors.forEach(conn => {
              if (conn.max_power && conn.max_power > maxKw) {
                maxKw = conn.max_power;
              }
              // Map REVE connector standards to readable names
              const std = conn.standard || '';
              if (std.includes('T2_COMBO') && !connectors.includes('Tipo 2 (CCS)')) connectors.push('Tipo 2 (CCS)');
              else if (std.includes('T2') && !connectors.includes('Tipo 2')) connectors.push('Tipo 2');
              else if (std.includes('CHADEMO') && !connectors.includes('CHAdeMO')) connectors.push('CHAdeMO');
              else if (std.includes('DOMESTIC') && !connectors.includes('Schuko (Enchufe normal)')) connectors.push('Schuko (Enchufe normal)');
            });
          }
        });
      }

      return {
        id: loc.id,
        lat: parseFloat(loc.coordinates.latitude),
        lon: parseFloat(loc.coordinates.longitude),
        operator: operatorName,
        capacity: capacity,
        maxKw: maxKw,
        connectors: connectors,
        fee: 'Consultar', // REVE API often abstracts tariffs into OCPI, complex to parse instantly
        network: 'REVE MITECO'
      };
    }).filter(e => e !== null);

    const finalJson = JSON.stringify({ chargers: finalData, updated: new Date().toISOString() });

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
