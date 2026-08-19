async function scrapeMercadoVenta(municipioNombre) {
    // ELIMINADO EL MOCK DE IDEALISTA.
    // Retorna estrictamente null para no inventar datos.
    return null;
}

async function scrapeMercadoAlquiler(municipioNombre) {
    // ELIMINADO EL MOCK DE IDEALISTA.
    // Retorna estrictamente null.
    return null; 
}

module.exports = { scrapeNotarios: scrapeMercadoVenta, scrapeSerpavi: scrapeMercadoAlquiler };
