const fs = require('fs');

async function run() {
    const res = await fetch('https://portalrediam.cica.es/embalses/');
    const html = await res.text();
    const jsFiles = html.split('<script src="').slice(1).map(s => s.split('"')[0]).filter(s => s.startsWith('js/'));
    console.log("JS files:", jsFiles);
    
    for (const js of jsFiles) {
        const jsRes = await fetch('https://portalrediam.cica.es/embalses/' + js);
        const jsText = await jsRes.text();
        const urls = jsText.match(/https?:\/\/[^\s'"]+/g) || [];
        const endpoints = urls.filter(u => u.includes('csv') || u.includes('json') || u.includes('php') || u.includes('api'));
        if (endpoints.length > 0) {
            console.log(`Endpoints in ${js}:`, [...new Set(endpoints)]);
        }
        
        // Also look for relative URLs
        const relative = jsText.match(/['"](data\/[^'"]+)['"]/g);
        if (relative) {
            console.log(`Relative data paths in ${js}:`, relative);
        }
    }
}
run();
