DROP TABLE IF EXISTS energy_stats;
CREATE TABLE energy_stats (
    municipio_id TEXT PRIMARY KEY,
    municipio_name TEXT,
    solar_mw REAL DEFAULT 0,
    eolica_mw REAL DEFAULT 0,
    hidro_mw REAL DEFAULT 0,
    biomasa_mw REAL DEFAULT 0,
    total_mw REAL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
