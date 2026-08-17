const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Remove aviones filters UI
code = code.replace(/<div id="aviones-filters"[\s\S]*?<\/div>\n*\s*<\/div>/, '');

// Remove the radial-pill-item buttons for aviones and autocaravanas
code = code.replace(/\s*<button class="radial-pill-item" onclick="window\.selectMapLayer\('aviones'\)">[\s\S]*?<\/button>/, '');
code = code.replace(/\s*<button class="radial-pill-item" onclick="window\.selectMapLayer\('autocaravanas'\)">[\s\S]*?<\/button>/, '');

// Remove aviones from MapFilterRegistry
code = code.replace(/\s*'aviones': \{[\s\S]*?\/\/ ---------------------------------------------------------/, '\n            // ---------------------------------------------------------');

// Remove autocaravanas from MapFilterRegistry
code = code.replace(/\s*'autocaravanas': \{[\s\S]*?\/\/ ---------------------------------------------------------/, '\n            // ---------------------------------------------------------');

// Remove logic for aviones in selectMapLayer
code = code.replace(/\s*const avionesFilters = document\.getElementById\('aviones-filters'\);[\s\S]*?avionesFilters\.style\.display = 'none';\s*\}/, '');

// Remove window.filterAviones function
code = code.replace(/\s*window\.filterAviones = function[\s\S]*?\};\n/, '\n');

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Removed aviones and autocaravanas successfully.');
