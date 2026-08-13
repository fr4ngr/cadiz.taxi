export async function onRequest(context) {
  const { env, request } = context;
  const cacheKey = "water_reservoirs_cadiz_v2";

  // 1. Check cache first
  try {
    const row = await env.DB.prepare(`SELECT value, updated_at FROM system_cache WHERE key = ?`).bind(cacheKey).first();
    if (row) {
      const updatedDate = new Date(row.updated_at + 'Z');
      // If cache is less than 6 hours old, return it
      if ((Date.now() - updatedDate.getTime()) < 6 * 60 * 60 * 1000) {
        return new Response(row.value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache' }
        });
      }
    }
  } catch(e) { console.error("Cache read error", e); }

  // 2. Fetch fresh data if no cache or stale
  try {
    const response = await fetch('https://www.embalses.net/provincia-9-cadiz.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    });
    
    if (!response.ok) throw new Error(`embalses.net HTTP error: ${response.status}`);
    const html = await response.text();
    
    // Extract base data from AddPunto
    const regex = /AddPunto\(([\d\.-]+),\s*([\d\.-]+),\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*([\d\.-]+),\s*([\d\.-]+),\s*"([^"]+)",\s*([\d\.-]+),\s*([\d\.-]+)/g;
    
    // Extract URLs for historical data scraping
    const urlRegex = /href="(https:\/\/www\.embalses\.net\/pantano-\d+-[^\.]+\.html)"[^>]*>([^<]+)\s*\[\+\]/g;
    const urlMap = {};
    let urlMatch;
    while ((urlMatch = urlRegex.exec(html)) !== null) {
      urlMap[urlMatch[2].trim()] = urlMatch[1];
    }

    const reservoirs = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[3] === "E") { // Only Reservoirs
        reservoirs.push({
          lat: parseFloat(match[1]),
          lon: parseFloat(match[2]),
          id: match[4],
          name: match[5],
          percentage: parseFloat(match[6]),
          trend: parseFloat(match[7]),
          color: match[8],
          capacity: parseFloat(match[9]),
          current: parseFloat(match[10])
        });
      }
    }

    // 3. Fetch historical data concurrently for all reservoirs
    await Promise.all(reservoirs.map(async (res) => {
        let url = urlMap[res.name];
        if (!url && res.name === "Los Hurones") url = urlMap["Los Hurones"]; // direct mapping for edge cases if any

        if (url) {
            try {
                const subRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
                if (subRes.ok) {
                    const subHtml = await subRes.text();
                    const pastYearMatch = subHtml.match(/Misma Semana \(\d{4}\):.*?<div class="Resultado">(\d+)<\/div>/s);
                    const avg10Match = subHtml.match(/Misma Semana \(Med\. 10 Años\):.*?<div class="Resultado">(\d+)<\/div>/s);
                    
                    if (pastYearMatch) {
                        res.pastYear = parseFloat(pastYearMatch[1]);
                        res.pastYearPct = Math.round((res.pastYear / res.capacity) * 100);
                    }
                    if (avg10Match) {
                        res.avg10Year = parseFloat(avg10Match[1]);
                        res.avg10YearPct = Math.round((res.avg10Year / res.capacity) * 100);
                    }
                }
            } catch(e) {
                console.error("Failed to fetch historical data for " + res.name, e);
            }
        }
    }));

    const jsonData = JSON.stringify(reservoirs);

    // 4. Save to cache
    try {
        await env.DB.prepare(`
            INSERT INTO system_cache (key, value, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        `).bind(cacheKey, jsonData).run();
    } catch (e) {
        console.error("Cache write error", e);
    }

    return new Response(jsonData, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    // 5. If error, try returning stale cache
    try {
      const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key = ?`).bind(cacheKey).first();
      if (row) {
         return new Response(row.value, { headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Stale-Fallback' } });
      }
    } catch(e) {}
    
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
