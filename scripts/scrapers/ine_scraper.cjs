const axios = require('axios');

async function getIneMarketData() {
    try {
        console.log("[INE Scraper] Obteniendo Variación Anual de Precios (Andalucía)...");
        // Serie IPV1625: Andalucía. General. Variación anual.
        const resIpv = await axios.get('https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/IPV1625?nult=1');
        const ipvData = resIpv.data.Data[0];
        const tendenciaValor = ipvData.Valor;
        
        // Mapeo Trimestres INE: 19->Q1, 20->Q2, 21->Q3, 22->Q4
        const mapQ = { 19: "Q1", 20: "Q2", 21: "Q3", 22: "Q4" };
        const trimestre = mapQ[ipvData.FK_Periodo] || "Q?";
        const tendenciaPeriodo = `${trimestre} ${ipvData.Anyo}`;

        console.log("[INE Scraper] Obteniendo Compraventas de Fincas Urbanas (Cádiz)...");
        // Serie ETDP2833: Cádiz. Compraventa. Total fincas urbanas. Número (Serie Anual)
        const resVentas = await axios.get('https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/ETDP2833?nult=1');
        const ventasData = resVentas.data.Data[0];
        const ventasValor = ventasData.Valor;
        const ventasPeriodo = `Año ${ventasData.Anyo}`;

        const result = {
            tendencia_precio_andalucia: tendenciaValor,
            tendencia_periodo: tendenciaPeriodo,
            ventas_cadiz: ventasValor,
            ventas_periodo: ventasPeriodo
        };

        console.log("[INE Scraper] Datos obtenidos:", result);
        return result;

    } catch (e) {
        console.error("[INE Scraper] Error:", e.message);
        return null;
    }
}

module.exports = { getIneMarketData };
