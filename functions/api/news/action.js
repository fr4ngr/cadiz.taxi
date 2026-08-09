export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 1. Auth check
    const cookie = request.headers.get('Cookie');
    const match = cookie && cookie.match(/cadiz_chat_session=([^;]+)/);
    if (!match) return new Response('Unauthorized', { status: 401 });
    
    const sessionId = match[1];
    const session = await env.DB.prepare(`SELECT user_id FROM sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP`).bind(sessionId).first();
    if (!session) return new Response('Unauthorized', { status: 401 });
    const user_id = session.user_id;

    try {
        const body = await request.json();
        const { id, url, titulo, extracto, imagen, fuente, categoria, municipio, action_type } = body; // action_type: 'like' o 'save'
        
        if (!id || !url || !action_type) {
            return new Response('Missing fields', { status: 400 });
        }

        // 2. Ensure news is persistent
        await env.DB.prepare(`
            INSERT INTO news_persistent (id, url, titulo, extracto, imagen, fuente, categoria, municipio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING
        `).bind(id, url, titulo, extracto || '', imagen || '', fuente || '', categoria || '', municipio || '').run();

        // 3. Ensure stats row exists
        await env.DB.prepare(`
            INSERT INTO news_social_stats (news_id, likes_count, comments_count, saves_count)
            VALUES (?, 0, 0, 0)
            ON CONFLICT(news_id) DO NOTHING
        `).bind(id).run();

        // 4. Check if interaction already exists
        const existing = await env.DB.prepare(`
            SELECT id FROM news_interactions WHERE news_id = ? AND user_id = ? AND action_type = ?
        `).bind(id, user_id, action_type).first();

        let isActive = false;

        if (existing) {
            // Eliminar interacción (Unlike / Unsave)
            await env.DB.prepare(`DELETE FROM news_interactions WHERE id = ?`).bind(existing.id).run();
            // Actualizar contador
            const col = action_type === 'like' ? 'likes_count' : 'saves_count';
            await env.DB.prepare(`UPDATE news_social_stats SET ${col} = MAX(0, ${col} - 1) WHERE news_id = ?`).bind(id).run();
            isActive = false;
        } else {
            // Crear interacción
            await env.DB.prepare(`
                INSERT INTO news_interactions (news_id, user_id, action_type) VALUES (?, ?, ?)
            `).bind(id, user_id, action_type).run();
            // Actualizar contador
            const col = action_type === 'like' ? 'likes_count' : 'saves_count';
            await env.DB.prepare(`UPDATE news_social_stats SET ${col} = ${col} + 1 WHERE news_id = ?`).bind(id).run();
            isActive = true;
        }

        // Obtener contadores actualizados
        const stats = await env.DB.prepare(`SELECT * FROM news_social_stats WHERE news_id = ?`).bind(id).first();

        return new Response(JSON.stringify({ success: true, isActive, stats }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error in news action:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
