const renfeData = require('../public/data/renfe_cadiz.json');
let originId = '51405', destId = '51205';
let allDayTrips = [];
const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false });
const madridDate = new Date('2026-08-11T12:07:00Z');
const nowStr = formatter.format(madridDate);
const dayOfWeek = madridDate.getDay() === 0 ? 6 : madridDate.getDay() - 1;
const nowStrDate = `${madridDate.getFullYear()}${(madridDate.getMonth() + 1).toString().padStart(2, '0')}${madridDate.getDate().toString().padStart(2, '0')}`;

for (const trip of renfeData.trips) {
    const cal = renfeData.calendar[trip.s];
    if (cal && cal.days[dayOfWeek] === 1 && cal.start <= nowStrDate && cal.end >= nowStrDate) {
        const oIdx = trip.st.findIndex(s => s[0] === originId);
        const dIdx = trip.st.findIndex(s => s[0] === destId);
        if (oIdx !== -1 && dIdx !== -1 && oIdx < dIdx) {
            const time = trip.st[oIdx][1];
            allDayTrips.push({ time, trip, oIdx, dIdx });
        }
    }
}
const uniqueTripsMap = new Map();
for (const t of allDayTrips) {
    if (!uniqueTripsMap.has(t.time)) uniqueTripsMap.set(t.time, t);
}
allDayTrips = Array.from(uniqueTripsMap.values()).sort((a, b) => a.time.localeCompare(b.time));
let upcoming = allDayTrips.filter(t => t.time >= nowStr);
console.log('Now:', nowStr);
console.log('Upcoming:', upcoming.length);
console.log(upcoming.map(u => u.time));
