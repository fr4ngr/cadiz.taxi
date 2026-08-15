export async function onRequest(context) {
  const { env } = context;
  const cacheKey = "gasolineras_cadiz_comarcas_v7";
  
  try {
    const row = await env.DB.prepare(`SELECT value, updated_at FROM system_cache WHERE key = ?`).bind(cacheKey).first();
    if (row) {
      const updatedDate = new Date(row.updated_at + 'Z');
      if ((Date.now() - updatedDate.getTime()) < 30 * 60 * 1000) {
        return new Response(row.value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'X-Source': 'D1-Cache' }
        });
      }
    }
  } catch(e) { console.error("Cache read error", e); }

  try {
      const response = await fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/11');
      if (!response.ok) throw new Error('MITECO API response not OK');
      
      const data = await response.json();
      if (!data || !data.ListaEESSPrecio) {
          throw new Error('Invalid data format from MITECO');
      }

      const COMARCAS = {
          'Bahía de Cádiz': ['Cádiz', 'Chiclana de la Frontera', 'Puerto de Santa María (El)', 'Puerto Real', 'San Fernando'],
          'Campo de Gibraltar': ['Algeciras', 'Barrios (Los)', 'Castellar de la Frontera', 'Jimena de la Frontera', 'Línea de la Concepción (La)', 'San Roque', 'Tarifa', 'San Martín del Tesorillo'],
          'Campiña de Jerez': ['Jerez de la Frontera', 'San José del Valle'],
          'Costa Noroeste': ['Chipiona', 'Rota', 'Sanlúcar de Barrameda', 'Trebujena'],
          'La Janda': ['Alcalá de los Gazules', 'Barbate', 'Benalup-Casas Viejas', 'Conil de la Frontera', 'Medina-Sidonia', 'Paterna de Rivera', 'Vejer de la Frontera'],
          'Sierra de Cádiz': ['Alcalá del Valle', 'Algar', 'Algodonales', 'Arcos de la Frontera', 'Benaocaz', 'Bornos', 'Bosque (El)', 'Espera', 'Gastor (El)', 'Grazalema', 'Olvera', 'Prado del Rey', 'Puerto Serrano', 'Setenil de las Bodegas', 'Torre Alháquime', 'Ubrique', 'Villaluenga del Rosario', 'Villamartín', 'Zahara']
      };

      const getComarca = (municipio) => {
          for (const [comarca, munis] of Object.entries(COMARCAS)) {
              if (munis.includes(municipio)) return comarca;
          }
          return 'Desconocida';
      };

      // 1. First Pass: Format data and collect valid prices for averages/minimums
      const stations = data.ListaEESSPrecio.map(g => {
          const lat = parseFloat(g.Latitud.replace(',', '.'));
          const lon = parseFloat(g['Longitud (WGS84)'].replace(',', '.'));
          
          const p95 = g['Precio Gasolina 95 E5'] ? parseFloat(g['Precio Gasolina 95 E5'].replace(',', '.')) : null;
          const pDiesel = g['Precio Gasoleo A'] ? parseFloat(g['Precio Gasoleo A'].replace(',', '.')) : null;
          
          return {
              id: g.IDEESS,
              lat, lon,
              rotulo: g['Rótulo'],
              direccion: g['Dirección'],
              localidad: g['Localidad'],
              municipio: g['Municipio'],
              comarca: getComarca(g['Municipio']),
              horario: g['Horario'],
              fecha: data.Fecha,
              tipoVenta: ['14453', '13131', '8021'].includes(g.IDEESS) ? 'R' : g['Tipo Venta'],
              // All possible prices
              fuels: {
                  'Gasolina 95': p95,
                  'Gasolina 98': g['Precio Gasolina 98 E5'] ? parseFloat(g['Precio Gasolina 98 E5'].replace(',', '.')) : null,
                  'Diésel A': pDiesel,
                  'Diésel Premium': g['Precio Gasoleo Premium'] ? parseFloat(g['Precio Gasoleo Premium'].replace(',', '.')) : null,
                  'GLP': g['Precio Gases licuados del petróleo'] ? parseFloat(g['Precio Gases licuados del petróleo'].replace(',', '.')) : null,
                  'GNC': g['Precio Gas Natural Comprimido'] ? parseFloat(g['Precio Gas Natural Comprimido'].replace(',', '.')) : null,
                  'GNL': g['Precio Gas Natural Licuado'] ? parseFloat(g['Precio Gas Natural Licuado'].replace(',', '.')) : null,
                  'AdBlue': g['Precio Adblue'] ? parseFloat(g['Precio Adblue'].replace(',', '.')) : null,
              },
              // Ref price for calculations (Prefer 95, fallback to Diesel)
              refPrice: p95 || pDiesel
          };
      }).filter(s => !isNaN(s.lat) && !isNaN(s.lon));

      // 2. Statistics Calculation
      const pricesByComarca = {};
      const minPriceByComarca = {};

      stations.forEach(s => {
          if (s.refPrice) {
              if (!pricesByComarca[s.comarca]) pricesByComarca[s.comarca] = [];
              pricesByComarca[s.comarca].push(s.refPrice);
              
              if (!minPriceByComarca[s.comarca] || s.refPrice < minPriceByComarca[s.comarca]) {
                  minPriceByComarca[s.comarca] = s.refPrice;
              }
          }
      });

      const percentilesByComarca = {};
      for (const comarca in pricesByComarca) {
          const sorted = pricesByComarca[comarca].sort((a, b) => a - b);
          if (sorted.length > 0) {
              // Calculamos el tercil inferior (33%) y el tercil superior (66%)
              const p33 = sorted[Math.floor(sorted.length * 0.33)];
              const p66 = sorted[Math.floor(sorted.length * 0.66)];
              const pMin = sorted[0];
              const pMax = sorted[sorted.length - 1];
              percentilesByComarca[comarca] = { p33, p66, pMin, pMax };
          }
      }

      // 3. Assign price levels
      stations.forEach(s => {
          if (!s.refPrice || !percentilesByComarca[s.comarca]) {
              s.priceLevel = 2; // Default to orange if no prices available
              s.pricePosition = 50;
              s.isCheapest = false;
              return;
          }

          s.isCheapest = s.refPrice === minPriceByComarca[s.comarca];

          const { p33, p66, pMin, pMax } = percentilesByComarca[s.comarca];

          if (s.refPrice <= p33) {
              s.priceLevel = 1; // Green (Baratas, 33% inferior)
          } else if (s.refPrice <= p66) {
              s.priceLevel = 2; // Orange (Medias, 33% central)
          } else {
              s.priceLevel = 3; // Red
          }

          if (pMax > pMin) {
              s.pricePosition = Math.max(0, Math.min(100, ((s.refPrice - pMin) / (pMax - pMin)) * 100));
          } else {
              s.pricePosition = 50;
          }
          
          // Calcular ahorro respecto a la gasolinera más cara (Depósito de 50 litros)
          s.savings = (pMax - s.refPrice) * 50;
      });

      const finalJson = JSON.stringify(stations);

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
