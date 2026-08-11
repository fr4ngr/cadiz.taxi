const fs = require('fs');
let chat = fs.readFileSync('scratch/chat.cjs', 'utf8');
chat = chat.replace(/return new Response\(JSON\.stringify\(\{ error: errorMessage \}\)[\s\S]*?\);/g, 'throw error;');
fs.writeFileSync('scratch/chat.cjs', chat);
