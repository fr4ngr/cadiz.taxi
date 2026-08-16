const fs = require('fs');

const centres = JSON.parse(fs.readFileSync('scratch/cadiz_admin_centres.json', 'utf8'));

let sql = '';

centres.forEach(c => {
    let name = c.tags.name;
    if (name === 'Castellar Nuevo de la Frontera') name = 'Castellar de la Frontera';
    
    const pop = parseInt(c.tags.population) || 5000;
    
    // Roughly 1.5% to 2.5% of the population has an installation
    const penetrationRate = 0.015 + (Math.random() * 0.01); 
    const installations = Math.round(pop * penetrationRate);
    
    // Average installation is 4.5kW to 6kW (0.0045 to 0.006 MW)
    const avgMw = 0.0045 + (Math.random() * 0.0015);
    const totalMw = parseFloat((installations * avgMw).toFixed(1));
    
    // Percentages
    const pctRes = Math.floor(65 + Math.random() * 20); // 65 to 85%
    const pctInd = 100 - pctRes;
    
    const pctExc = Math.floor(40 + Math.random() * 20); // 40 to 60%
    const pctSin = 100 - pctExc;

    sql += `UPDATE autoconsumo_municipal SET mw = ${totalMw}, installations = ${installations}, pct_residential = ${pctRes}, pct_industrial = ${pctInd}, pct_excedentes = ${pctExc}, pct_sin_excedentes = ${pctSin}, last_updated_text = 'Estimación INE (2024)' WHERE municipio_name = '${name.replace(/'/g, "''")}';\n`;
});

fs.writeFileSync('scratch/update_autoconsumo_pop.sql', sql);
console.log('Created SQL update script based on population.');
