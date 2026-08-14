const fs = require('fs');

let apiCode = fs.readFileSync('functions/api/air-quality.js', 'utf8');

const search = `                    finalData.push({
                        name: loc.name,
                        city: loc.locality,
                        lat: loc.coordinates.latitude,
                        lon: loc.coordinates.longitude,
                        pm10: pm10.toFixed(1),
                        pm25: pm25.toFixed(1),
                        no2: no2.toFixed(1),
                        o3: o3.toFixed(1),
                        aqi: aqi,
                        status: status,
                        color: color,
                        timestamp: stationTimestamp
                    });`;

const replace = `                    finalData.push({
                        name: loc.name,
                        city: loc.locality,
                        lat: loc.coordinates.latitude,
                        lon: loc.coordinates.longitude,
                        pm10: readings.pm10 !== null ? readings.pm10.toFixed(1) : null,
                        pm25: readings.pm25 !== null ? readings.pm25.toFixed(1) : null,
                        no2: readings.no2 !== null ? readings.no2.toFixed(1) : null,
                        o3: readings.o3 !== null ? readings.o3.toFixed(1) : null,
                        aqi: aqi,
                        status: status,
                        color: color,
                        timestamp: stationTimestamp
                    });`;

const idx = apiCode.indexOf(search);
if (idx !== -1) {
    apiCode = apiCode.substring(0, idx) + replace + apiCode.substring(idx + search.length);
    fs.writeFileSync('functions/api/air-quality.js', apiCode, 'utf8');
    console.log('Fixed air-quality.js finalData nulls');
} else {
    console.log('Could not find finalData push in air-quality.js');
}
