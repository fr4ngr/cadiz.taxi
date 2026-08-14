const fs = require('fs');

let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const search = 'Junta de Andalucía (Red de Vigilancia y Control de la Calidad del Aire).';
const replace = `Junta de Andalucía (Red de Vigilancia y Control de la Calidad del Aire).
                                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--header-border); display: flex; align-items: center; gap: 10px;">
                                            <img src="https://ui-avatars.com/api/?name=Adolfina+Martinez&background=ef4444&color=fff&rounded=true&size=64" width="28" height="28" style="border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="Adolfina Martínez Guirado" />
                                            <div style="display: flex; flex-direction: column;">
                                                <span style="font-size: 9px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Responsable Institucional</span>
                                                <span style="font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.2;">Adolfina Martínez Guirado</span>
                                                <span style="font-size: 10px; color: var(--text-secondary);">Consejera de Sostenibilidad (Junta de Andalucía)</span>
                                            </div>
                                        </div>`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully injected the Minister profile into the banner.');
} else {
    console.log('Target string not found.');
}
