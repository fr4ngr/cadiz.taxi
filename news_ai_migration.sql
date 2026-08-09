CREATE TABLE IF NOT EXISTS news_ai_cache (
    url TEXT PRIMARY KEY,
    es_turistica BOOLEAN NOT NULL DEFAULT 0,
    categoria TEXT,
    municipio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
