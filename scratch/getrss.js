async function getRss() {
  const r = await fetch('https://www.europasur.es/');
  const html = await r.text();
  const matches = html.match(/href=.[^"']*rss[^"']*. /gi) || [];
  console.log("Europa Sur RSS:", matches);
  
  const r2 = await fetch('https://www.diariodecadiz.es/');
  const html2 = await r2.text();
  const matches2 = html2.match(/href=.[^"']*rss[^"']*. /gi) || [];
  console.log("Diario de Cadiz RSS:", matches2);
}
getRss();
