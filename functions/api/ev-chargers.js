export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "ev_chargers_cadiz_v8";
  
  // 1. Check D1 Cache (5 minutes)
  try {
    const row = await env.DB.prepare(`SELECT value, updated_at FROM system_cache WHERE key = ?`).bind(cacheKey).first();
    if (row) {
      const updatedDate = new Date(row.updated_at + 'Z');
      if ((Date.now() - updatedDate.getTime()) < 5 * 60 * 1000) {
        return new Response(row.value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache' }
        });
      }
    }
  } catch(e) { console.error("Cache read error", e); }

  try {
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
      const allConnectors = [];
      let allFees = [];
      const detailedEvses = [];
      
      if (loc.evses && Array.isArray(loc.evses)) {
        loc.evses.forEach(evse => {
          
          let evseMaxKw = 0;
          const evseConnectors = [];
          const evseStatus = evse.status || 'UNKNOWN';
          const isHealthy = evseStatus === 'AVAILABLE' || evseStatus === 'CHARGING';
          
          if (evse.connectors && Array.isArray(evse.connectors)) {
            evse.connectors.forEach(conn => {
              const kw = (conn.max_electric_power || 0) / 1000;
              
              if (isHealthy && kw > maxKw) {
                  maxKw = Math.round(kw);
              }
              if (kw > evseMaxKw) {
                  evseMaxKw = Math.round(kw);
              }
              
              const std = conn.standard || '';
              let readableStd = std;
              if (std.includes('T2_COMBO')) readableStd = 'Tipo 2 (CCS)';
              else if (std.includes('T2')) readableStd = 'Tipo 2';
              else if (std.includes('CHADEMO')) readableStd = 'CHAdeMO';
              else if (std.includes('DOMESTIC')) readableStd = 'Schuko';
              
              if (!allConnectors.includes(readableStd)) allConnectors.push(readableStd);
              if (!evseConnectors.includes(readableStd)) evseConnectors.push(readableStd);

              // Attempt to extract all price components from conn.tariffs
              if (conn.tariffs && Array.isArray(conn.tariffs)) {
                 for (const t of conn.tariffs) {
                     if (t.tariff && Array.isArray(t.tariff.elements)) {
                         for (const el of t.tariff.elements) {
                             if (Array.isArray(el.price_components)) {
                                 for (const c of el.price_components) {
                                     if (c.price !== undefined) {
                                         let formatted = '';
                                         const p = Number(c.price);
                                         if (c.type === 'ENERGY') {
                                             formatted = p === 0 ? 'Energía gratis' : p.toFixed(2) + ' €/kWh';
                                         } else if (c.type === 'PARKING_TIME') {
                                             formatted = p === 0 ? 'Parking gratis' : p.toFixed(2) + ' €/h (parking)';
                                         } else if (c.type === 'FLAT') {
                                             formatted = p === 0 ? 'Sin tasa fija' : p.toFixed(2) + ' € (fijo)';
                                         } else if (c.type === 'TIME') {
                                             formatted = p === 0 ? 'Tiempo gratis' : p.toFixed(2) + ' €/h (tiempo)';
                                         } else {
                                             formatted = p.toFixed(2) + ' €';
                                         }
                                         
                                         if (formatted && !allFees.includes(formatted)) {
                                             allFees.push(formatted);
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 }
              }
            });
          }

          detailedEvses.push({
            status: evseStatus,
            kw: evseMaxKw,
            connectors: evseConnectors,
            updatedAt: evse.last_updated || null
          });
        });
      }

      let missingFeeStr = '<span style="color:var(--text-secondary);font-size:11px;">No informan precios al ministerio</span>';
      if (allFees.length === 0 && loc.last_updated) {
          const diffMs = Date.now() - new Date(loc.last_updated).getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          let timeStr = diffDays === 0 ? 'hoy' : (diffDays === 1 ? 'hace 1 día' : `hace ${diffDays} días`);
          missingFeeStr = `<span style="color:var(--text-secondary);font-size:11px;line-height:1.2;display:inline-block;">No informan precios<br><span style="font-size:9px;opacity:0.8;">(desde ${timeStr})</span></span>`;
      }

      return {
        id: loc.id,
        lat: parseFloat(loc.coordinates.latitude),
        lon: parseFloat(loc.coordinates.longitude),
        operator: operatorName,
        address: loc.address || '',
        status: loc.status || 'UNKNOWN',
        accessibility: loc.accessibility || 'PUBLIC',
        paymentMethods: loc.payment_methods ? loc.payment_methods.join(', ') : 'No especificado',
        capacity: capacity,
        maxKw: maxKw,
        connectors: allConnectors,
        detailedEvses: detailedEvses,
        fee: allFees.length > 0 ? allFees.join('<br>') : missingFeeStr,
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
