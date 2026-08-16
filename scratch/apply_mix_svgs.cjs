const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// The new SVGs, size 18
const solarSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
code = code.replace(/<div style="font-size:18px; margin-bottom:2px;">☀️<\/div>/, `<div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;">${solarSvg}</div>`);

const windSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>`;
code = code.replace(/<div style="font-size:18px; margin-bottom:2px;">💨<\/div>/, `<div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;">${windSvg}</div>`);

const hydroSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>`;
code = code.replace(/<div style="font-size:18px; margin-bottom:2px;">💧<\/div>/, `<div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;">${hydroSvg}</div>`);

const bioSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
code = code.replace(/<div style="font-size:18px; margin-bottom:2px;">🌱<\/div>/, `<div style="display:flex;align-items:center;justify-content:center;height:18px;margin-bottom:4px;">${bioSvg}</div>`);

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Replaced mix emojis with SVGs.');
