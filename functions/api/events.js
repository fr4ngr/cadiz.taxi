export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const provincia = url.searchParams.get('provincia') || 'Cádiz';
    const tema = url.searchParams.get('tema') || '-';

    try {
        const hoy = new Date().toISOString().split('T')[0];
        let eventos = [];
        
        // 1. Fetch Junta de Andalucía
        const juntaApiUrl = `https://datos.juntadeandalucia.es/api/v0/schedule/search?province=${encodeURIComponent(provincia)}&organism=-&theme=${encodeURIComponent(tema)}&order_by=start_date_registration&mode=ASC&format=json&size=10&end_date_registration_from=${hoy}`;
        const juntaPromise = fetch(juntaApiUrl).then(r => r.ok ? r.json() : null).catch(() => null);

        // 2. Fetch Ticketmaster (Radio de 80km desde el centro geográfico de Cádiz, ej. Medina Sidonia)
        const tmApiKey = '7Em1yXWdq5UmDjyS1eu0XAmoCOWVGVMB';
        const tmApiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${tmApiKey}&latlong=36.457,-5.927&radius=80&unit=km&size=150&sort=date,asc`;
        const tmPromise = fetch(tmApiUrl).then(r => r.ok ? r.json() : null).catch(() => null);

        const [juntaData, tmData] = await Promise.all([juntaPromise, tmPromise]);

        // Procesar eventos de la Junta
        if (juntaData && juntaData.results) {
            const juntaEventos = juntaData.results.map(e => ({
                titulo: e.title,
                descripcion: (e.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                horario: e.schedule || 'No especificado',
                lugar: e.location || 'No especificado',
                coste: e.cost || 'No especificado',
                fuente: 'Junta de Andalucía'
            }));
            eventos.push(...juntaEventos);
        }

        // Procesar eventos de Ticketmaster
        if (tmData && tmData._embedded && tmData._embedded.events) {
            const seenNames = new Set();
            const tmEventos = [];
            
            for (const e of tmData._embedded.events) {
                const venue = e._embedded && e._embedded.venues && e._embedded.venues[0] ? e._embedded.venues[0] : null;
                
                // Filtro estricto para asegurar que es provincia de Cádiz (excluir Sevilla/Málaga que puedan caer en el radio)
                if (venue) {
                    const isCadiz = (venue.state && venue.state.name && venue.state.name.toLowerCase().includes('cádiz')) ||
                                    (venue.city && venue.city.name && ['cádiz', 'cadiz', 'jerez', 'algeciras', 'san fernando', 'el puerto', 'chiclana', 'sanlúcar', 'sanlucar', 'línea', 'tarifa', 'rota', 'barbate', 'conil'].some(c => venue.city.name.toLowerCase().includes(c)));
                    if (!isCadiz) continue;
                }
                
                if (seenNames.has(e.name)) continue;
                seenNames.add(e.name);

                tmEventos.push({
                    titulo: e.name,
                    descripcion: e.classifications && e.classifications[0] && e.classifications[0].genre ? e.classifications[0].genre.name : 'Concierto/Espectáculo',
                    horario: e.dates && e.dates.start ? `${e.dates.start.localDate} ${e.dates.start.localTime || ''}`.trim() : 'No especificado',
                    lugar: e._embedded && e._embedded.venues && e._embedded.venues[0] ? `${e._embedded.venues[0].name}, ${e._embedded.venues[0].city.name}` : 'No especificado',
                    coste: e.priceRanges ? `Desde ${e.priceRanges[0].min}€` : 'Consultar web',
                    fuente: 'Ticketmaster'
                });
            }
            eventos.push(...tmEventos);
        }

        return new Response(JSON.stringify({
            fecha_consulta: hoy,
            provincia,
            total_combinado: eventos.length,
            eventos
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=1800'
            }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
