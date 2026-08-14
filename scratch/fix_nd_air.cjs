const fs = require('fs');

// 1. UPDATE BACKEND
let apiCode = fs.readFileSync('functions/api/air-quality.js', 'utf8');

// Replace readings initialization
apiCode = apiCode.replace(
    'const readings = { pm10: 0, pm25: 0, no2: 0, o3: 0, so2: 0, co: 0 };',
    'const readings = { pm10: null, pm25: null, no2: null, o3: null, so2: null, co: null };'
);

fs.writeFileSync('functions/api/air-quality.js', apiCode, 'utf8');


// 2. UPDATE FRONTEND
let astroCode = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// The block to replace:
const searchHtml = `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px; margin-top: 4px;">Principales Contaminantes</div>
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
                                </div>`;

const replaceHtml = `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px; margin-top: 4px;">Principales Contaminantes</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    \${(() => {
                                        const renderBox = (name, symbol, val, limit) => {
                                            const hasData = val !== null && val !== undefined;
                                            const displayVal = hasData ? val : 'N/D';
                                            const unitHtml = hasData ? ' <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span>' : '';
                                            const valColor = hasData ? 'var(--text-primary)' : 'var(--text-secondary)';
                                            const limitColor = hasData && val > limit ? '#ef4444' : 'var(--text-secondary)';
                                            
                                            return \`<div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px; opacity: \${hasData ? '1' : '0.6'};">
                                                <div style="font-size: 11px; color: var(--text-secondary);">\${name} <span style="font-weight:700;">(\${symbol})</span></div>
                                                <div style="font-size: 14px; font-weight: 600; color: \${valColor};">\${displayVal}\${unitHtml}</div>
                                                <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 2px; padding-top: 4px; border-top: 1px dashed var(--header-border);">Límite OMS: <span style="font-weight:600; color:\${limitColor};">\${limit} μg/m³</span></div>
                                            </div>\`;
                                        };
                                        return renderBox('Polvo Fino', 'PM2.5', station.pm25, 15) +
                                               renderBox('Polvo', 'PM10', station.pm10, 45) +
                                               renderBox('Tráfico', 'NO2', station.no2, 25) +
                                               renderBox('Ozono', 'O3', station.o3, 100);
                                    })()}
                                </div>`;

const idx = astroCode.indexOf(searchHtml);
if (idx !== -1) {
    astroCode = astroCode.substring(0, idx) + replaceHtml + astroCode.substring(idx + searchHtml.length);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', astroCode, 'utf8');
    console.log('Successfully updated Astro template for N/D values!');
} else {
    console.log('Could not find HTML block in Astro file.');
}
