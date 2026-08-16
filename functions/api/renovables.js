export async function onRequest(context) {
    try {
        const d1 = context.env.gaditan_data;
        if (!d1) throw new Error("D1 database binding 'gaditan_data' not found");

        const { results } = await d1.prepare(`SELECT * FROM energy_stats`).all();
        
        const municipalities = results.map(row => ({
            ...row,
            name: row.municipio_name
        }));

        return new Response(JSON.stringify(municipalities), {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: true, message: e.message }), { status: 500 });
    }
}
