const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Replace the title
const searchTitle = `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px; margin-top: 4px;">Agentes Contaminantes (Tiempo Real)</div>`;
const replaceTitle = `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px; margin-top: 4px;">Principales Contaminantes</div>`;
code = code.replace(searchTitle, replaceTitle);

// Replace the updated time text with a clock icon
const searchTime = `<div style="font-style: italic; font-size: 10px; margin-left: 20px;">Actualizado \\\${timeStr}</div>`;
const replaceTime = `<div style="font-style: italic; font-size: 10px; margin-left: 20px; display: flex; align-items: center; gap: 4px;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        Actualizado \\\${timeStr}
                                    </div>`;
code = code.replace(searchTime, replaceTime);

fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
console.log('Successfully updated the pollutant title and added the clock icon.');
