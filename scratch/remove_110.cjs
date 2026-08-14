const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// The exact string to replace
const searchStr = '<span style="font-size: 12px; font-weight: 700; color: var(--text-primary);">${station.aqi} / 110</span>';
const replaceStr = '<span style="font-size: 12px; font-weight: 700; color: var(--text-primary);">${station.aqi}</span>';

if (code.includes(searchStr)) {
    code = code.replace(searchStr, replaceStr);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully removed / 110');
} else {
    console.log('Could not find the target string');
}
