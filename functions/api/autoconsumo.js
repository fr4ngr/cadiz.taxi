export async function onRequest(context) {
    try {
        const db = context.env.gaditan_data;
        if (!db) {
            throw new Error("D1 Database not found (gaditan_data).");
        }

        const { results } = await db.prepare(`
            SELECT a.*, 
                   IFNULL(r.mw_eol, 0) as mw_eol, 
                   IFNULL(r.mw_hid, 0) as mw_hid, 
                   IFNULL(r.mw_biomasa, 0) as mw_biomasa, 
                   IFNULL(r.mw_sol, 0) as mw_sol_macro
            FROM autoconsumo_municipal a
            LEFT JOIN raipee_municipal r ON a.municipio_name = r.municipio_name
        `).all();

        const municipalities = results.map(row => ({
            id: row.id,
            name: row.municipio_name,
            lat: row.lat,
            lon: row.lon,
            mw: row.mw,
            installations: row.installations,
            pctResidential: row.pct_residential,
            pctIndustrial: row.pct_industrial,
            pctExcedentes: row.pct_excedentes,
            pctSinExcedentes: row.pct_sin_excedentes,
            lastUpdatedText: row.last_updated_text,
            mwEol: row.mw_eol,
            mwHid: row.mw_hid,
            mwBiomasa: row.mw_biomasa,
            mwSolMacro: row.mw_sol_macro
        }));

        return new Response(JSON.stringify({ municipalities }), {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message, municipalities: [] }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json;charset=UTF-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    }
}
