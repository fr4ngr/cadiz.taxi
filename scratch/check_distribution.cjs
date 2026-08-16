const fs = require('fs');

async function check() {
    const output = require('child_process').execSync('node scratch/test_miea.cjs', { encoding: 'utf8' }).toString();
    console.log(output);
}
check().catch(console.error);
