const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const oldFooter = `                            <div style="margin-top:16px; margin-bottom:8px; font-size:9px; color:var(--text-secondary); text-align:center; border-top: 1px solid var(--border-color); padding-top: 8px;">
                                Fuente: Agencia Andaluza de la Energía. Actualizado: 2024
                            </div>`;

const newFooter = `                            <div style="display:flex; flex-direction:column; gap:6px; font-size:11px; color:var(--text-secondary); margin-top:16px; padding-top:12px; border-top:1px solid var(--border-color);">
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> 
                                    <span><strong>Fuente:</strong> Agencia Andaluza de Energía y ESIOS</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
                                    <span><strong>Actualizado:</strong> Potencias (2024), Mix (Tiempo real)</span>
                                </div>
                            </div>`;

code = code.replace(oldFooter, newFooter);

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed footer format.');
