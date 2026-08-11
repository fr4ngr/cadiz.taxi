const { onRequestPost } = require('./chat.cjs');
const context = {
  request: {
    json: async () => ({ messages: [{role: 'user', content: 'como voy de cadiz al aeropuerto de jerez?'}] }),
    url: 'http://localhost/'
  },
  env: { GEMINI_API_KEY: "foo", 
    ASSETS: {
      fetch: async () => ({
        ok: true,
        json: async () => require('../public/data/renfe_cadiz.json')
      })
    },
    AI: { run: async () => ({ response: 'fake' }) },
    DB: { prepare: () => ({ bind: () => ({ first: async () => null, all: async () => ({results:[]}), run: async () => {} }) }) }
  },
  waitUntil: () => {}
};
onRequestPost(context).then(async (r) => {
  if (r && r.text) {
    const t = await r.text();
    console.log(r.status, t);
  } else console.log(r);
}).catch(e => console.error(e));
