export async function onRequest(context: any) {
    const { env } = context;

    const towns = [
        { name: 'Cádiz', busId: 14, consorcioId: 2 },
        { name: 'Jerez', busId: 161, consorcioId: 2 },
        { name: 'San Fernando', busId: 47, consorcioId: 2 },
        { name: 'El Puerto de Santa María', busId: 125, consorcioId: 2 },
        { name: 'Puerto Real', busId: 86, consorcioId: 2 },
        { name: 'Chiclana', busId: 272, consorcioId: 2 },
        { name: 'Rota', busId: 181, consorcioId: 2 },
        { name: 'Conil', busId: 296, consorcioId: 2 },
        { name: 'Medina', busId: 188, consorcioId: 2 },
    ];

    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
    let updatedCount = 0;

    for (const item of towns) {
        try {
            const cacheKey = `transport_${item.consorcioId}_${item.busId}_${today}`;
            const cacheResult = await env.DB.prepare('SELECT value, updated_at FROM system_cache WHERE key = ?').bind(cacheKey).first();
            
            let servicios = [];
            if (cacheResult && cacheResult.value) {
                servicios = JSON.parse(cacheResult.value);
            }
            
            const res = await fetch(`http://api.ctan.es/v1/Consorcios/${item.consorcioId}/paradas/${item.busId}/servicios`, { signal: AbortSignal.timeout(10000) });
            if (res.ok) {
                const json = await res.json();
                if (json && json.servicios) {
                    const newServicios = json.servicios;
                    const merged = [...servicios];
                    for (const s of newServicios) {
                        if (!merged.find(m => m.idLinea === s.idLinea && m.servicio === s.servicio && m.destino === s.destino)) {
                            merged.push(s);
                        }
                    }
                    merged.sort((a, b) => a.servicio.localeCompare(b.servicio));
                    
                    await env.DB.prepare(`
                        INSERT INTO system_cache (key, value) VALUES (?, ?)
                        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
                    `).bind(cacheKey, JSON.stringify(merged)).run();
                    updatedCount++;
                }
            }
        } catch (e) {
            console.error(`Error fetching warmup for ${item.name}`, e);
        }
    }

    return new Response(JSON.stringify({ success: true, updatedCount }), {
        headers: { "Content-Type": "application/json" }
    });
}
