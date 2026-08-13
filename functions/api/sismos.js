export async function onRequest(context) {
    const cache = await caches.open('sismos-cache');
    const url = new URL(context.request.url);
    const cacheKey = new Request(url.origin + '/api/sismos-internal-cache', context.request);

    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const rssResponse = await fetch('http://www.ign.es/ign/RssTools/sismologia.xml', {
            headers: { 'User-Agent': 'Gaditan-App/1.0' }
        });
        
        if (!rssResponse.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch from IGN' }), { status: 502 });
        }

        const text = await rssResponse.text();
        const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
        
        const sismos = [];
        
        for (const item of items) {
            const latMatch = item.match(/<geo:lat>([\d.-]+)<\/geo:lat>/);
            const lonMatch = item.match(/<geo:long>([\d.-]+)<\/geo:long>/);
            const linkMatch = item.match(/<link>(.*?)<\/link>/);
            const titleMatch = item.match(/<title>(.*?)<\/title>/);
            const descMatch = item.match(/<description>(.*?)<\/description>/);
            
            if (!latMatch || !lonMatch) continue;
            
            const lat = parseFloat(latMatch[1]);
            const lon = parseFloat(lonMatch[1]);
            const link = linkMatch ? linkMatch[1] : '';
            
            let dateTime = '';
            let timestamp = 0;
            if (titleMatch) {
                dateTime = titleMatch[1].replace('-Info.terremoto: ', '').trim();
                // Parse "12/08/2026 2:46:53"
                try {
                    const [dPart, tPart] = dateTime.split(' ');
                    const [day, month, year] = dPart.split('/');
                    const isoTime = tPart.split(':').map(v => v.padStart(2, '0')).join(':');
                    timestamp = new Date(`${year}-${month}-${day}T${isoTime}Z`).getTime();
                } catch(e) {}
            }
            
            let mag = 0;
            let location = 'Desconocida';
            
            if (descMatch) {
                const desc = descMatch[1];
                const magM = desc.match(/magnitud ([\d.]+)/);
                if (magM) mag = parseFloat(magM[1]);
                
                const locM = desc.match(/en ([^]+?) en la fecha/);
                if (locM) {
                    location = locM[1].trim();
                    location = location.replace(/^N /, 'Norte de ')
                                       .replace(/^S /, 'Sur de ')
                                       .replace(/^E /, 'Este de ')
                                       .replace(/^W /, 'Oeste de ')
                                       .replace(/^NE /, 'Noreste de ')
                                       .replace(/^NW /, 'Noroeste de ')
                                       .replace(/^SE /, 'Sureste de ')
                                       .replace(/^SW /, 'Suroeste de ');
                }
            }
            
            sismos.push({
                lat,
                lon,
                mag,
                location,
                date: dateTime,
                timestamp,
                link
            });
        }
        
        const response = new Response(JSON.stringify(sismos), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // 5 minutos de caché
                'Access-Control-Allow-Origin': '*'
            }
        });
        
        context.waitUntil(cache.put(cacheKey, response.clone()));
        
        return response;
        
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
