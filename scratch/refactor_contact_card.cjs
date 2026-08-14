const fs = require('fs');

let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// 1. Simplify the top banner
const searchBanner = `                                ${Math.floor((Date.now() - station.timestamp) / 60000) > 1440 ? \`<div style="background: var(--chat-bg); border-left: 4px solid #ef4444; padding: 10px; border-radius: 4px; display: flex; gap: 8px; align-items: flex-start; border-top: 1px solid var(--header-border); border-right: 1px solid var(--header-border); border-bottom: 1px solid var(--header-border);">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                                        <strong style="color: var(--text-primary);">Estación inactiva:</strong> No recibimos datos desde hace \${Math.floor(Math.floor((Date.now() - station.timestamp) / 60000)/1440)} días. El mantenimiento corresponde a la Junta de Andalucía (Red de Vigilancia y Control de la Calidad del Aire).
                                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--header-border); display: flex; align-items: center; gap: 10px;">
                                            <img src="https://ui-avatars.com/api/?name=Adolfina+Martinez&background=ef4444&color=fff&rounded=true&size=64" width="28" height="28" style="border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="Adolfina Martínez Guirado" />
                                            <div style="display: flex; flex-direction: column;">
                                                <span style="font-size: 9px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Responsable Institucional</span>
                                                <a href="https://juntadeandalucia.es/organismos/sostenibilidadymedioambiente.html" target="_blank" style="font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.2; text-decoration: underline; text-decoration-color: #ef4444;">Adolfina Martínez Guirado</a>
                                                <span style="font-size: 10px; color: var(--text-secondary);">Consejera de Sostenibilidad (Junta de Andalucía)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>\` : ''}`;

const replaceBanner = `                                \${Math.floor((Date.now() - station.timestamp) / 60000) > 1440 ? \`<div style="background: var(--chat-bg); border-left: 4px solid #ef4444; padding: 10px; border-radius: 4px; display: flex; gap: 8px; align-items: flex-start; border-top: 1px solid var(--header-border); border-right: 1px solid var(--header-border); border-bottom: 1px solid var(--header-border);">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                                        <strong style="color: var(--text-primary);">Estación inactiva:</strong> No recibimos datos desde hace \${Math.floor(Math.floor((Date.now() - station.timestamp) / 60000)/1440)} días. Hay un problema de mantenimiento.
                                    </div>
                                </div>\` : ''}`;

// 2. Add the contact card at the bottom
const searchFooter = `                                <div style="margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        <span>Fuente: AEMA (Agencia Europea de Medio Ambiente) y OpenAQ</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Actualizado \${timeStr}</span>
                                    </div>
                                </div>`;

const replaceFooter = `                                <div style="margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        <span>Fuente: AEMA (Agencia Europea de Medio Ambiente) y OpenAQ</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Actualizado \${timeStr}</span>
                                    </div>
                                </div>

                                \${Math.floor((Date.now() - station.timestamp) / 60000) > 1440 ? \`
                                <div style="margin-top: 8px; background: var(--chat-bg); border: 1px solid var(--header-border); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 12px;">
                                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: -4px;">Responsables de Mantenimiento</div>
                                    
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <img src="https://ui-avatars.com/api/?name=Adolfina+Martinez&background=ef4444&color=fff&rounded=true&size=64" width="28" height="28" style="border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="Adolfina Martínez Guirado" />
                                        <div style="display: flex; flex-direction: column;">
                                            <a href="https://juntadeandalucia.es/organismos/sostenibilidadymedioambiente.html" target="_blank" style="font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.2; text-decoration: underline; text-decoration-color: #ef4444;">Adolfina Martínez Guirado</a>
                                            <span style="font-size: 10px; color: var(--text-secondary);">Consejera de Sostenibilidad</span>
                                        </div>
                                    </div>

                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <img src="https://ui-avatars.com/api/?name=Javier+Marcial&background=3b82f6&color=fff&rounded=true&size=64" width="28" height="28" style="border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="Javier Marcial de Torre Mandri" />
                                        <div style="display: flex; flex-direction: column;">
                                            <a href="https://www.juntadeandalucia.es/medioambiente/portal/web/amaya" target="_blank" style="font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.2; text-decoration: underline; text-decoration-color: #3b82f6;">Javier M. de Torre Mandri</a>
                                            <span style="font-size: 10px; color: var(--text-secondary);">Director Gerente de AMAYA, M.P.</span>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 4px; padding-top: 10px; border-top: 1px dashed var(--header-border); display: flex; flex-direction: column; gap: 4px;">
                                        <div style="font-size: 10px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">Reportar problema:</div>
                                        <a href="tel:955260000" style="font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; text-decoration: none;">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            955 26 00 00
                                        </a>
                                        <a href="mailto:directorgerente.amaya@juntadeandalucia.es" style="font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; text-decoration: none; overflow-wrap: anywhere;">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                            directorgerente.amaya@juntadeandalucia.es
                                        </a>
                                    </div>
                                </div>
                                \` : ''}`;

let modified = false;

let idx1 = code.indexOf(searchBanner);
if (idx1 !== -1) {
    code = code.substring(0, idx1) + replaceBanner + code.substring(idx1 + searchBanner.length);
    modified = true;
} else {
    console.error('Could not find searchBanner');
}

let idx2 = code.indexOf(searchFooter);
if (idx2 !== -1) {
    code = code.substring(0, idx2) + replaceFooter + code.substring(idx2 + searchFooter.length);
    modified = true;
} else {
    console.error('Could not find searchFooter');
}

if (modified) {
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully restructured contact info into a bottom card.');
}
