const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const regex = /<!-- Main highlight -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newHtml = `<!-- Autoconsumo -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:8px;">
                                <div style="font-size:28px;">🏠☀️</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Autoconsumo Local</div>
                                    <div style="font-size:22px;font-weight:800;color:#f59e0b;">\${city.mw} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                    <div style="font-size:10px;color:var(--text-secondary);">\${(city.installations || 0).toLocaleString('es-ES')} tejados solares</div>
                                </div>
                            </div>
                            
                            \${(city.mwEol > 0 || city.mwHid > 0 || city.mwSolMacro > 0 || city.mwBiomasa > 0) ? \`
                            <!-- Plantas de Generación -->
                            <div style="background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;margin-bottom:8px;">Plantas de Generación (MITECO/IECA)</div>
                                <div style="display:flex;flex-direction:column;gap:6px;">
                                    \${city.mwEol > 0 ? \`<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;">💨 Parques Eólicos</span> <strong style="color:#3b82f6;">\${city.mwEol} MW</strong></div>\` : ''}
                                    \${city.mwSolMacro > 0 ? \`<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;">☀️ Huertos Solares</span> <strong style="color:#f59e0b;">\${city.mwSolMacro} MW</strong></div>\` : ''}
                                    \${city.mwHid > 0 ? \`<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;">💧 Centrales Hidráulicas</span> <strong style="color:#0ea5e9;">\${city.mwHid} MW</strong></div>\` : ''}
                                    \${city.mwBiomasa > 0 ? \`<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;">🌱 Biomasa</span> <strong style="color:#84cc16;">\${city.mwBiomasa} MW</strong></div>\` : ''}
                                </div>
                            </div>\` : ''}`;

if (regex.test(code)) {
    code = code.replace(regex, newHtml);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
    console.log('Successfully replaced!');
} else {
    console.log('Regex not found!');
}
