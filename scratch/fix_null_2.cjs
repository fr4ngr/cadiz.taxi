const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const regex = /data\.forEach\(item => \{\s*const marker = filterObj\.renderMarker\(item, map\);\s*marker\.on\('click', \(\) => \{/g;
const newCode = `data.forEach(item => {
                        const marker = filterObj.renderMarker(item, map);
                        if (!marker) return;
                        marker.on('click', () => {`;

code = code.replace(regex, newCode);

// I should also check `if (marker)` before adding to the cluster group or map.
const regex2 = /if \(filterObj\._clusterGroup\) \{\s*filterObj\._clusterGroup\.addLayer\(marker\);\s*\} else \{\s*marker\.addTo\(window\.currentMap\);\s*\}/g;
const newCode2 = `if (marker) {
                            if (filterObj._clusterGroup) {
                                filterObj._clusterGroup.addLayer(marker);
                            } else {
                                marker.addTo(window.currentMap);
                            }
                        }`;
code = code.replace(regex2, newCode2);

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Fixed marker null crash properly.');
