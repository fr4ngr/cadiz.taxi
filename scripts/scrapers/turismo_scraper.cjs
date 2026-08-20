const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TARGET_FILE = path.join(__dirname, '../../public/api/turismo_data.json');
const COORDS_DATA = path.join(__dirname, '../../scratch/coords.json');

// Tourist hotspots in Cádiz province monitored by INE
const PUNTOS_TURISTICOS = [
    'Cádiz', 'Jerez de la Frontera', 'Chiclana de la Frontera', 
    'Conil de la Frontera', 'El Puerto de Santa María', 'Tarifa', 'Zahara'
];

async function fetchIneData(seriesId) {
    if (!seriesId) return null;
    try {
        const url = `https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${seriesId}?nult=1`;
        const res = await axios.get(url);
        if (res.data && res.data.Data && res.data.Data.length > 0) {
            return res.data.Data[0].Valor;
        }
    } catch(e) {
        console.error(`Error fetching series ${seriesId}: ${e.message}`);
    }
    return null;
}

async function runScraper() {
    console.log("==========================================");
    console.log("🏨 INICIANDO PIPELINE ETL: TURISMO (INE Tempus 3)");
    console.log("==========================================");
    
    const coordsJson = JSON.parse(fs.readFileSync(COORDS_DATA, 'utf8'));
    coordsJson["Cádiz Capital"] = coordsJson["Cádiz"];
    coordsJson["El Puerto de Sta. Mª"] = coordsJson["El Puerto de Santa María"];

    const features = [];
    const municipalities = Object.keys(coordsJson).filter(k => !['Cádiz Capital', 'El Puerto de Sta. Mª', 'Sanlúcar de Bdra.', 'Arcos de la Fra.', 'Conil de la Fra.', 'La Línea'].includes(k));

    // First, let's get all series for Table 75197 (Viajeros y pernoctaciones)
    let seriesViajeros = [];
    let seriesOcupacion = [];
    
    try {
        const res1 = await axios.get('https://servicios.ine.es/wstempus/js/ES/SERIES_TABLA/75197');
        seriesViajeros = res1.data;
        const res2 = await axios.get('https://servicios.ine.es/wstempus/js/ES/SERIES_TABLA/75198');
        seriesOcupacion = res2.data;
    } catch(e) {
        console.error("No se pudo conectar a la API del INE para obtener metadatos.");
        return;
    }

    console.log(`[Pipeline] Procesando ${municipalities.length} municipios...`);

    for (const muni of municipalities) {
        const isHotspot = PUNTOS_TURISTICOS.includes(muni);
        let props = {
            municipio: muni,
            is_hotspot: isHotspot,
            viajeros_esp: null,
            viajeros_ext: null,
            pernoctaciones_esp: null,
            pernoctaciones_ext: null,
            ocupacion: null
        };

        if (isHotspot) {
            console.log(`Descargando datos en tiempo real para: ${muni}...`);
            
            // Find series IDs dynamically matching the town name
            // Note: INE naming can be tricky, 'Cádiz' vs '11012-Cádiz' vs 'Jerez De La Frontera'
            const searchName = muni === 'Jerez de la Frontera' ? 'Jerez De La Frontera' : muni;
            
            const v_esp = seriesViajeros.find(s => s.Nombre.includes(searchName) && s.Nombre.includes('Viajero') && s.Nombre.includes('España'));
            const v_ext = seriesViajeros.find(s => s.Nombre.includes(searchName) && s.Nombre.includes('Viajero') && s.Nombre.includes('extranjero'));
            const p_esp = seriesViajeros.find(s => s.Nombre.includes(searchName) && s.Nombre.includes('Pernoctaciones') && s.Nombre.includes('España'));
            const p_ext = seriesViajeros.find(s => s.Nombre.includes(searchName) && s.Nombre.includes('Pernoctaciones') && s.Nombre.includes('extranjero'));
            
            const oc = seriesOcupacion.find(s => s.Nombre.includes(searchName) && s.Nombre.includes('ocupación por plazas') && !s.Nombre.includes('fin de semana'));

            if (v_esp) props.viajeros_esp = await fetchIneData(v_esp.COD);
            if (v_ext) props.viajeros_ext = await fetchIneData(v_ext.COD);
            if (p_esp) props.pernoctaciones_esp = await fetchIneData(p_esp.COD);
            if (p_ext) props.pernoctaciones_ext = await fetchIneData(p_ext.COD);
            if (oc) props.ocupacion = await fetchIneData(oc.COD);
            
            // Wait slightly to not hammer the API
            await new Promise(r => setTimeout(r, 200));
        }

        features.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: coordsJson[muni] },
            properties: props
        });
    }

    const db = {
        metadata: {
            last_updated: new Date().toISOString(),
            source: "API INE (Tempus 3) - Encuesta Ocupación Hotelera",
            notice: "Datos dinámicos obtenidos en tiempo real de los Puntos Turísticos oficiales."
        },
        type: "FeatureCollection",
        features: features
    };

    fs.writeFileSync(TARGET_FILE, JSON.stringify(db, null, 2));
    console.log(`✅ Pipeline de Turismo finalizado: ${TARGET_FILE}`);
}

runScraper();
