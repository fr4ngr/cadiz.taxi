const fs = require('fs');
let chat = fs.readFileSync('functions/api/chat.ts', 'utf8');
chat = chat.replace('export const onRequestPost: PagesFunction<Env> = async (context) => {', 'async function run(context) {');
chat = chat.replace(/    \} catch \(err\) \{/g, '    } catch (err) { console.error(err.stack);');
chat = chat.replace(/import .*\n/g, ''); // remove imports
chat += `
  const context = {
    request: {
      json: async () => ({ messages: [{role: 'user', content: 'como voy de cadiz al aeropuerto de jerez?'}] }),
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
     const t = await r.text();
     console.log(r.status, t);
  }).catch(e => console.error(e));
`;
fs.writeFileSync('scratch/debug2.cjs', chat);
require('./debug2.cjs');
