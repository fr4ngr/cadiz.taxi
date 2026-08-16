const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const btn = `                <button class="radial-pill-item" onclick="window.selectMapLayer('renovables')">
                    <span style="font-size: 16px; margin-right: 4px;">🌱</span>
                    Renovables
                </button>
`;

if (!code.includes("window.selectMapLayer('renovables')")) {
    code = code.replace("                <button class=\"radial-pill-item\" onclick=\"window.selectMapLayer('aviones')\">", btn + "                <button class=\"radial-pill-item\" onclick=\"window.selectMapLayer('aviones')\">");
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
    console.log("Injected button");
} else {
    console.log("Already has button");
}
