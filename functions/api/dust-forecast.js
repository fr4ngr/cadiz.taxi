export async function onRequest(context) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date) => {
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, '0');
        const d = String(date.getUTCDate()).padStart(2, '0');
        return `${y}${m}${d}`;
    };

    const dateToday = formatDate(today);
    const dateYest = formatDate(yesterday);

    // Las pasadas del modelo suelen ser a las 12z y a las 00z
    const candidates = [
        `${dateToday}12`,
        `${dateToday}00`,
        `${dateYest}12`,
        `${dateYest}00`
    ];

    let validUrl = null;

    for (const d of candidates) {
        const url = `https://sds-was.aemet.es/thredds/wms/monarch/dust/${d}_monarch_dust.nc`;
        const testUrl = `${url}?service=WMS&version=1.3.0&request=GetCapabilities`;
        
        try {
            // El backend no se queja del certificado típicamente en Cloudflare, 
            // pero si falla podemos intentar seguir.
            const res = await fetch(testUrl);
            if (res.ok) {
                validUrl = url;
                break;
            }
        } catch (e) {
            console.error("WMS probe failed for " + d, e);
        }
    }

    if (validUrl) {
        return new Response(JSON.stringify({
            url: validUrl + '?',
            layers: 'OD550_DUST', // Nombre típico de AEMET para aerosol optical depth
            styles: 'boxfill/rainbow' // Estilo de mapa de calor clásico
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    }

    return new Response(JSON.stringify({ error: 'No dust WMS found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
    });
}
