fetch('https://api.ctan.es/v1/Consorcios/2/paradas')
  .then(r => r.json())
  .then(data => {
    const mainStops = [
      { name: 'Cádiz', search: 'estación de autobuses cádiz' },
      { name: 'San Fernando', search: 'estación fc-bahía sur' },
      { name: 'Jerez', search: 'estación de autobuses jerez' },
      { name: 'El Puerto de Santa María', search: 'estación fc el pto. de sta. maría' },
      { name: 'Puerto Real', search: 'estación fc puerto real' },
      { name: 'Chiclana', search: 'intercambiador río iro' },
      { name: 'Rota', search: 'estación de autobuses rota' },
      { name: 'Conil', search: 'apeadero de autobuses conil' },
      { name: 'Medina', search: 'estación de autobuses medina' },
    ];
    mainStops.forEach(t => {
      const stop = data.paradas.find(p => p.nombre.toLowerCase() === t.search.toLowerCase());
      if (stop) {
        console.log(`{ idParada: ${stop.idParada}, name: '${t.name}', keywords: ['${t.name.toLowerCase()}'] }, // ${stop.nombre}`);
      } else {
        console.log(`NOT FOUND: ${t.name}`);
      }
    });
  });
