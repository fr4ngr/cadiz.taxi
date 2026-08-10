import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_CER = "https://ssl.renfe.com/ftransit/Fichero_CER_FOMENTO/fomento_transit.zip";
const TEMP_DIR = path.join(__dirname, '../temp_gtfs');
const OUT_FILE = path.join(__dirname, '../public/data/renfe_cadiz.json');

function parseCSV(content) {
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (values[i] || '').trim(); });
        return obj;
    });
}

async function main() {
    console.log("Creando directorio temporal...");
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
    
    const zipPath = path.join(TEMP_DIR, 'cercanias.zip');
    console.log(`Descargando GTFS desde ${URL_CER}...`);
    execSync(`curl -s -L -o "${zipPath}" ${URL_CER}`);
    
    console.log("Descomprimiendo...");
    try {
        execSync(`tar -xf "${zipPath}" -C "${TEMP_DIR}"`);
    } catch(e) {
        execSync(`powershell -command "Expand-Archive -Force '${zipPath}' '${TEMP_DIR}'"`);
    }

    console.log("Procesando datos...");
    const routesData = parseCSV(fs.readFileSync(path.join(TEMP_DIR, 'routes.txt'), 'utf8'));
    const tripsData = parseCSV(fs.readFileSync(path.join(TEMP_DIR, 'trips.txt'), 'utf8'));
    const stopTimesData = parseCSV(fs.readFileSync(path.join(TEMP_DIR, 'stop_times.txt'), 'utf8'));
    const stopsData = parseCSV(fs.readFileSync(path.join(TEMP_DIR, 'stops.txt'), 'utf8'));
    const calendarData = fs.existsSync(path.join(TEMP_DIR, 'calendar.txt')) ? parseCSV(fs.readFileSync(path.join(TEMP_DIR, 'calendar.txt'), 'utf8')) : [];
    const calendarDatesData = fs.existsSync(path.join(TEMP_DIR, 'calendar_dates.txt')) ? parseCSV(fs.readFileSync(path.join(TEMP_DIR, 'calendar_dates.txt'), 'utf8')) : [];

    // 1. Filtrar rutas de Cádiz (comienzan por 31)
    const cadizRoutes = routesData.filter(r => r.route_id.startsWith('31'));
    const routeIds = new Set(cadizRoutes.map(r => r.route_id));
    console.log(`Encontradas ${cadizRoutes.length} rutas para Cádiz.`);

    // 2. Filtrar viajes (trips)
    const cadizTrips = tripsData.filter(t => routeIds.has(t.route_id));
    const tripIds = new Set(cadizTrips.map(t => t.trip_id));
    console.log(`Encontrados ${cadizTrips.length} viajes (trips).`);

    // 3. Filtrar horarios (stop_times)
    const cadizStopTimes = stopTimesData.filter(st => tripIds.has(st.trip_id));
    const stopIds = new Set(cadizStopTimes.map(st => st.stop_id));
    console.log(`Encontrados ${cadizStopTimes.length} paradas de horario.`);

    // 4. Filtrar estaciones (stops)
    const cadizStops = stopsData.filter(s => stopIds.has(s.stop_id));
    
    // Convertir a estructura optimizada
    const outData = {
        routes: {},
        stops: {},
        trips: [],
        calendar: {},
        calendar_dates: {}
    };

    cadizRoutes.forEach(r => outData.routes[r.route_id] = { short_name: r.route_short_name, long_name: r.route_long_name });
    cadizStops.forEach(s => outData.stops[s.stop_id] = { name: s.stop_name, lat: s.stop_lat, lon: s.stop_lon });
    
    calendarData.forEach(c => {
        outData.calendar[c.service_id] = {
            days: [c.sunday, c.monday, c.tuesday, c.wednesday, c.thursday, c.friday, c.saturday].map(Number),
            start: c.start_date,
            end: c.end_date
        };
    });

    calendarDatesData.forEach(cd => {
        if (!outData.calendar_dates[cd.service_id]) outData.calendar_dates[cd.service_id] = [];
        outData.calendar_dates[cd.service_id].push({ date: cd.date, type: Number(cd.exception_type) });
    });

    // Agrupar stop_times por trip
    const tripsMap = {};
    cadizStopTimes.forEach(st => {
        if (!tripsMap[st.trip_id]) tripsMap[st.trip_id] = [];
        tripsMap[st.trip_id].push({
            s: st.stop_id,
            t: st.departure_time, // Asumimos arr == dep para cercanias
            q: Number(st.stop_sequence)
        });
    });

    cadizTrips.forEach(t => {
        const stops = tripsMap[t.trip_id] || [];
        stops.sort((a, b) => a.q - b.q);
        outData.trips.push({
            t: t.trip_id,
            r: t.route_id,
            s: t.service_id,
            st: stops.map(x => [x.s, x.t.substring(0, 5)]) // [ "60000", "14:00" ]
        });
    });

    // Guardar
    if (!fs.existsSync(path.dirname(OUT_FILE))) fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(outData));
    console.log(`Guardado en ${OUT_FILE} (${(fs.statSync(OUT_FILE).size / 1024).toFixed(2)} KB)`);
    
    // Limpieza
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log("Directorio temporal eliminado. Proceso completado.");
}

main().catch(console.error);
