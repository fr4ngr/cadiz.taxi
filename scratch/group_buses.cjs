const fs = require('fs');
const path = require('path');

const file = 'functions/api/chat.ts';
let code = fs.readFileSync(file, 'utf8');

const target1 = `                                                    const upcoming = schedules.filter(s => !s.isPast);
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
                                                    });`;

const replacement1 = `                                                    const isBoat = lineaInfo.codigo.startsWith('B-');
                                                    const isTram = lineaInfo.codigo.startsWith('T-');
                                                    const mode = isBoat ? 'boat' : (isTram ? 'train' : 'bus');
                                                    
                                                    if (!groupedRoutes[mode]) {
                                                        groupedRoutes[mode] = [];
                                                    }
                                                    groupedRoutes[mode].push(...schedules);`;

const target2 = `                                const originStr = originTown.name.toLowerCase();
                                const destStr = destTown.name.toLowerCase();
                                
                                for (const [id, ruta] of Object.entries(busData.rutas)) {`;

const replacement2 = `                                const originStr = originTown.name.toLowerCase();
                                const destStr = destTown.name.toLowerCase();
                                const groupedRoutes = {};
                                
                                for (const [id, ruta] of Object.entries(busData.rutas)) {`;

const target3 = `                                }
                            }
                        } catch(e) {
                            console.error("Error loading bus JSON", e);
                        }`;

const replacement3 = `                                }
                                
                                // Process grouped routes and push them
                                for (const [mode, allSchedules] of Object.entries(groupedRoutes)) {
                                    if (allSchedules.length > 0) {
                                        // Sort all schedules by time
                                        allSchedules.sort((a,b) => a.time.localeCompare(b.time));
                                        
                                        const upcoming = allSchedules.filter(s => !s.isPast);
                                        const nextDeparture = upcoming.length > 0 ? upcoming[0].time : null;
                                        const upcomingDepartures = upcoming.slice(1, 4).map(s => s.time);
                                        const firstValidSched = upcoming[0] || allSchedules[0];
                                        
                                        // Filter out schedules that have negative or weird durations (NaN)
                                        // Actually just sanitize them
                                        allSchedules.forEach(s => {
                                            if (s.durationText && s.durationText.includes('NaN')) {
                                                s.durationText = '-';
                                            }
                                        });

                                        transportRoutes.push({
                                            mode: mode,
                                            origin: originTown.name,
                                            destination: destTown.name,
                                            nextDeparture,
                                            upcomingDepartures,
                                            durationText: firstValidSched.durationText,
                                            details: {
                                                lineCode: mode === 'train' ? 'TRAM' : 'Múltiples',
                                                stops: [
                                                    { name: originTown.name, isOrigin: true, isDest: false },
                                                    { name: destTown.name, isOrigin: false, isDest: true }
                                                ],
                                                schedules: allSchedules
                                            }
                                        });
                                    }
                                }
                            }
                        } catch(e) {
                            console.error("Error loading bus JSON", e);
                        }`;

if (code.includes(target1) && code.includes(target2) && code.includes(target3)) {
    code = code.replace(target1, replacement1);
    code = code.replace(target2, replacement2);
    code = code.replace(target3, replacement3);
    fs.writeFileSync(file, code);
    console.log("Success");
} else {
    console.log("Failed to find targets");
    if (!code.includes(target1)) console.log("Missing target1");
    if (!code.includes(target2)) console.log("Missing target2");
    if (!code.includes(target3)) console.log("Missing target3");
}
