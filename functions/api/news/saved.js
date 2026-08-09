export async function onRequestGet(context) {
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
        const result = await env.DB.prepare(`
            SELECT p.*, s.likes_count, s.comments_count, s.saves_count,
                   (SELECT id FROM news_interactions WHERE news_id = p.id AND user_id = ? AND action_type = 'like') as user_liked,
                   1 as user_saved
            FROM news_interactions i
            JOIN news_persistent p ON i.news_id = p.id
            LEFT JOIN news_social_stats s ON p.id = s.news_id
            WHERE i.user_id = ? AND i.action_type = 'save'
            ORDER BY i.created_at DESC
        `).bind(user_id, user_id).all();

        return new Response(JSON.stringify({ success: true, items: result.results }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching saved news:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
