
            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Paterna de Rivera', 'Paterna de Rivera', 36.5229634, -5.864702, 569.8, 222.3, 0, 0, 792.0999999999999)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Olvera', 'Olvera', 36.9348951, -5.2601194, 0, 18, 0, 0, 18)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('El Puerto de Santa María', 'El Puerto de Santa María', 36.6004006, -6.2252702, 0.1, 0, 0, 0, 0.1)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Prado del Rey', 'Prado del Rey', 36.7879415, -5.5572276, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Jimena de la Frontera', 'Jimena de la Frontera', 36.4327335, -5.4527477, 0.1, 0, 18.8, 0, 18.900000000000002)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Jerez de la Frontera', 'Jerez de la Frontera', 36.6816936, -6.1377402, 309.29999999999995, 72.3, 0, 3.1, 384.7)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Medina Sidonia', 'Medina Sidonia', 36.4576714, -5.9272725, 0, 85.9, 0, 1.3, 87.2)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('La Línea de la Concepción', 'La Línea de la Concepción', 36.1677899, -5.3482396, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Puerto Serrano', 'Puerto Serrano', 36.9213346, -5.5420668, 71.7, 0, 0, 0, 71.7)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Puerto Real', 'Puerto Real', 36.5286856, -6.1902161, 370.6000000000001, 112, 0, 0, 482.6000000000001)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Algar', 'Algar', 36.6566286, -5.6564009, 0, 0, 5.3, 0, 5.3)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Alcalá del Valle', 'Alcalá del Valle', 36.9044094, -5.1720759, 87.3, 329.59999999999997, 0, 0, 416.9)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Alcalá de los Gazules', 'Alcalá de los Gazules', 36.4618805, -5.7238891, 0, 42, 0, 0, 42)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Barbate', 'Barbate', 36.1923983, -5.9192837, 0, 372.8, 0, 0, 372.8)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Arcos de la Frontera', 'Arcos de la Frontera', 36.7526913, -5.8122092, 3.5, 0, 0, 0, 3.5)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Algodonales', 'Algodonales', 36.879693, -5.4047755, 2, 0, 0, 0, 2)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Algeciras', 'Algeciras', 36.1311725, -5.4473991, 0.8, 0, 0, 0, 0.8)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Benaocaz', 'Benaocaz', 36.7006416, -5.421687, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Los Barrios', 'Los Barrios', 36.1853519, -5.4928657, 3.9, 81.9, 0, 0, 85.80000000000001)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Zahara', 'Zahara', 36.8405841, -5.3905374, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Villamartín', 'Villamartín', 36.8591822, -5.6434544, 12.3, 0, 0, 0, 12.3)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Villaluenga del Rosario', 'Villaluenga del Rosario', 36.6965773, -5.3860094, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Torre Alháquime', 'Torre Alháquime', 36.9156897, -5.2347672, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Trebujena', 'Trebujena', 36.8693137, -6.1767017, 60.09999999999999, 0, 0, 0, 60.09999999999999)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Setenil de las Bodegas', 'Setenil de las Bodegas', 36.8621836, -5.1787, 1.5000000000000002, 0, 2.3, 0, 3.8)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Tarifa', 'Tarifa', 36.0129082, -5.6050213, 0, 137.4, 0, 0, 137.4)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Sanlúcar de Barrameda', 'Sanlúcar de Barrameda', 36.7761393, -6.3534794, 4.200000000000001, 78.3, 0, 0, 82.5)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('San Roque', 'San Roque', 36.2100586, -5.3868293, 12.499999999999972, 0, 0, 0, 12.499999999999972)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Rota', 'Rota', 36.6228636, -6.3599595, 1.8000000000000005, 0, 0, 0, 1.8000000000000005)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('San Fernando', 'San Fernando', 36.4646672, -6.1983492, 0.1, 0, 0, 0, 0.1)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Ubrique', 'Ubrique', 36.6769347, -5.4457808, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Vejer de la Frontera', 'Vejer de la Frontera', 36.251937, -5.9670492, 0, 66.8, 0, 0, 66.8)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('San José del Valle', 'San José del Valle', 36.6062584, -5.7997029, 391.19999999999993, 0, 0, 0, 391.19999999999993)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Benalup-Casas Viejas', 'Benalup-Casas Viejas', 36.3449297, -5.8137236, 102.5, 40.9, 0, 0, 143.4)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('El Gastor', 'El Gastor', 36.8551853, -5.3236056, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Grazalema', 'Grazalema', 36.7583892, -5.366074, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Conil de la Frontera', 'Conil de la Frontera', 36.277054, -6.0881874, 0.1, 24, 0, 0, 24.1)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Chiclana de la Frontera', 'Chiclana de la Frontera', 36.4191096, -6.1460683, 0, 79.2, 0, 0, 79.2)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Chipiona', 'Chipiona', 36.7355451, -6.4348221, 0.1, 0, 0, 0, 0.1)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Espera', 'Espera', 36.8716918, -5.8060565, 1.1, 38.5, 0, 0, 39.6)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Bornos', 'Bornos', 36.8157427, -5.7434863, 0, 0, 4.6, 0, 4.6)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('El Bosque', 'El Bosque', 36.757294, -5.5067224, 0, 0, 0, 0, 0)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Cádiz', 'Cádiz', 36.5297438, -6.2928976, 3.6, 0, 0, 0, 3.6)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('Castellar de la Frontera', 'Castellar de la Frontera', 36.2867644, -5.4197113, 0, 24.6, 0, 0, 24.6)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        

            INSERT INTO energy_stats (municipio_id, municipio_name, lat, lng, solar_mw, eolica_mw, hidro_mw, biomasa_mw, total_mw)
            VALUES ('San Martín del Tesorillo', 'San Martín del Tesorillo', 36.3411723, -5.320496, 0.1, 67.4, 0, 0, 67.5)
            ON CONFLICT(municipio_id) DO UPDATE SET
            lat=excluded.lat,
            lng=excluded.lng,
            solar_mw=excluded.solar_mw,
            eolica_mw=excluded.eolica_mw,
            hidro_mw=excluded.hidro_mw,
            biomasa_mw=excluded.biomasa_mw,
            total_mw=excluded.total_mw,
            last_updated=CURRENT_TIMESTAMP;
        