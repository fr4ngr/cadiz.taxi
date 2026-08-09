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
        const { id, url, titulo, extracto, imagen, fuente, categoria, municipio, content, parent_id } = body;
        
        if (!id || !url || !content) {
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

        // 4. Insert comment
        const result = await env.DB.prepare(`
            INSERT INTO news_comments (news_id, user_id, parent_id, content) VALUES (?, ?, ?, ?) RETURNING id
        `).bind(id, user_id, parent_id || null, content).first();

        // 5. Update comment count
        await env.DB.prepare(`UPDATE news_social_stats SET comments_count = comments_count + 1 WHERE news_id = ?`).bind(id).run();

        // 6. Handle notification if it's a reply
        if (parent_id) {
            const parentComment = await env.DB.prepare(`SELECT user_id FROM news_comments WHERE id = ?`).bind(parent_id).first();
            if (parentComment && parentComment.user_id !== user_id) {
                // Notificar al dueño del comentario padre
                await env.DB.prepare(`
                    INSERT INTO notifications (user_id, actor_id, type, target_id, message)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(
                    parentComment.user_id, 
                    user_id, 
                    'news_reply', 
                    id, 
                    'Alguien ha respondido a tu comentario en una noticia.'
                ).run();
            }
        }

        return new Response(JSON.stringify({ success: true, comment_id: result.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
