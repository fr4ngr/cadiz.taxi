-- air_quality_migration.sql
CREATE TABLE IF NOT EXISTS air_quality_history (
    date TEXT NOT NULL,
    station_name TEXT NOT NULL,
    pm10 REAL,
    pm25 REAL,
    no2 REAL,
    o3 REAL,
    so2 REAL,
    co REAL,
    aqi REAL,
    PRIMARY KEY (date, station_name)
);
