const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const oldLoop = `data.forEach(item => {
                        const marker = filterObj.renderMarker(item, map);
                        
                        marker.on('click', () => {`;

const newLoop = `data.forEach(item => {
                        const marker = filterObj.renderMarker(item, map);
                        if (!marker) return;
                        
                        marker.on('click', () => {`;

code = code.replace(oldLoop, newLoop);

// The user also requested to change the label of the layer.
// Right now it's probably "ENERGÍA SOLAR". Let's change it to "RENOVABLES" in the layer definition.
code = code.replace(
    "'renovables': {", 
    "'renovables': {"
); // wait, it might still be called 'solar' or something in the config.

// Let's just fix the crash first.
fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed marker null crash.');
