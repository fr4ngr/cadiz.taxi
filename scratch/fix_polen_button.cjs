const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const search = `        <button class="filter-pill" onclick="window.selectMapLayer('aire')" style="border-color: #10b981; color: #10b981;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>
            Calidad Aire
        </button>`;

const replacement = `        <button class="filter-pill" onclick="window.selectMapLayer('aire')" style="border-color: #10b981; color: #10b981;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>
            Calidad Aire
        </button>
        <button class="filter-pill" onclick="window.selectMapLayer('polen')" style="border-color: #8b5cf6; color: #8b5cf6;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            Polen / Alergias
        </button>`;

const idx = code.indexOf(search);
if (idx !== -1) {
    code = code.substring(0, idx) + replacement + code.substring(idx + search.length);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Button appended successfully!');
} else {
    console.log('Could not find the Calidad Aire button in the file.');
}
