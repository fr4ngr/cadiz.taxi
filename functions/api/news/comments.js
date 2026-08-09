export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const newsId = url.searchParams.get('id');

    if (!newsId) {
        return new Response('Missing news id', { status: 400 });
    }

    try {
        // Obtenemos los comentarios con los datos básicos del usuario
        const result = await env.DB.prepare(`
            SELECT c.id, c.content, c.created_at, c.parent_id, u.id as user_id, u.name, u.avatar_url, u.username
            FROM news_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.news_id = ?
            ORDER BY c.created_at ASC
        `).bind(newsId).all();

        return new Response(JSON.stringify({ success: true, comments: result.results }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
