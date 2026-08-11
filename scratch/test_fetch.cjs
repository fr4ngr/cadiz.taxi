async function test() {
    const urls = [
        'https://andaluciainformacion.es/jerez/feed',
        'https://andaluciainformacion.es/chiclana/feed',
        'https://www.canalsierradecadiz.com/rss'
    ];

    for (const url of urls) {
        try {
            const start = Date.now();
            const res = await fetch(url, { redirect: 'follow' });
            const time = Date.now() - start;
            const text = await res.text();
            
            console.log(`[${url}] -> Final URL: ${res.url}`);
            console.log(`Status: ${res.status}. Time: ${time}ms.`);
            
            const titleMatch = text.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || text.match(/<title>(.*?)<\/title>/i);
            const pubMatch = text.match(/<pubDate>(.*?)<\/pubDate>/i);
            
            if (titleMatch && pubMatch) {
                console.log(`Latest: ${titleMatch[1]} (${pubMatch[1]})`);
            } else {
                console.log(`No items found.`);
            }
            console.log('---');
        } catch(e) {
            console.error(`[${url}] Error:`, e.message);
        }
    }
}
test();
