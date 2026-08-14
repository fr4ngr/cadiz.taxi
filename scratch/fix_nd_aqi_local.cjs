const fs = require('fs');

// 1. UPDATE BACKEND (air-quality.js)
let apiCode = fs.readFileSync('functions/api/air-quality.js', 'utf8');

const searchAqi = `                    // Calculate EAQI (European Air Quality Index) simplification
                    const no2 = readings.no2 || 0;
                    const o3 = readings.o3 || 0;
                    const pm10 = readings.pm10 || 0;
                    const pm25 = readings.pm25 || 0;

                    let aqi = 10; // default good
                    if (no2 > 40 || o3 > 50 || pm10 > 20 || pm25 > 10) aqi = 30; // Fair
                    if (no2 > 90 || o3 > 100 || pm10 > 40 || pm25 > 20) aqi = 60; // Moderate
                    if (no2 > 120 || o3 > 130 || pm10 > 50 || pm25 > 25) aqi = 80; // Poor
                    if (no2 > 230 || o3 > 240 || pm10 > 100 || pm25 > 50) aqi = 110; // Very Poor

                    let status = "Buena";
                    let color = "#10b981"; // Green
                    
                    if (aqi > 20) { status = "Regular"; color = "#eab308"; } // Yellow
                    if (aqi > 40) { status = "Moderada"; color = "#f97316"; } // Orange
                    if (aqi > 60) { status = "Mala"; color = "#ef4444"; } // Red
                    if (aqi > 100) { status = "Muy Mala"; color = "#8b5cf6"; } // Purple`;

const replaceAqi = `                    // Calculate EAQI (European Air Quality Index) simplification
                    const hasAnyData = readings.no2 !== null || readings.o3 !== null || readings.pm10 !== null || readings.pm25 !== null;
                    
                    let aqi = 'N/D';
                    let status = "Sin Datos";
                    let color = "#94a3b8"; // Gray

                    if (hasAnyData) {
                        const no2 = readings.no2 || 0;
                        const o3 = readings.o3 || 0;
                        const pm10 = readings.pm10 || 0;
                        const pm25 = readings.pm25 || 0;

                        aqi = 10; // default good
                        if (no2 > 40 || o3 > 50 || pm10 > 20 || pm25 > 10) aqi = 30; // Fair
                        if (no2 > 90 || o3 > 100 || pm10 > 40 || pm25 > 20) aqi = 60; // Moderate
                        if (no2 > 120 || o3 > 130 || pm10 > 50 || pm25 > 25) aqi = 80; // Poor
                        if (no2 > 230 || o3 > 240 || pm10 > 100 || pm25 > 50) aqi = 110; // Very Poor

                        status = "Buena";
                        color = "#10b981"; // Green
                        
                        if (aqi > 20) { status = "Regular"; color = "#eab308"; } // Yellow
                        if (aqi > 40) { status = "Moderada"; color = "#f97316"; } // Orange
                        if (aqi > 60) { status = "Mala"; color = "#ef4444"; } // Red
                        if (aqi > 100) { status = "Muy Mala"; color = "#8b5cf6"; } // Purple
                    }`;

let idx = apiCode.indexOf(searchAqi);
if (idx !== -1) {
    apiCode = apiCode.substring(0, idx) + replaceAqi + apiCode.substring(idx + searchAqi.length);
    fs.writeFileSync('functions/api/air-quality.js', apiCode, 'utf8');
    console.log('Backend AQI logic updated to support N/D');
} else {
    console.log('Could not find AQI logic in backend');
}

// 2. UPDATE FRONTEND (MapWidget.astro)
let astroCode = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Bust cache to v3
astroCode = astroCode.replace("fetch('/api/air-quality?v=2')", "fetch('/api/air-quality?v=3')");

// Fix AQI bar math to not crash on 'N/D'
const searchBar = `<div style="width: \${Math.min((station.aqi / 110) * 100, 100)}%; height: 100%; background: \${station.color}; border-radius: 3px;"></div>`;
const replaceBar = `<div style="width: \${station.aqi === 'N/D' ? 0 : Math.min((station.aqi / 110) * 100, 100)}%; height: 100%; background: \${station.color}; border-radius: 3px;"></div>`;
astroCode = astroCode.replace(searchBar, replaceBar);

fs.writeFileSync('src/components/widgets/MapWidget.astro', astroCode, 'utf8');
console.log('Frontend MapWidget.astro updated for N/D bar and v3 cache bust');
