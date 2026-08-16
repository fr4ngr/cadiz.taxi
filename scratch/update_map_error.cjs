const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const oldRenderCall = '                                        ${renderMix(\'MIX ENERGÉTICO ANDALUCÍA\', data.and, true)}';

const errorState = `
                                        \${data.and && data.and.error ? 
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
                                        </div>\` :
                                        renderMix('MIX ENERGÉTICO ANDALUCÍA', data.and, false)}
`;

code = code.replace(oldRenderCall, errorState);

// also remove `isMock` from renderMix signature in the definition
code = code.replace('const renderMix = (title, d, isMock) => `', 'const renderMix = (title, d, isMock) => `');

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('MapWidget updated.');
