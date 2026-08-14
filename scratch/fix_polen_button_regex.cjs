const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const replacement = `        <button class="filter-pill" onclick="window.selectMapLayer('polen')" style="border-color: #8b5cf6; color: #8b5cf6;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            Polen / Alergias
        </button>
    </div>

    <!-- RADIAL MENUS CONTAINER -->`;

code = code.replace(/<\/div>\s*<!-- RADIAL MENUS CONTAINER -->/m, replacement);
fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
console.log('Button appended successfully via regex!');
