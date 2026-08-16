const fs = require('fs');

async function fetchLayer(layer) {
    const url = `https://www.agenciaandaluzadelaenergia.es/mapwms/wfs?request=GetFeature&service=WFS&version=2.0.0&typeName=MIEA:${layer}&outputFormat=application/json`;
    console.log('Fetching', layer);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Status ' + res.status);
    const data = await res.json();
    return data.features;
}

async function run() {
    const layers = ['cEolicas', 'csolares', 'cHidroelectricas', 'cBiomasa'];
    let all = [];
    for (const layer of layers) {
        const features = await fetchLayer(layer);
        // Only keep those in Cádiz province roughly based on coordinates if we can, or we just keep all and filter by municipalities later.
        features.forEach(f => {
            f.properties._type = layer;
        });
        all.push(...features);
        console.log(layer, features.length);
    }
    fs.writeFileSync('scratch/wfs_renewables.json', JSON.stringify(all, null, 2));
    console.log('Total features:', all.length);
}
run().catch(console.error);
