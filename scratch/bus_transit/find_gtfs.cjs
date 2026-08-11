const https = require('https');
https.get('https://siu.cmtbc.es/es/datos_abiertos.php', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = data.match(/href="([^"]*gtfs[^"]*)"/gi);
        console.log('Matches:', matches);
    });
});
