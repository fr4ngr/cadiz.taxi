const https = require('https');

function fetchFeed(url) {
    return new Promise((resolve) => {
        const start = Date.now();
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const time = Date.now() - start;
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    console.log(`[${url}] Redirected to ${res.headers.location} (${time}ms)`);
                    fetchFeed(res.headers.location).then(resolve);
                    return;
                }
                const match = data.match(/<pubDate>(.*?)<\/pubDate>/i);
                console.log(`[${url}] Status: ${res.statusCode}. Time: ${time}ms. Length: ${data.length}`);
                if (match) {
                    console.log(`[${url}] Latest article date: ${match[1]}`);
                } else {
                    console.log(`[${url}] No pubDate found.`);
                }
                resolve();
            });
        }).on('error', (e) => {
            console.log(`[${url}] Error:`, e.message);
            resolve();
        });
    });
}

async function run() {
    await fetchFeed('https://andaluciainformacion.es/jerez/feed');
    await fetchFeed('https://www.canalsierradecadiz.com/rss');
    await fetchFeed('https://andaluciainformacion.es/chiclana/feed');
}

run();
