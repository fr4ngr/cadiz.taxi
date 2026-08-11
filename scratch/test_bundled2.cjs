const { onRequestPost } = require('./chat.cjs');
const context = {
  request: {
    json: async () => ({ message: 'como voy de cadiz al aeropuerto de jerez?' }),
    url: 'http://localhost/'
  },
  env: {
    ASSETS: {
      fetch: async () => ({
        ok: true,
        json: async () => require('../public/data/renfe_cadiz.json')
      })
    },
    AI: { run: async () => ({ response: 'fake' }) },
    DB: { prepare: () => ({ bind: () => ({ first: async () => null, all: async () => ({results:[]}), run: async () => {} }) }) },
    GEMINI_API_KEY: 'foo'
  },
  waitUntil: () => {}
};
onRequestPost(context).then(async (r) => {
  const d = await r.json();
  console.log(JSON.stringify(d, null, 2));
}).catch(e => console.error('CRASH:', e.stack));
