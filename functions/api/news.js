// functions/api/news.js
// Aggregador de noticias RSS para la provincia de Cádiz
// Cachea en D1 (system_cache) con TTL de 15 minutos
// Clasifica por categoría usando Cloudflare AI

const FEEDS = [
  // --- PROVINCIALES ---
  { url: 'https://www.diariodecadiz.es/rss',         fuente: 'Diario de Cádiz',          municipio: 'cadiz',       zona: 'provincial' },
  { url: 'https://www.lavozdelsur.es/feed',           fuente: 'La Voz del Sur',            municipio: 'cadiz',       zona: 'provincial' },
  { url: 'https://www.cadizdirecto.com/feed',         fuente: 'Cádiz Directo',             municipio: 'cadiz',       zona: 'provincial' },
  { url: 'https://www.elmira.es/feed',                fuente: 'El Mira',                   municipio: 'cadiz',       zona: 'provincial' },
  { url: 'https://www.cadiz24horas.com/feed',         fuente: 'Cádiz 24 Horas',            municipio: 'cadiz',       zona: 'provincial' },
  { url: 'https://andaluciainformacion.es/feed',      fuente: 'Andalucía Información',     municipio: 'cadiz',       zona: 'provincial' },

  // --- CAMPO DE GIBRALTAR ---
  { url: 'https://www.europasur.es/rss',              fuente: 'Europa Sur',                municipio: 'algeciras',   zona: 'campo-gibraltar' },
  { url: 'https://www.diarioarea.com/rss',            fuente: 'Diario Área',               municipio: 'algeciras',   zona: 'campo-gibraltar' },
  { url: 'https://www.algecirasalminuto.es/rss',      fuente: 'Algeciras al Minuto',       municipio: 'algeciras',   zona: 'campo-gibraltar' },
  { url: 'http://diariodelalinea.es/coverrss',        fuente: 'Diario de La Línea',        municipio: 'lalinea',     zona: 'campo-gibraltar' },

  // --- JEREZ Y BAHÍA ---
  { url: 'https://www.diariodejerez.es/rss',          fuente: 'Diario de Jerez',           municipio: 'jerez',       zona: 'jerez' },
  { url: 'https://www.puertorealhoy.es/feed',         fuente: 'Puerto Real Hoy',           municipio: 'puertoreal',  zona: 'bahia' },
  { url: 'https://www.elperiodicodechiclana.com/feed',fuente: 'El Periódico de Chiclana',  municipio: 'chiclana',    zona: 'bahia' },
  { url: 'https://www.dechiclana.com/feed',           fuente: 'De Chiclana',               municipio: 'chiclana',    zona: 'bahia' },

  // --- SANLÚCAR Y COSTA ---
  { url: 'https://www.sanlucardigital.es/feed',       fuente: 'Sanlúcar Digital',          municipio: 'sanlucar',    zona: 'costa-noroeste' },
  { url: 'https://www.sanlucarahora.com/feed',        fuente: 'Sanlúcar Ahora',            municipio: 'sanlucar',    zona: 'costa-noroeste' },
  { url: 'https://www.barramedia.es/feed',            fuente: 'Barramedia',                municipio: 'sanlucar',    zona: 'costa-noroeste' },
  { url: 'https://rotaaldia.com/coverrss',            fuente: 'Rota al Día',               municipio: 'rota',        zona: 'costa-noroeste' },
  { url: 'https://www.canalsierradecadiz.com/rss',    fuente: 'Canal Sierra de Cádiz',     municipio: 'arcos',       zona: 'sierra' },

  // --- ANDALUCÍA INFORMACIÓN SUB-FEEDS ---
  { url: 'https://andaluciainformacion.es/elpuerto/feed',    fuente: 'El Puerto Info',     municipio: 'elpuerto',    zona: 'bahia' },
  { url: 'https://andaluciainformacion.es/sanfernando/feed', fuente: 'San Fernando Info',  municipio: 'sanfernando', zona: 'bahia' },
  { url: 'https://andaluciainformacion.es/chiclana/feed',    fuente: 'Chiclana Info',      municipio: 'chiclana',    zona: 'bahia' },
  { url: 'https://andaluciainformacion.es/barbate/feed',     fuente: 'Barbate Info',       municipio: 'barbate',     zona: 'costa-sur' },
  { url: 'https://andaluciainformacion.es/conil/feed',       fuente: 'Conil Info',         municipio: 'conil',       zona: 'costa-sur' },
  { url: 'https://andaluciainformacion.es/tarifa/feed',      fuente: 'Tarifa Info',        municipio: 'tarifa',      zona: 'campo-gibraltar' },
  { url: 'https://andaluciainformacion.es/rota/feed',        fuente: 'Rota Info',          municipio: 'rota',        zona: 'costa-noroeste' },
  { url: 'https://andaluciainformacion.es/chipiona/feed',    fuente: 'Chipiona Info',      municipio: 'chipiona',    zona: 'costa-noroeste' },
  { url: 'https://andaluciainformacion.es/sanlucar/feed',    fuente: 'Sanlúcar Info',      municipio: 'sanlucar',    zona: 'costa-noroeste' },
  { url: 'https://andaluciainformacion.es/jerez/feed',       fuente: 'Jerez Info',         municipio: 'jerez',       zona: 'jerez' },
  { url: 'https://andaluciainformacion.es/algeciras/feed',   fuente: 'Algeciras Info',     municipio: 'algeciras',   zona: 'campo-gibraltar' },
  { url: 'https://andaluciainformacion.es/lalinea/feed',     fuente: 'La Línea Info',      municipio: 'lalinea',     zona: 'campo-gibraltar' },
  { url: 'https://andaluciainformacion.es/arcos/feed',       fuente: 'Arcos Info',         municipio: 'arcos',       zona: 'sierra' },
  { url: 'https://andaluciainformacion.es/medina/feed',      fuente: 'Medina Sidonia Info', municipio: 'medina',     zona: 'campiña' },
  { url: 'https://andaluciainformacion.es/ubrique/feed',     fuente: 'Ubrique Info',       municipio: 'ubrique',     zona: 'sierra' },
  { url: 'https://andaluciainformacion.es/vejer/feed',       fuente: 'Vejer Info',         municipio: 'vejer',       zona: 'costa-sur' },
  { url: 'https://andaluciainformacion.es/jimena/feed',      fuente: 'Jimena Info',        municipio: 'jimena',      zona: 'campo-gibraltar' },
  { url: 'https://andaluciainformacion.es/losbarrios/feed',  fuente: 'Los Barrios Info',   municipio: 'losbarrios',  zona: 'campo-gibraltar' },
];

const CACHE_KEY = 'news_cadiz_v1';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos

// ─── Parser RSS sin DOMParser (compatible con Cloudflare Workers) ───────────
function parseRSS(xml, feedMeta) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  const extract = (tag, text) => {
    const patterns = [
      new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'),
      new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'),
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return m[1].trim();
    }
    return null;
  };

  const extractAttr = (tag, attr, text) => {
    const r = new RegExp(`<${tag}[^>]+${attr}=["']([^"']+)["']`, 'i');
    const m = text.match(r);
    return m ? m[1].trim() : null;
  };

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title   = extract('title', block)       || '';
    const link    = extract('link', block)         || extract('guid', block) || '';
    const pubDate = extract('pubDate', block)      || extract('dc:date', block) || '';
    const desc    = extract('description', block)  || extract('content:encoded', block) || '';
    const encoded = extract('content:encoded', block) || '';

    // Intentar extraer imagen de varias fuentes
    let imagen = extractAttr('media:content', 'url', block)
              || extractAttr('media:thumbnail', 'url', block)
              || extractAttr('enclosure', 'url', block);

    if (!imagen) {
      // Buscar <img src="..."> en la descripción o contenido
      const imgMatch = (encoded || desc).match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) imagen = imgMatch[1];
    }

    if (!title || !link) continue;

    // Limpiar HTML del extracto
    const extracto = (desc || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 180);

    let fecha = null;
    try { fecha = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(); }
    catch { fecha = new Date().toISOString(); }

    // ID único basado en URL
    const id = btoa(link).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

    items.push({
      id,
      titulo: title,
      extracto,
      url: link,
      imagen: imagen || null,
      fuente: feedMeta.fuente,
      municipio: feedMeta.municipio,
      zona: feedMeta.zona,
      fecha,
      categoria: 'general', // se clasifica después si hay AI
    });
  }

  return items;
}

// ─── Calcular "hace X tiempo" ────────────────────────────────────────────────
function tiempoRelativo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return 'ahora mismo';
  if (mins < 60)  return `hace ${mins} min`;
  if (hours < 24) return `hace ${hours}h`;
  if (days === 1) return 'ayer';
  return `hace ${days} días`;
}

// ─── Clasificar categorías con palabras clave (rápido, sin IA en cada req) ──
const CATEGORIAS = {
  deporte:    /\b(fútbol|tenis|baloncesto|deporte|atletismo|ciclismo|f1|liga|partido|gol|cadiz cf|xerez|algeciras cf|marathon|padel)\b/i,
  cultura:    /\b(cine|música|teatro|exposici[oó]n|festival|concierto|arte|libro|patrimonio|flamenco|carnaval|cofrad|semana santa)\b/i,
  sucesos:    /\b(accidente|incendio|detenci[oó]n|robo|herido|muerto|fallec|polic[ií]a|guardia civil|juzgado|condena|tr[aá]fico)\b/i,
  economia:   /\b(empleo|empresa|paro|pib|turismo|puerto|comercio|mercado|precio|inflaci[oó]n|contrato|subvenci[oó]n|ERE|ere)\b/i,
  politica:   /\b(ayuntamiento|alcalde|diputaci[oó]n|junta|gobierno|pp|psoe|vox|iu|podemos|ciudadanos|andaluc[ií]a|congreso|senado|elecciones?)\b/i,
  medio_ambiente: /\b(medio ambiente|parque natural|contaminaci[oó]n|incendio forestal|sequía|lluvia|tormenta|atún|pesca|medusa|playa|mar)\b/i,
  salud:      /\b(hospital|salud|enfermedad|vacuna|médico|sanitario|covid|gripe|urgencias|consulta|operaci[oó]n)\b/i,
};

function clasificarCategoria(titulo, extracto) {
  const texto = (titulo + ' ' + extracto).toLowerCase();
  for (const [cat, regex] of Object.entries(CATEGORIAS)) {
    if (regex.test(texto)) return cat;
  }
  return 'general';
}

// ─── Fetch un feed con timeout ────────────────────────────────────────────────
async function fetchFeed(feedMeta) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(feedMeta.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Gaditan/1.0 RSS Reader (gaditan.pages.dev)' }
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, feedMeta);
  } catch (e) {
    console.error(`Feed error [${feedMeta.fuente}]:`, e.message);
    return [];
  }
}

// ─── Sincronizar todos los feeds y guardar en D1 ────────────────────────────
async function syncNews(env) {
  const results = await Promise.allSettled(FEEDS.map(f => fetchFeed(f)));

  let allItems = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') allItems.push(...r.value);
  });

  // Deduplicar por ID
  const seen = new Set();
  allItems = allItems.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  // Clasificar categorías
  allItems = allItems.map(item => ({
    ...item,
    categoria: clasificarCategoria(item.titulo, item.extracto),
    hace: tiempoRelativo(item.fecha),
  }));

  // Ordenar por fecha desc
  allItems.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Guardar solo los últimos 300
  const toSave = allItems.slice(0, 300);

  const payload = {
    items: toSave,
    total: toSave.length,
    actualizado: new Date().toISOString(),
  };

  try {
    await env.DB.prepare(`
      INSERT INTO system_cache (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(CACHE_KEY, JSON.stringify(payload)).run();
  } catch (e) {
    console.error('D1 Cache Save Error:', e);
  }

  return payload;
}

// ─── Handler principal ────────────────────────────────────────────────────────
export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const municipio = url.searchParams.get('municipio') || 'all';
  const categoria = url.searchParams.get('categoria') || 'all';
  const limite    = Math.min(parseInt(url.searchParams.get('limite') || '60'), 120);
  const forChat   = url.searchParams.get('for_chat') === '1'; // Para el asistente IA

  const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // ── Leer caché D1 ──
  let cachedData = null;
  let isStale = false;
  try {
    const row = await env.DB.prepare(
      'SELECT value, updated_at FROM system_cache WHERE key = ?'
    ).bind(CACHE_KEY).first();

    if (row) {
      cachedData = JSON.parse(row.value);
      const age = Date.now() - new Date(row.updated_at + 'Z').getTime();
      isStale = age > CACHE_TTL_MS;
    }
  } catch (e) {
    console.error('D1 Read Error:', e);
  }

  // ── Si caché obsoleta, revalidar en background ──
  if (cachedData && isStale) {
    context.waitUntil(syncNews(env).catch(e => console.error('Background sync failed:', e)));
  }

  // ── Si no hay caché, sincronizar ahora ──
  if (!cachedData) {
    try {
      cachedData = await syncNews(env);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'No se pudieron cargar las noticias.' }), {
        status: 503, headers: CORS,
      });
    }
  }

  // ── Actualizar campo "hace" en tiempo real ──
  let items = (cachedData.items || []).map(item => ({
    ...item,
    hace: tiempoRelativo(item.fecha),
  }));

  // ── Filtrar ──
  if (municipio !== 'all') items = items.filter(i => i.municipio === municipio);
  if (categoria !== 'all') items = items.filter(i => i.categoria === categoria);

  // ── Formato simplificado para el chat IA ──
  if (forChat) {
    const resumen = items.slice(0, 20).map(i =>
      `[${i.fuente}] ${i.titulo} (${i.hace}) — ${i.extracto}`
    ).join('\n');
    return new Response(JSON.stringify({ resumen, total: items.length }), { headers: CORS });
  }

  return new Response(JSON.stringify({
    items: items.slice(0, limite),
    total: items.length,
    desde_cache: !isStale,
    actualizado: cachedData.actualizado,
  }), {
    headers: { ...CORS, 'X-News-Stale': isStale.toString() },
  });
}
