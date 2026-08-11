const fs = require('fs');

const busLogic = `
                    // BUS & CATAMARAN GTFS-like LOGIC
                    if (env.ASSETS && originTown && destTown && originTown.name !== destTown.name) {
                        try {
                            const busReq = new Request(new URL('/data/bus_cadiz.json', request.url));
                            const busRes = await env.ASSETS.fetch(busReq);
                            if (busRes.ok) {
                                const busData = await busRes.json();
                                const formatter = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false });
                                const nowStr = formatter.format(new Date());
                                const madridDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
                                const dayOfWeek = madridDate.getDay(); // 0 is Sunday
                                const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
                                
                                const originStr = originTown.name.toLowerCase();
                                const destStr = destTown.name.toLowerCase();
                                
                                for (const [id, ruta] of Object.entries(busData.rutas)) {
                                    const lineaInfo = busData.lineas[id];
                                    if (!lineaInfo) continue;
                                    
                                    const processDirection = (nucleos, bloques, horarios, isVuelta) => {
                                        const originIdx = nucleos.findIndex(n => n.toLowerCase().includes(originStr) || originStr.includes(n.toLowerCase()));
                                        const destIdx = nucleos.findIndex(n => n.toLowerCase().includes(destStr) || destStr.includes(n.toLowerCase()));
                                        
                                        if (originIdx !== -1 && destIdx !== -1 && originIdx < destIdx) {
                                            let validTrips = horarios.filter(h => {
                                                if (!h.frecuencia) return true;
                                                const f = h.frecuencia.toUpperCase();
                                                if (f.includes('S-D-F') && !isWeekend) return false;
                                                if (f.includes('L-V') && isWeekend) return false;
                                                return true;
                                            });
                                            
                                            if (validTrips.length > 0) {
                                                let schedules = [];
                                                for (const trip of validTrips) {
                                                    const validTimes = trip.horas.filter(t => t && t.trim() !== '' && t !== '-');
                                                    if (validTimes.length >= 2) {
                                                        const depTime = validTimes[0];
                                                        const arrTime = validTimes[validTimes.length - 1];
                                                        if (depTime && arrTime) {
                                                            schedules.push({
                                                                time: depTime,
                                                                isPast: depTime < nowStr,
                                                                lineCode: lineaInfo.codigo,
                                                                fullLineCode: lineaInfo.nombre,
                                                                durationText: '-',
                                                                stops: [
                                                                    { name: originTown.name, isOrigin: true, isDest: false },
                                                                    { name: destTown.name, isOrigin: false, isDest: true }
                                                                ]
                                                            });
                                                        }
                                                    }
                                                }
                                                
                                                if (schedules.length > 0) {
                                                    schedules.sort((a,b) => a.time.localeCompare(b.time));
                                                    // Map duration for the first one if possible
                                                    for (let s of schedules) {
                                                        try {
                                                            const tOrigin = s.time;
                                                            const tDest = validTrips.find(t=>t.horas.includes(tOrigin)).horas.slice(-1)[0] || tOrigin;
                                                            if (tOrigin !== tDest) {
                                                                const [oH, oM] = tOrigin.split(':').map(Number);
                                                                const [dH, dM] = tDest.split(':').map(Number);
                                                                let mins = (dH * 60 + dM) - (oH * 60 + oM);
                                                                if (mins < 0) mins += 24 * 60;
                                                                if (mins >= 60) {
                                                                    s.durationText = \`\${Math.floor(mins/60)} h \${mins%60} min\`;
                                                                } else {
                                                                    s.durationText = \`\${mins} min\`;
                                                                }
                                                            }
                                                        } catch(e) {}
                                                    }
                                                    
                                                    const upcoming = schedules.filter(s => !s.isPast);
                                                    const nextDeparture = upcoming.length > 0 ? upcoming[0].time : null;
                                                    const upcomingDepartures = upcoming.slice(1, 4).map(s => s.time);
                                                    
                                                    const isBoat = lineaInfo.codigo.startsWith('B-');
                                                    
                                                    transportRoutes.push({
                                                        mode: isBoat ? 'boat' : 'bus',
                                                        origin: originTown.name,
                                                        destination: destTown.name,
                                                        nextDeparture,
                                                        upcomingDepartures,
                                                        details: { 
                                                            lineCode: lineaInfo.codigo,
                                                            stops: [
                                                                { name: originTown.name, isOrigin: true, isDest: false },
                                                                { name: destTown.name, isOrigin: false, isDest: true }
                                                            ],
                                                            schedules
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    };
                                    
                                    processDirection(ruta.nucleosIda || [], ruta.bloquesIda || [], ruta.horarioIda || [], false);
                                    processDirection(ruta.nucleosVuelta || [], ruta.bloquesVuelta || [], ruta.horarioVuelta || [], true);
                                }
                            }
                        } catch(e) {
                            console.error("Error loading bus JSON", e);
                        }
                    }
`;

const file = 'functions/api/chat.ts';
let code = fs.readFileSync(file, 'utf8');
const startMatch = 'if (destinationsToSearch.length > 0) {';
const endMatch = 'if (transportRoutes.length > 0) {';

const idxStart = code.indexOf(startMatch);
if (idxStart !== -1) {
    const substr = code.substring(idxStart);
    const relativeEnd = substr.indexOf(endMatch);
    if (relativeEnd !== -1) {
        const idxEnd = idxStart + relativeEnd;
        code = code.substring(0, idxStart) + busLogic.trim() + "\\n\\n                    " + code.substring(idxEnd);
        fs.writeFileSync(file, code);
        console.log('Replaced successfully');
    }
}
