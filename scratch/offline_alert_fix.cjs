const fs = require('fs');

let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const searchRenderMarker = `                renderMarker: (station, map) => {
                    return window.L.circleMarker([station.lat, station.lon], {
                        radius: 14,
                        fillColor: station.color,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map);
                },`;

const replaceRenderMarker = `                renderMarker: (station, map) => {
                    const diffMins = Math.floor((Date.now() - station.timestamp) / 60000);
                    const isOffline = diffMins > 1440; // 24 hours

                    if (isOffline) {
                        const alertIcon = window.L.divIcon({
                            html: \`<div style="background-color: #94a3b8; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white; color: white;">
                                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                   </div>\`,
                            className: '',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        });
                        return window.L.marker([station.lat, station.lon], { icon: alertIcon }).addTo(map);
                    } else {
                        return window.L.circleMarker([station.lat, station.lon], {
                            radius: 14,
                            fillColor: station.color,
                            color: '#ffffff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).addTo(map);
                    }
                },`;

const searchClick = `                        desc: \`
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px; font-family: 'Inter', system-ui, sans-serif;">
                                <div style="display: flex; align-items: flex-start; justify-content: space-between; background: linear-gradient(to right, transparent, \${station.color}15); padding: 12px; border-radius: 8px; border-left: 4px solid \${station.color};">`;

const replaceClick = `                        desc: \`
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px; font-family: 'Inter', system-ui, sans-serif;">
                                \${Math.floor((Date.now() - station.timestamp) / 60000) > 1440 ? \`<div style="background: var(--chat-bg); border-left: 4px solid #ef4444; padding: 10px; border-radius: 4px; display: flex; gap: 8px; align-items: flex-start; border-top: 1px solid var(--header-border); border-right: 1px solid var(--header-border); border-bottom: 1px solid var(--header-border);">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                                        <strong style="color: var(--text-primary);">Estación inactiva:</strong> No recibimos datos desde hace \${Math.floor(Math.floor((Date.now() - station.timestamp) / 60000)/1440)} días. El mantenimiento corresponde a la administración pública.
                                    </div>
                                </div>\` : ''}
                                <div style="display: flex; align-items: flex-start; justify-content: space-between; background: linear-gradient(to right, transparent, \${station.color}15); padding: 12px; border-radius: 8px; border-left: 4px solid \${station.color};">`;

let modified = false;
let idx = code.indexOf(searchRenderMarker);
if (idx !== -1) {
    code = code.substring(0, idx) + replaceRenderMarker + code.substring(idx + searchRenderMarker.length);
    modified = true;
}

idx = code.indexOf(searchClick);
if (idx !== -1) {
    code = code.substring(0, idx) + replaceClick + code.substring(idx + searchClick.length);
} else {
    modified = false;
}

if (modified) {
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully injected offline station alerts');
} else {
    console.log('Could not find injection targets');
}
