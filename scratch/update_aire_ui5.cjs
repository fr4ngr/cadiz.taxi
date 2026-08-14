const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// First replace the timeStr logic
const timeSearch = `                        const diffMins = Math.floor((Date.now() - station.timestamp) / 60000);
                        if (diffMins < 1) timeStr = 'ahora mismo';
                        else if (diffMins < 60) timeStr = \\\`hace \\\${diffMins} min\\\`;
                        else if (diffMins < 1440) timeStr = \\\`hace \\\${Math.floor(diffMins/60)} h\\\`;
                        else timeStr = \\\`hace \\\${Math.floor(diffMins/1440)} d\\\`;`;

const timeReplace = `                        const diffMins = Math.floor((Date.now() - station.timestamp) / 60000);
                        if (diffMins < 1) {
                            timeStr = 'ahora mismo';
                        } else if (diffMins < 60) {
                            timeStr = \\\`hace \\\${diffMins} minuto\\\${diffMins !== 1 ? 's' : ''}\\\`;
                        } else if (diffMins < 1440) {
                            const hrs = Math.floor(diffMins/60);
                            timeStr = \\\`hace \\\${hrs} hora\\\${hrs !== 1 ? 's' : ''}\\\`;
                        } else {
                            const days = Math.floor(diffMins/1440);
                            timeStr = \\\`hace \\\${days} día\\\${days !== 1 ? 's' : ''}\\\`;
                        }`;

code = code.replace(timeSearch, timeReplace);

// Next replace the footer HTML
const htmlSearch = `<div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; justify-content: space-between;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        Fuente: AEMA / OpenAQ
                                    </div>
                                    <div style="font-style: italic; font-size: 10px;">Actualizado \\\${timeStr}</div>
                                </div>`;

const htmlReplace = `<div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        Fuente: AEMA (Agencia Europea de Medio Ambiente) y OpenAQ
                                    </div>
                                    <div style="font-style: italic; font-size: 10px; margin-left: 20px;">Actualizado \\\${timeStr}</div>
                                </div>`;

code = code.replace(htmlSearch, htmlReplace);

fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
console.log('Successfully replaced footer and time logic for Aire popup!');
