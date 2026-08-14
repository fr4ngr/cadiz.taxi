const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const searchHtml = `<div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        Fuente: AEMA (Agencia Europea de Medio Ambiente) y OpenAQ
                                    </div>
                                    <div style="font-style: italic; font-size: 10px; margin-left: 20px; display: flex; align-items: center; gap: 4px;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        Actualizado \${timeStr}
                                    </div>`;

const replaceHtml = `<div style="margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        <span>Fuente: AEMA (Agencia Europea de Medio Ambiente) y OpenAQ</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-secondary);">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Actualizado \${timeStr}</span>
                                    </div>`;

const startIdx = code.indexOf(searchHtml);
if (startIdx !== -1) {
    code = code.substring(0, startIdx) + replaceHtml + code.substring(startIdx + searchHtml.length);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully aligned the footer icons and text!');
} else {
    console.log('Could not find HTML block. The template might have changed.');
}
