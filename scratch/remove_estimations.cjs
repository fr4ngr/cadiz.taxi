const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const regex = /<!-- Autoconsumo -->[\s\S]*?<!-- Huertos Solares -->/m;

const newHtml = `<!-- Huertos Solares -->`;

if (regex.test(code)) {
    code = code.replace(regex, newHtml);
} else {
    console.log('Could not find Autoconsumo section');
}

// Remove the estimation line for solar plates
code = code.replace(/<div style="font-size:10px;color:var\(--text-secondary\);">~ \$\{Math\.round\(city\.mwSolMacro \* 2500\)\.toLocaleString\('es-ES'\)\} placas aprox\.<\/div>/g, '');

// Remove the estimation line for wind turbines
code = code.replace(/<div style="font-size:10px;color:var\(--text-secondary\);">~ \$\{Math\.round\(city\.mwEol \/ 2\.5\)\.toLocaleString\('es-ES'\)\} aerogeneradores aprox\.<\/div>/g, '');

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Removed Autoconsumo and estimations.');
