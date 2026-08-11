const fs = require('fs');
let txt = fs.readFileSync('scratch/test_bundled.cjs', 'utf8');
txt = txt.replace('env: {', 'env: { GEMINI_API_KEY: "foo", ');
fs.writeFileSync('scratch/test_bundled.cjs', txt);
require('./scratch/test_bundled.cjs');
