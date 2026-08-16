export async function onRequest(context) {
    try {
        const d = new Date();
        const dateStr = d.toISOString().split('T')[0];
        let espRes = { error: true };
        try {
            const urlPen = 'https://apidatos.ree.es/es/datos/generacion/estructura-generacion?start_date=' + dateStr + 'T00:00&end_date=' + dateStr + 'T23:59&time_trunc=day&geo_limit=peninsular&geo_ids=8741';
            const resPen = await fetch(urlPen, { cf: { cacheTtl: 1800, cacheEverything: true } });
            if (resPen.ok) {
                const dataPen = await resPen.json();
                let esp = { ren: 0, sol: 0, eol: 0, hid: 0, otr: 0, total: 0 };
                if (dataPen.included) {
                    dataPen.included.forEach(t => {
                        if (!t.attributes || !t.attributes.values || !t.attributes.values[0]) return;
                        const val = t.attributes.values[0].value;
                        if (t.type === 'Generación total') {
                            esp.total += val;
                        } else if (t.attributes.type === 'Renovable') {
                            esp.ren += val;
                            const name = t.type.toLowerCase();
                            if (name.includes('solar')) esp.sol += val;
                            else if (name.includes('eólica')) esp.eol += val;
                            else if (name.includes('hidráulica')) esp.hid += val;
                            else esp.otr += val; 
                        }
                    });
                }
                const calcPct = (val, total) => total > 0 ? (val / total * 100).toFixed(1) : 0;
                espRes = {
                    renPct: calcPct(esp.ren, esp.total),
                    solPct: calcPct(esp.sol, esp.total),
                    eolPct: calcPct(esp.eol, esp.total),
                    hidPct: calcPct(esp.hid, esp.total),
                    otrPct: calcPct(esp.otr, esp.total)
                };
            }
        } catch (e) {
            console.error("REE Spain failed", e);
        }
        // Andalusian Mix
        let andRes = { error: true };
        try {
            const urlAnd = 'https://apidatos.ree.es/es/datos/generacion/estructura-generacion?start_date=' + dateStr + 'T00:00&end_date=' + dateStr + 'T23:59&time_trunc=day&geo_limit=ccaa&geo_ids=4';
            const resAnd = await fetch(urlAnd, { cf: { cacheTtl: 1800, cacheEverything: true } });
            
            if (resAnd.ok) {
                const dataAnd = await resAnd.json();
                let and = { ren: 0, sol: 0, eol: 0, hid: 0, otr: 0, total: 0 };
                
                if (dataAnd.included) {
                    dataAnd.included.forEach(t => {
                        if (!t.attributes || !t.attributes.values || !t.attributes.values[0]) return;
                        const val = t.attributes.values[0].value;
                        if (t.type === 'Generación total') {
                            and.total += val;
                        } else if (t.attributes.type === 'Renovable') {
                            and.ren += val;
                            const name = t.type.toLowerCase();
                            if (name.includes('solar')) and.sol += val;
                            else if (name.includes('eólica')) and.eol += val;
                            else if (name.includes('hidráulica')) and.hid += val;
                            else and.otr += val; 
                        }
                    });
                }
                
                andRes = {
                    renPct: calcPct(and.ren, and.total),
                    solPct: calcPct(and.sol, and.total),
                    eolPct: calcPct(and.eol, and.total),
                    hidPct: calcPct(and.hid, and.total),
                    otrPct: calcPct(and.otr, and.total)
                };
            }
        } catch (e) {
            console.error("REE Andalucia failed", e);
        }

        return new Response(JSON.stringify({
            esp: espRes,
            and: andRes,
            date: dateStr,
            time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' })
        }), {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=1800'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: true, message: e.message }), {
            status: 200, 
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        });
    }
}
