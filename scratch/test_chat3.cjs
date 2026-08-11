const fs = require('fs');
let chat = fs.readFileSync('functions/api/chat.ts', 'utf8');
chat = chat.replace('export const onRequestPost: PagesFunction<Env> = async (context) => {', 'async function run(context) {');
chat = chat.replace(/    \} catch \(err\) \{/g, '    } catch (err) { console.error(err.stack);');
chat = chat.replace(/^import .*$/gm, ''); // strictly remove imports
chat += `
  const context = {
    request: {
      json: async () => ({ messages: [{role: 'user', content: 'hola'}] }),
      url: 'http://localhost/'
    },
    env: {
      ASSETS: {
        fetch: async () => ({
          ok: true,
          json: async () => require('./public/data/renfe_cadiz.json')
        })
      },
      AI: { run: async () => ({ response: 'fake' }) },
      DB: { prepare: () => ({ bind: () => ({ first: async () => null, all: async () => ({results:[]}), run: async () => {} }) }) }
    },
    waitUntil: () => {}
  };
  run(context).then(async (r) => {
     if (r && r.text) {
       const t = await r.text();
       console.log(r.status, t);
     } else console.log(r);
  }).catch(e => console.error(e));
`;
fs.writeFileSync('scratch/debug3.cjs', chat);
require('./debug3.cjs');
