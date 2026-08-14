const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const search = "const res = await fetch('/api/air-quality');";
const replace = "const res = await fetch('/api/air-quality?v=2'); // Bust cache to force timestamp data";

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('src/components/widgets/MapWidget.astro', code, 'utf8');
    console.log('Successfully busted cache in MapWidget.astro');
} else {
    console.log('Could not find fetch call');
}
