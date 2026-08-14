export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "gasolineras_cadiz_extended_v1";
  
  // 1. Check cache first
  try {
    const row = await env.DB.prepare(`SELECT value, updated_at FROM system_cache WHERE key = ?`).bind(cacheKey).first();
    if (row) {
      const updatedDate = new Date(row.updated_at + 'Z');
      // If cache is less than 30 minutes old, return it
      if ((Date.now() - updatedDate.getTime()) < 30 * 60 * 1000) {
        return new Response(row.value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache' }
        });
      }
    }
  } catch(e) { console.error("Cache read error", e); }

  try {
      // 2. Fetch fresh data
      const response = await fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/');
      if (!response.ok) throw new Error('MITECO API response not OK');
      
      const data = await response.json();
      if (!data || !data.ListaEESSPrecio) {
          throw new Error('Invalid data format from MITECO');
      }

      const N = 37.2;
      const S = 35.9;
      const E = -5.0;
      const W = -6.7;

      const filtered = data.ListaEESSPrecio
          .map(g => {
              const lat = parseFloat(g.Latitud.replace(',', '.'));
              const lon = parseFloat(g['Longitud (WGS84)'].replace(',', '.'));
              return {
                  ...g,
                  _lat: lat,
                  _lon: lon
              };
          })
          .filter(g => {
              if (isNaN(g._lat) || isNaN(g._lon)) return false;
              return g._lat <= N && g._lat >= S && g._lon <= E && g._lon >= W;
          });

      const result = filtered.map(g => ({
          id: g.IDEESS,
          lat: g._lat,
          lon: g._lon,
          rotulo: g['Rótulo'],
          direccion: g['Dirección'],
          localidad: g['Localidad'],
          provincia: g['Provincia'],
          horario: g['Horario'],
          precio95: g['Precio Gasolina 95 E5'] ? parseFloat(g['Precio Gasolina 95 E5'].replace(',', '.')) : null,
          precioDiesel: g['Precio Gasoleo A'] ? parseFloat(g['Precio Gasoleo A'].replace(',', '.')) : null,
      }));

      const finalJson = JSON.stringify(result);

      // 3. Save to cache
      try {
        await env.DB.prepare(`
          INSERT INTO system_cache (key, value, updated_at) 
          VALUES (?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `).bind(cacheKey, finalJson).run();
      } catch(e) { console.error("Cache write error", e); }

      return new Response(finalJson, {
          status: 200,
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=1800'
          }
      });
  } catch (error) {
      console.error('Error fetching gasolineras:', error);
      
      try {
        const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key = ?`).bind(cacheKey).first();
        if (row) {
          return new Response(row.value, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache-Stale' }
          });
        }
      } catch(e) {}

      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
  }
}
