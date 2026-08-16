const fs = require('fs');

let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Change button text
code = code.replace(
    '<span style="font-size: 16px; margin-right: 4px;">☀️</span>\n                    Energía Solar',
    '<span style="font-size: 16px; margin-right: 4px;">🌱</span>\n                    Renovables'
);

// Change label
code = code.replace(
    "label: 'Energía Solar',",
    "label: 'Renovables',"
);

// The current HTML generation inside onMarkerClick
const oldHtmlRegex = /const html = `\s*<div style="font-family:system-ui,sans-serif;">[\s\S]*?<!-- Educational Blurb -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*`;/m;

// Check if we can find it
if (!oldHtmlRegex.test(code)) {
    console.log('Regex did not match!');
    process.exit(1);
}

// Generate the new HTML logic
const newHtml = `const html = \`
                        <div style="font-family:system-ui,sans-serif;">
                            
                            <!-- Autoconsumo -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">🏠☀️</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Autoconsumo Solar Local</div>
                                    <div style="font-size:22px;font-weight:800;color:#f59e0b;">\${city.mw} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                    <div style="font-size:10px;color:var(--text-secondary);">\${(city.installations || 0).toLocaleString('es-ES')} tejados solares</div>
                                </div>
                            </div>
                            
                            <!-- Proportions: Tipo de Consumo (Only if there is autoconsumo) -->
                            \${city.mw > 0 ? \`
                            <div style="margin-bottom:12px;">
                                <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:600;margin-bottom:4px;text-transform:uppercase;">
                                    <span style="color:#3b82f6;">🏠 Residencial (\${city.pctResidential}%)</span>
                                    <span style="color:#8b5cf6;">🏭 Industrial (\${city.pctIndustrial}%)</span>
                                </div>
                                <div style="height:8px;border-radius:4px;display:flex;overflow:hidden;background:var(--border-color);">
                                    <div style="width:\${city.pctResidential}%;background:#3b82f6;"></div>
                                    <div style="width:\${city.pctIndustrial}%;background:#8b5cf6;"></div>
                                </div>
                            </div>
                            <div style="margin-bottom:12px;">
                                <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:600;margin-bottom:4px;text-transform:uppercase;">
                                    <span style="color:#10b981;">⚡ Venden a la red (\${city.pctExcedentes}%)</span>
                                    <span style="color:var(--text-secondary);">Sin vertido (\${city.pctSinExcedentes}%)</span>
                                </div>
                                <div style="height:8px;border-radius:4px;display:flex;overflow:hidden;background:var(--border-color);">
                                    <div style="width:\${city.pctExcedentes}%;background:#10b981;"></div>
                                    <div style="width:\${city.pctSinExcedentes}%;background:var(--text-secondary);opacity:0.5;"></div>
                                </div>
                            </div>
                            \` : ''}
                            
                            \${(city.mwSolMacro > 0) ? \`
                            <!-- Huertos Solares -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">☀️</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Grandes Huertos Solares</div>
                                    <div style="font-size:20px;font-weight:800;color:#f59e0b;">\${city.mwSolMacro} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                    <div style="font-size:10px;color:var(--text-secondary);">~ \${Math.round(city.mwSolMacro * 2500).toLocaleString('es-ES')} placas aprox.</div>
                                </div>
                            </div>\` : ''}
                            
                            \${(city.mwEol > 0) ? \`
                            <!-- Granjas Eólicas -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">💨</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Parques Eólicos</div>
                                    <div style="font-size:20px;font-weight:800;color:#3b82f6;">\${city.mwEol} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                    <div style="font-size:10px;color:var(--text-secondary);">~ \${Math.round(city.mwEol / 2.5).toLocaleString('es-ES')} aerogeneradores aprox.</div>
                                </div>
                            </div>\` : ''}
                            
                            \${(city.mwHid > 0) ? \`
                            <!-- Centrales Hidráulicas -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">💧</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Centrales Hidráulicas</div>
                                    <div style="font-size:20px;font-weight:800;color:#0ea5e9;">\${city.mwHid} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                </div>
                            </div>\` : ''}
                            
                            \${(city.mwBiomasa > 0) ? \`
                            <!-- Biomasa -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">🌱</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Centrales de Biomasa</div>
                                    <div style="font-size:20px;font-weight:800;color:#84cc16;">\${city.mwBiomasa} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                </div>
                            </div>\` : ''}
                            
                        </div>
                    \`;`;

code = code.replace(oldHtmlRegex, newHtml);
fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Successfully updated HTML structure.');
