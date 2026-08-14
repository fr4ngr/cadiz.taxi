const https = require('https');
https.get('https://www.juntadeandalucia.es/datosabiertos/portal/dataset/calidad-del-aire-en-andalucia-datos-diarios', (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        console.log(data.match(/https?:\/\/[^\s"'><]+csv/gi) || 'no csv');
    });
});
