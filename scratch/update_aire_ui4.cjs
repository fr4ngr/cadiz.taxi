const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const startStr = "<div style=\"display: flex; align-items: baseline; justify-content: space-between;\">";
const endStr = "<div style=\"display: flex; flex-direction: column; gap: 6px; margin-top: 10px;\">";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `<div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                            <span style="font-size: 32px; font-weight: 800; color: \${station.color}; letter-spacing: -1px; line-height: 1;">\${station.aqi}</span>
                                            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                                                <span style="font-size: 18px; font-weight: 700; color: var(--text-primary); line-height: 1;">\${station.status}</span>
                                                <span style="font-size: 11px; color: var(--text-secondary); font-weight: 500;">EAQI (\${eaqiRange})</span>
                                            </div>
                                        </div>
                                        
                                        `;
    code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully replaced HTML structure for Aire popup!');
} else {
    console.log('Could not find start or end bounds.', {startIdx, endIdx});
}
