const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Replace /api/autoconsumo endpoint
code = code.replace(/fetch\('\/api\/autoconsumo\?t='\s*\+\s*Date\.now\(\)\)/g, "fetch('/api/renovables?t=' + Date.now())");

// Replace json.municipalities
code = code.replace(/return json\.municipalities \|\| \[\];/g, "return json || [];");

// Replace fields
code = code.replace(/city\.mwSolMacro/g, 'city.solar_mw');
code = code.replace(/city\.mwEol/g, 'city.eolica_mw');
code = code.replace(/city\.mwHid/g, 'city.hidro_mw');
code = code.replace(/city\.mwBiomasa/g, 'city.biomasa_mw');
code = code.replace(/city\.lon/g, 'city.lng');
code = code.replace(/city\.mw \* 300/g, 'city.total_mw * 300');

// Replace source in registry
code = code.replace(/source: 'Ministerio para la Transición Ecológica',/g, "source: 'Agencia Andaluza de la Energía',");

// Replace totalMw calculation just to be sure it uses proper fields
code = code.replace(/const totalMw = \(city.solar_mw \|\| 0\) \+ \(city.eolica_mw \|\| 0\) \+ \(city.hidro_mw \|\| 0\) \+ \(city.biomasa_mw \|\| 0\);/g, "const totalMw = city.total_mw || ((city.solar_mw || 0) + (city.eolica_mw || 0) + (city.hidro_mw || 0) + (city.biomasa_mw || 0));");

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('MapWidget data fields updated.');
