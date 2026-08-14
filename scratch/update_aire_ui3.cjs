const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const startStr = "const eaqiRange = station.aqi <= 20";
const endStr = "Fuente: AEMA / OpenAQ\n                                    </div>\n                                    <div style=\"font-style: italic; font-size: 10px;\">Actualizado cada hora</div>\n                                </div>\n                            </div>`\n                    };";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const fullEndIdx = endIdx + endStr.length;
    
    const replacement = `const eaqiRange = station.aqi <= 20 ? '0-20' : (station.aqi <= 40 ? '21-40' : (station.aqi <= 60 ? '41-60' : (station.aqi <= 100 ? '61-100' : '>100')));
                    let timeStr = 'recientemente';
                    if (station.timestamp) {
                        const diffMins = Math.floor((Date.now() - station.timestamp) / 60000);
                        if (diffMins < 1) timeStr = 'ahora mismo';
                        else if (diffMins < 60) timeStr = \`hace \${diffMins} min\`;
                        else if (diffMins < 1440) timeStr = \`hace \${Math.floor(diffMins/60)} h\`;
                        else timeStr = \`hace \${Math.floor(diffMins/1440)} d\`;
                    }
                    return {
                        label: 'ESTACIÓN METEOROLÓGICA',
                        labelColor: station.color,
                        title: \`Estación \${station.name}\`,
                        recenter: [station.lat - 0.05, station.lon],
                        showActions: false,
                        desc: \`
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px; font-family: 'Inter', system-ui, sans-serif;">
                                <div style="display: flex; align-items: flex-start; justify-content: space-between; background: linear-gradient(to right, transparent, \${station.color}15); padding: 12px; border-radius: 8px; border-left: 4px solid \${station.color};">
                                    <div style="width: 100%;">
                                        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px;">CALIDAD DEL AIRE</div>
                                        
                                        <div style="display: flex; align-items: baseline; justify-content: space-between;">
                                            <div style="display: flex; align-items: baseline; gap: 6px;">
                                                <span style="font-size: 32px; font-weight: 800; color: \${station.color}; letter-spacing: -1px; line-height: 1;">\${station.aqi}</span>
                                                <span style="font-size: 12px; color: var(--text-secondary); font-weight: 500;">EAQI (Rango \${eaqiRange})</span>
                                            </div>
                                            <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">\${station.status}</div>
                                        </div>
                                        
                                        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
                                            <div style="width: 100%; height: 6px; background: var(--chat-bg); border-radius: 3px; overflow: hidden; border: 1px solid var(--header-border);">
                                                <div style="width: \${Math.min((station.aqi / 110) * 100, 100)}%; height: 100%; background: \${station.color}; border-radius: 3px;"></div>
                                            </div>
                                            <div style="display: flex; justify-content: flex-end;">
                                                <span style="font-size: 9px; color: var(--text-secondary); font-style: italic;">Índice Europeo de Calidad del Aire</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px; margin-top: 4px;">Agentes Contaminantes (Tiempo Real)</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Polvo Fino <span style="font-weight:700;">(PM2.5)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.pm25} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Límite OMS: <span style="font-weight:600; color:\${station.pm25 > 15 ? '#ef4444' : 'var(--text-secondary)'};">15 μg/m³</span></div>
                                    </div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Polvo <span style="font-weight:700;">(PM10)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.pm10} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Límite OMS: <span style="font-weight:600; color:\${station.pm10 > 45 ? '#ef4444' : 'var(--text-secondary)'};">45 μg/m³</span></div>
                                    </div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Tráfico <span style="font-weight:700;">(NO2)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.no2} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Límite OMS: <span style="font-weight:600; color:\${station.no2 > 25 ? '#ef4444' : 'var(--text-secondary)'};">25 μg/m³</span></div>
                                    </div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;">
                                        <div style="font-size: 11px; color: var(--text-secondary);">Ozono <span style="font-weight:700;">(O3)</span></div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.o3} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div>
                                        <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Límite OMS: <span style="font-weight:600; color:\${station.o3 > 100 ? '#ef4444' : 'var(--text-secondary)'};">100 μg/m³</span></div>
                                    </div>
                                </div>

                                <div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; justify-content: space-between;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        Fuente: AEMA / OpenAQ
                                    </div>
                                    <div style="font-style: italic; font-size: 10px;">Actualizado \${timeStr}</div>
                                </div>
                            </div>\`
                    };`;

    code = code.substring(0, startIdx) + replacement + code.substring(fullEndIdx);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully replaced HTML structure using substring!');
} else {
    console.log('Could not find start or end bounds.', {startIdx, endIdx});
}
