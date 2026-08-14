const fs = require('fs');

let apiCode = fs.readFileSync('functions/api/air-quality.js', 'utf8');

const search = `                        if (param && readings[param] !== undefined) {
                            readings[param] = measurement.value;
                        }`;

const replace = `                        if (param && readings[param] !== undefined) {
                            // Ignore negative values (sensor error codes like -1 or -999)
                            if (measurement.value >= 0) {
                                readings[param] = measurement.value;
                            }
                        }`;

const idx = apiCode.indexOf(search);
if (idx !== -1) {
    apiCode = apiCode.substring(0, idx) + replace + apiCode.substring(idx + search.length);
    fs.writeFileSync('functions/api/air-quality.js', apiCode, 'utf8');
    console.log('Fixed negative values in air-quality.js');
} else {
    console.log('Could not find measurement logic in air-quality.js');
}
