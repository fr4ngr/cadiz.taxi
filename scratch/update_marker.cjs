const fs = require('fs');

let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const oldRenderMarkerRegex = /renderMarker:\s*\(city,\s*map\)\s*=>\s*\{[\s\S]*?return window\.L\.circleMarker\(\[city\.lat,\s*city\.lon\],\s*\{[\s\S]*?\}\);\s*\}/m;

const newRenderMarker = `renderMarker: (city, map) => {
                    // Calculate total power
                    const totalMw = (city.mw || 0) + (city.mwSolMacro || 0) + (city.mwEol || 0) + (city.mwHid || 0) + (city.mwBiomasa || 0);
                    
                    // Determine dominant energy source for color
                    let dominantColor = '#f59e0b'; // Default Orange (Solar)
                    let maxMw = Math.max(city.mw || 0, city.mwSolMacro || 0);
                    let outlineColor = '#b45309';
                    
                    if ((city.mwEol || 0) > maxMw) {
                        maxMw = city.mwEol;
                        dominantColor = '#3b82f6'; // Blue (Eolica)
                        outlineColor = '#1d4ed8';
                    }
                    if ((city.mwHid || 0) > maxMw) {
                        maxMw = city.mwHid;
                        dominantColor = '#0ea5e9'; // Light Blue (Hidro)
                        outlineColor = '#0369a1';
                    }
                    if ((city.mwBiomasa || 0) > maxMw) {
                        maxMw = city.mwBiomasa;
                        dominantColor = '#84cc16'; // Green (Biomasa)
                        outlineColor = '#4d7c0f';
                    }
                    
                    // Finer radius that scales logarithmically or gentler so they don't overlap wildly
                    // e.g. 500 MW shouldn't cover the whole screen. Max radius 40.
                    let radius = 8 + Math.sqrt(totalMw);
                    if (radius > 45) radius = 45;
                    
                    return window.L.circleMarker([city.lat, city.lon], {
                        radius: radius,
                        fillColor: dominantColor,
                        color: outlineColor,
                        weight: 2,
                        opacity: 0.8,
                        fillOpacity: 0.5
                    });
                }`;

if (oldRenderMarkerRegex.test(code)) {
    code = code.replace(oldRenderMarkerRegex, newRenderMarker);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
    console.log('Successfully updated renderMarker.');
} else {
    console.log('Regex for renderMarker not found!');
}
