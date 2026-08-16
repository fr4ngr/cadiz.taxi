const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const layer = `
            'renovables': {
                name: 'Renovables',
                type: 'data',
                useClustering: false,
                color: '#10b981',
                source: 'Agencia Andaluza de la Energía',
                _markers: [],
                _isActive: false,
                contextBounds: [[35.95, -6.5], [37.0, -5.1]],
                fetchData: async () => {
                    try {
                        const res = await fetch('/api/renovables?t=' + Date.now());
                        if (!res.ok) return [];
                        const json = await res.json();
                        return json || [];
                    } catch (e) {
                        return [];
                    }
                },
                renderMarker: (city, map) => {
                    const totalMw = city.total_mw || ((city.solar_mw || 0) + (city.eolica_mw || 0) + (city.hidro_mw || 0) + (city.biomasa_mw || 0));
                    const radius = Math.min(Math.max(12, totalMw * 0.1), 50);
                    return window.L.circleMarker([city.lat, city.lng], {
                        radius: radius,
                        fillColor: '#10b981',
                        color: '#047857',
                        weight: 2,
                        opacity: 0.9,
                        fillOpacity: 0.6
                    });
                },
                onMarkerClick: (city) => {
                    const fmtMW = (mw) => {
                        if (!mw) return 0;
                        const num = Number(mw);
                        return num % 1 === 0 ? num : num.toFixed(1);
                    };
                    const totalMw = city.total_mw || ((city.solar_mw || 0) + (city.eolica_mw || 0) + (city.hidro_mw || 0) + (city.biomasa_mw || 0));
                    const solar = city.solar_mw || 0;
                    const eolica = city.eolica_mw || 0;
                    const hidro = city.hidro_mw || 0;
                    const bio = city.biomasa_mw || 0;

                    const html = \`
                        <div style="font-family:system-ui,sans-serif;">
                            <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">
                                \${city.name}
                            </div>
                            
                            <div style="display:flex;align-items:baseline;gap:6px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:32px;font-weight:800;color:#10b981;">\${fmtMW(totalMw)} <span style="font-size:16px;">MW</span></div>
                                <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">instalados en el término municipal</div>
                            </div>
                            
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:10px; text-align:center;">
                                    <div style="display:flex;align-items:center;justify-content:center;height:24px;margin-bottom:6px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>
                                    <div style="font-size:18px; font-weight:800; color:#f59e0b;">\${fmtMW(solar)}</div>
                                    <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Solar (MW)</div>
                                </div>
                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:10px; text-align:center;">
                                    <div style="display:flex;align-items:center;justify-content:center;height:24px;margin-bottom:6px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg></div>
                                    <div style="font-size:18px; font-weight:800; color:#3b82f6;">\${fmtMW(eolica)}</div>
                                    <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Eólica (MW)</div>
                                </div>
                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:10px; text-align:center;">
                                    <div style="display:flex;align-items:center;justify-content:center;height:24px;margin-bottom:6px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg></div>
                                    <div style="font-size:18px; font-weight:800; color:#0ea5e9;">\${fmtMW(hidro)}</div>
                                    <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Hidráulica (MW)</div>
                                </div>
                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:10px; text-align:center;">
                                    <div style="display:flex;align-items:center;justify-content:center;height:24px;margin-bottom:6px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#84cc16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>
                                    <div style="font-size:18px; font-weight:800; color:#84cc16;">\${fmtMW(bio)}</div>
                                    <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Biomasa (MW)</div>
                                </div>
                            </div>
                            
                            <div id="ree-popup-data" style="margin-top: 12px; padding: 10px; background: color-mix(in srgb, var(--header-bg) 50%, transparent); border: 1px solid var(--border-color); border-radius: 8px; font-size: 12px; color: var(--text-primary);">
                                <div style="display:flex; align-items:center; gap:6px; color:var(--text-secondary); font-size:11px; margin-bottom:4px;">
                                    <div style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse-green 2s infinite;"></div>
                                    <span style="text-transform:uppercase; font-weight:700;">Conectando con Red Eléctrica...</span>
                                </div>
                            </div>
                            
                            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 6px;">
                                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                    <span>[1] Fuente WFS Junta de Andalucía</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>[1] \${city.lastUpdatedText || 'Actualizado en 2024'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                    <span>[2] Fuente API Red Eléctrica Española</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>[2] En tiempo real (HOY)</span>
                                </div>
                            </div>
                        </div>
                    \`;
                    
                    setTimeout(() => {
                        fetch('/api/ree')
                            .then(r => r.json())
                            .then(data => {
                                const container = document.getElementById('ree-popup-data');
                                if (container && data.esp) {
                                    const renderMix = (title, d, isMock) => \`
                                        <div style="margin-top:16px;">
                                            <div style="font-size:10px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; display:flex; justify-content:space-between;">
                                                <span>\${title}</span>
                                                \${isMock ? '<span style="color:#ef4444;" title="API de CCAA en mantenimiento por REE, mostrando simulación">⚠️ Simulado</span>' : \`<span style="color:#10b981;">En directo (\${data.time})</span>\`}
                                            </div>
                                            
                                            <!-- Número impactante -->
                                            <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:12px;">
                                                <div style="font-size:36px; font-weight:900; color:#10b981; line-height:1;">\${d.renPct}<span style="font-size:18px;">%</span></div>
                                                <div style="font-size:12px; font-weight:600; color:var(--text-secondary); text-transform:uppercase;">Total Renovable</div>
                                            </div>

                                            <!-- Tarjetas de Fuentes (Grid 2x2) -->
                                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:8px; text-align:center;">
                                                    <div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>
                                                    <div style="font-size:15px; font-weight:800; color:#f59e0b;">\${d.solPct}%</div>
                                                    <div style="font-size:9px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Solar</div>
                                                </div>
                                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:8px; text-align:center;">
                                                    <div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg></div>
                                                    <div style="font-size:15px; font-weight:800; color:#3b82f6;">\${d.eolPct}%</div>
                                                    <div style="font-size:9px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Eólica</div>
                                                </div>
                                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:8px; text-align:center;">
                                                    <div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg></div>
                                                    <div style="font-size:15px; font-weight:800; color:#0ea5e9;">\${d.hidPct}%</div>
                                                    <div style="font-size:9px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Hidráulica</div>
                                                </div>
                                                <div style="background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:8px; text-align:center;">
                                                    <div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>
                                                    <div style="font-size:15px; font-weight:800; color:#84cc16;">\${d.otrPct}%</div>
                                                    <div style="font-size:9px; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">Biomasa y otras</div>
                                                </div>
                                            </div>
                                        </div>
                                    \`;
                                    
                                    const andIsError = data.and && data.and.error;
                                    const espIsError = data.esp && data.esp.error;
                                    
                                    const renderAndalucia = () => andIsError ? 
                                        \`<div style="margin-top:16px;">
                                            <div style="font-size:10px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; display:flex; justify-content:space-between;">
                                                <span>MIX ENERGÉTICO ANDALUCÍA</span>
                                            </div>
                                            <div style="display:flex; align-items:center; gap:8px; background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:12px;">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                <div>
                                                    <div style="font-size:14px; font-weight:700; color:var(--text-primary);">N/D</div>
                                                    <div style="font-size:10px; color:var(--text-secondary);">API de Red Eléctrica inactiva</div>
                                                </div>
                                            </div>
                                        </div>\` : renderMix('MIX ENERGÉTICO ANDALUCÍA', data.and, false);

                                    const renderEspana = () => espIsError ? 
                                        \`<div style="margin-top:16px;">
                                            <div style="font-size:10px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; display:flex; justify-content:space-between;">
                                                <span>MIX ENERGÉTICO ESPAÑA</span>
                                            </div>
                                            <div style="display:flex; align-items:center; gap:8px; background:var(--chat-bg); border:1px solid var(--border-color); border-radius:8px; padding:12px;">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                <div>
                                                    <div style="font-size:14px; font-weight:700; color:var(--text-primary);">N/D</div>
                                                    <div style="font-size:10px; color:var(--text-secondary);">API de Red Eléctrica inactiva</div>
                                                </div>
                                            </div>
                                        </div>\` : renderMix('MIX ENERGÉTICO ESPAÑA', data.esp, false);
                                    
                                    let htmlOutput = '';
                                    if (espIsError && !andIsError) {
                                        htmlOutput = renderAndalucia() + \`<div style="height:1px; background:var(--header-border); margin:16px 0;"></div>\` + renderEspana();
                                    } else if (andIsError && !espIsError) {
                                        htmlOutput = renderEspana() + \`<div style="height:1px; background:var(--header-border); margin:16px 0;"></div>\` + renderAndalucia();
                                    } else {
                                        htmlOutput = renderAndalucia() + \`<div style="height:1px; background:var(--header-border); margin:16px 0;"></div>\` + renderEspana();
                                    }

                                    container.innerHTML = htmlOutput;
                                }
                            }).catch(console.error);
                    }, 50);

                    return {
                        label: '🌱 RENOVABLES',
                        title: city.name,
                        desc: html,
                        showActions: false,
                        recenter: [city.lat, city.lng]
                    };
                }
            },
`;

if (!code.includes('renovables') && !code.includes('autoconsumo')) {
    code = code.replace("            'aviones': {", layer + "            'aviones': {");
}

const buttonHtml = `
                    <button class="layer-btn" data-layer="renovables">
                        <div class="layer-icon" style="background:#10b981;color:white;box-shadow:0 0 10px rgba(16, 185, 129,0.4);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <div class="layer-text">Renovables</div>
                    </button>
`;

if (!code.includes('data-layer="renovables"')) {
    code = code.replace('<button class="layer-btn" data-layer="aviones">', buttonHtml + '                    <button class="layer-btn" data-layer="aviones">');
}

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Restored MapWidget.astro successfully!');
