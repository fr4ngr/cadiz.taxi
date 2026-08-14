const fs = require('fs');
let code = fs.readFileSync('functions/api/air-quality.js', 'utf8');

const search = `                    // Extract values
                    const readings = { pm10: 0, pm25: 0, no2: 0, o3: 0, so2: 0, co: 0 };
                    latestData.results.forEach(measurement => {
                        const param = sensorMap[measurement.sensorsId];
                        if (param && readings[param] !== undefined) {
                            readings[param] = measurement.value;
                        }
                    });`;

const replace = `                    // Extract values
                    const readings = { pm10: 0, pm25: 0, no2: 0, o3: 0, so2: 0, co: 0 };
                    let stationTimestamp = 0;
                    latestData.results.forEach(measurement => {
                        const param = sensorMap[measurement.sensorsId];
                        if (param && readings[param] !== undefined) {
                            readings[param] = measurement.value;
                        }
                        try {
                            if (measurement.period && measurement.period.datetimeTo && measurement.period.datetimeTo.utc) {
                                const ts = new Date(measurement.period.datetimeTo.utc).getTime();
                                if (ts > stationTimestamp) stationTimestamp = ts;
                            } else if (measurement.datetime && measurement.datetime.utc) {
                                const ts = new Date(measurement.datetime.utc).getTime();
                                if (ts > stationTimestamp) stationTimestamp = ts;
                            } else if (measurement.datetime) {
                                const ts = new Date(measurement.datetime).getTime();
                                if (ts > stationTimestamp) stationTimestamp = ts;
                            }
                        } catch (e) {}
                    });
                    if (stationTimestamp === 0) stationTimestamp = Date.now();`;

code = code.replace(search, replace);

const searchPush = `                        status: status,
                        color: color
                    });`;
const replacePush = `                        status: status,
                        color: color,
                        timestamp: stationTimestamp
                    });`;

code = code.replace(searchPush, replacePush);

fs.writeFileSync('functions/api/air-quality.js', code, 'utf8');
console.log('Modified air-quality.js');
