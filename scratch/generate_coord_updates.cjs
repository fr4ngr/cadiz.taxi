const fs = require('fs');

const towns = JSON.parse(fs.readFileSync('scratch/cadiz_municipalities_center.json', 'utf8'));
const centres = JSON.parse(fs.readFileSync('scratch/cadiz_admin_centres.json', 'utf8'));

let sql = '';

towns.forEach(t => {
   let c = centres.find(e => e.tags.name === t.name);
   if (!c && t.name === 'Castellar de la Frontera') {
       c = centres.find(e => e.tags.name === 'Castellar Nuevo de la Frontera');
   }
   
   if (c) {
       sql += `UPDATE autoconsumo_municipal SET lat = ${c.lat}, lon = ${c.lon} WHERE municipio_name = '${t.name.replace(/'/g, "''")}';\n`;
   }
});

fs.writeFileSync('scratch/update_coords.sql', sql);
console.log('Created scratch/update_coords.sql');
