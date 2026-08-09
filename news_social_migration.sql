-- Tabla para asegurar que las noticias no desaparecen si alguien interactúa con ellas
CREATE TABLE IF NOT EXISTS news_persistent (
    id TEXT PRIMARY KEY, -- Será la URL hashada o la propia URL
    url TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    extracto TEXT,
    imagen TEXT,
    fuente TEXT,
    categoria TEXT,
    municipio TEXT,
    fecha DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contadores globales para acceso súper rápido
CREATE TABLE IF NOT EXISTS news_social_stats (
    news_id TEXT PRIMARY KEY REFERENCES news_persistent(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0
);

-- Tabla de interacciones para saber QUIÉN le dio like o guardó
CREATE TABLE IF NOT EXISTS news_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id TEXT NOT NULL REFERENCES news_persistent(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- referenciará a users(id)
    action_type TEXT NOT NULL, -- 'like' o 'save'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(news_id, user_id, action_type)
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS news_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id TEXT NOT NULL REFERENCES news_persistent(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- referenciará a users(id)
    parent_id INTEGER, -- Por si es una respuesta a otro comentario
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones (si no existe, la creamos para avisar de comentarios)
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL, -- A quién va dirigida
    actor_id TEXT, -- Quién generó la acción
    type TEXT NOT NULL, -- Ej: 'news_reply'
    target_id TEXT, -- Ej: news_id
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
