const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const regex = /const html = `[\s\S]*?<\/div>\s*`;/m;

const newHtml = `const html = \`
                        <div style="font-family:system-ui,sans-serif;">
                            
                            \${(city.mwSolMacro > 0) ? \`
                            <!-- Huertos Solares -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">☀️</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Grandes Huertos Solares</div>
                                    <div style="font-size:20px;font-weight:800;color:#f59e0b;">\${city.mwSolMacro} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
                                </div>
                            </div>\` : ''}
                            
                            \${(city.mwEol > 0) ? \`
                            <!-- Granjas Eólicas -->
                            <div style="display:flex;align-items:center;gap:12px;background:var(--chat-bg);padding:12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:12px;">
                                <div style="font-size:28px;">💨</div>
                                <div>
                                    <div style="font-size:11px;color:var(--text-secondary);text-transform:uppercase;font-weight:600;">Parques Eólicos</div>
                                    <div style="font-size:20px;font-weight:800;color:#3b82f6;">\${city.mwEol} <span style="font-size:12px;color:var(--text-primary);">MW</span></div>
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
                            
                            <div id="ree-popup-data"></div>
                            
                        </div>
                    \`;`;

code = code.replace(regex, newHtml);
fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed broken HTML block!');
