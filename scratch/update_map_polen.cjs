const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const newButton = `
        <button class="filter-pill" onclick="window.selectMapLayer('polen')" style="border-color: #8b5cf6; color: #8b5cf6;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            Polen / Alergias
        </button>
    </div>`;

code = code.replace('    </div>\n\n    <!-- RADIAL MENUS CONTAINER -->', newButton + '\n\n    <!-- RADIAL MENUS CONTAINER -->');

const aireEnd = `                            </div>\`
                    };
                }
            }`;

const polenRegistry = `,

            // ---------------------------------------------------------
            // POLEN (Alergias CAMS)
            // ---------------------------------------------------------
            'polen': {
                type: 'data',
                color: '#8b5cf6',
                _markers: [],
                _isActive: false,
                autoZoom: false,
                fetchData: async () => {
                    const res = await fetch('/api/pollen?v=1');
                    const data = await res.json();
                    if (!Array.isArray(data)) throw new Error("API error");
                    return data;
                },
                renderMarker: (city, map) => {
                    const leafIcon = window.L.divIcon({
                        html: \`<div style="background-color: \${city.color}; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white; color: white;">
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                               </div>\`,
                        className: '',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });
                    return window.L.marker([city.lat, city.lon], { icon: leafIcon }).addTo(map);
                },
                onMarkerClick: (city) => {
                    window.mapActionDirections = () => {
                        window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${city.lat},\${city.lon}\`, '_blank');
                    };
                    
                    let timeStr = 'recientemente';
                    if (city.timestamp) {
                        const diffMins = Math.floor((Date.now() - city.timestamp) / 60000);
                        if (diffMins < 1) {
                            timeStr = 'ahora mismo';
                        } else if (diffMins < 60) {
                            timeStr = \`hace \${diffMins} minuto\${diffMins !== 1 ? 's' : ''}\`;
                        } else if (diffMins < 1440) {
                            const hrs = Math.floor(diffMins/60);
                            timeStr = \`hace \${hrs} hora\${hrs !== 1 ? 's' : ''}\`;
                        } else {
                            const days = Math.floor(diffMins/1440);
                            timeStr = \`hace \${days} día\${days !== 1 ? 's' : ''}\`;
                        }
                    }

                    return {
                        label: 'RIESGO DE ALERGIA',
                        labelColor: city.color,
                        title: city.name,
                        recenter: [city.lat - 0.05, city.lon],
                        showActions: false,
                        desc: \`
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px; font-family: 'Inter', system-ui, sans-serif;">
                                <div style="display: flex; align-items: flex-start; justify-content: space-between; background: linear-gradient(to right, transparent, \${city.color}15); padding: 12px; border-radius: 8px; border-left: 4px solid \${city.color};">
                                    <div style="width: 100%;">
                                        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px;">NIVEL DE ALERTA GLOBAL</div>
                                        
                                        <div style="display: flex; align-items: center; justify-content: space-between;">
                                            <span style="font-size: 28px; font-weight: 800; color: \${city.color}; letter-spacing: -0.5px; line-height: 1;">\${city.globalRisk}</span>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="\${city.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                                        </div>
                                    </div>
                                </div>

                                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px; margin-top: 4px;">Agrupaciones (CAMS)</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Olivo <span style="font-weight:700;">(Olea)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${city.indicators.olive.value} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">gr/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Riesgo: <span style="font-weight:700; color:\${city.indicators.olive.color};">\${city.indicators.olive.risk}</span></div>
                                    </div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Gramíneas <span style="font-weight:700;">(Poaceae)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${city.indicators.grass.value} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">gr/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Riesgo: <span style="font-weight:700; color:\${city.indicators.grass.color};">\${city.indicators.grass.risk}</span></div>
                                    </div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Malezas <span style="font-weight:700;">(Parietaria)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${city.indicators.weed.value} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">gr/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Riesgo: <span style="font-weight:700; color:\${city.indicators.weed.color};">\${city.indicators.weed.risk}</span></div>
                                    </div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Árboles <span style="font-weight:700;">(Primavera)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${city.indicators.trees.value} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">gr/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Riesgo: <span style="font-weight:700; color:\${city.indicators.trees.color};">\${city.indicators.trees.risk}</span></div>
                                    </div>
                                </div>
                                
                                <div style="background: var(--chat-bg); padding: 10px; border-radius: 8px; border: 1px solid \${city.indicators.mites.color}40; display: flex; flex-direction: column; gap: 4px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">Humedad & Ácaros</div>
                                        <div style="font-size: 10px; font-weight: 700; color: \${city.indicators.mites.color}; background: \${city.indicators.mites.color}15; padding: 2px 6px; border-radius: 10px;">Riesgo \${city.indicators.mites.risk}</div>
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-primary);">Humedad Relativa: <span style="font-weight: 600;">\${city.indicators.mites.value}%</span></div>
                                </div>

                                <div style="margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        <span>Fuente: Copernicus CAMS (Vía Open-Meteo)</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Actualizado \${timeStr}</span>
                                    </div>
                                </div>
                            </div>\`
                    };
                }
            }`;

code = code.replace(aireEnd, aireEnd + polenRegistry);
fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
console.log('Successfully injected pollen map layer!');
