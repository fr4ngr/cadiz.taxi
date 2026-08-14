const fs = require('fs');
const code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const replacement = `
        window.MapFilterRegistry = {
            // ---------------------------------------------------------
            // SISMOS
            // ---------------------------------------------------------
            'sismos': {
                type: 'data',
                color: '#f97316',
                _markers: [],
                _isActive: false,
                autoZoom: true,
                emptyState: {
                    title: 'Todo tranquilo 😌',
                    desc: '<div style="margin-top:8px; color:var(--text-secondary); line-height: 1.4;">No se han registrado seísmos en España en los últimos 3 días.</div>' +
                          '<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">' +
                          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
                          'Fuente: Instituto Geográfico Nacional</div>'
                },
                fetchData: async () => {
                    const res = await fetch('/api/sismos');
                    const data = await res.json();
                    const now = Date.now();
                    return data.filter(sismo => (now - sismo.timestamp) <= 3 * 24 * 60 * 60 * 1000);
                },
                renderMarker: (sismo, map) => {
                    let radius = 4;
                    let color = '#9ca3af';
                    if (sismo.mag < 2.0) { radius = 4; color = '#9ca3af'; }
                    else if (sismo.mag < 3.0) { radius = 6; color = '#fbbf24'; }
                    else if (sismo.mag < 4.0) { radius = 8; color = '#f97316'; }
                    else if (sismo.mag < 5.0) { radius = 12; color = '#ef4444'; }
                    else if (sismo.mag < 6.0) { radius = 18; color = '#dc2626'; }
                    else if (sismo.mag < 7.0) { radius = 24; color = '#b91c1c'; }
                    else { radius = 32; color = '#7f1d1d'; }

                    return window.L.circleMarker([sismo.lat, sismo.lon], {
                        radius: radius,
                        fillColor: color,
                        color: '#ffffff',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.7
                    }).addTo(map);
                },
                onMarkerClick: (sismo) => {
                    const now = Date.now();
                    const diffHours = Math.floor((now - sismo.timestamp) / (1000 * 60 * 60));
                    const diffMins = Math.floor((now - sismo.timestamp) / (1000 * 60));
                    const diffDays = Math.floor(diffHours / 24);
                    
                    let timeStr = '';
                    if (diffDays > 0) timeStr = diffDays === 1 ? 'Hace 1 día' : 'Hace ' + diffDays + ' días';
                    else if (diffHours > 0) timeStr = diffHours === 1 ? 'Hace 1 hora' : 'Hace ' + diffHours + ' horas';
                    else timeStr = diffMins === 1 ? 'Hace 1 minuto' : 'Hace ' + diffMins + ' minutos';

                    return {
                        label: 'TERREMOTO',
                        labelColor: '#f97316',
                        title: 'Magnitud ' + sismo.mag,
                        desc: '<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">' +
                                '<div style="display: flex; align-items: center; gap: 8px;">' +
                                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f97316;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                                    '<span style="font-weight: 600; color: var(--text-primary);">' + timeStr + '</span>' +
                                '</div>' +
                                '<div style="display: flex; align-items: flex-start; gap: 8px;">' +
                                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); margin-top: 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                                    '<span style="font-weight: 500; line-height: 1.4;">' + sismo.location + '</span>' +
                                '</div>' +
                                '<div style="margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">' +
                                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
                                    'Fuente: Instituto Geográfico Nacional' +
                                '</div>' +
                              '</div>'
                    };
                }
            },

            // ---------------------------------------------------------
            // INCENDIOS
            // ---------------------------------------------------------
            'incendios': {
                type: 'data',
                color: '#ef4444',
                _markers: [],
                _isActive: false,
                autoZoom: true,
                emptyState: {
                    title: 'Todo tranquilo 😌',
                    desc: '<div style="margin-top:8px; color:var(--text-secondary); line-height: 1.4;">No se han detectado anomalías térmicas en la Península Ibérica en las últimas horas.</div>' +
                          '<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">' +
                          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
                          'Fuente: NASA FIRMS</div>'
                },
                fetchData: async () => {
                    const res = await fetch('/api/fires');
                    const data = await res.json();
                    if (!Array.isArray(data)) throw new Error("API did not return an array");
                    return data;
                },
                renderMarker: (fire, map) => {
                    const isHighIntensity = fire.frp > 10;
                    return window.L.circleMarker([fire.lat, fire.lon], {
                        radius: isHighIntensity ? 6 : 4,
                        color: '#ffffff',
                        weight: 1,
                        fillColor: isHighIntensity ? '#b91c1c' : '#ef4444',
                        fillOpacity: 0.9
                    }).addTo(map);
                },
                onMarkerClick: (fire) => {
                    const formatDateTime = (dateStr, timeStr) => {
                        if (!dateStr || !timeStr) return "Desconocido";
                        const fireDate = new Date(dateStr);
                        const today = new Date();
                        const isToday = fireDate.toDateString() === today.toDateString();
                        const dateText = isToday ? "Hoy" : fireDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                        const timeText = timeStr.length === 4 ? timeStr.substring(0,2) + ":" + timeStr.substring(2) + "h" : timeStr + "h";
                        return \`\${dateText} a las \${timeText}\`;
                    };

                    setTimeout(() => {
                        fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${fire.lat}&longitude=\${fire.lon}&current_weather=true\`)
                        .then(r => r.json())
                        .then(wData => {
                            const wContainer = document.getElementById('fire-weather-info');
                            if (wContainer && wData && wData.current_weather) {
                                const wind = Math.round(wData.current_weather.windspeed);
                                const dirs = ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste', 'Norte'];
                                const dirIndex = Math.round(wData.current_weather.winddirection / 45);
                                const dirStr = dirs[dirIndex] || wData.current_weather.winddirection + '°';
                                wContainer.innerHTML = \`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg> <span style="color: var(--text-secondary);">Viento:</span> <span style="font-weight: 600;">\${wind} km/h (\${dirStr})</span>\`;
                            }
                        }).catch(e => console.error(e));
                    }, 50);

                    return {
                        label: 'ANOMALÍA TÉRMICA',
                        labelColor: '#f97316',
                        title: 'Foco Activo',
                        recenter: [fire.lat - 0.05, fire.lon],
                        desc: '<div style="display: flex; flex-direction: column; gap: 16px; margin-top: 12px;">' +
                                '<div style="display: flex; gap: 10px;">' +
                                    (fire.frp > 0 ? \`<div style="flex: 1; background: #fee2e2; border-radius: 12px; padding: 12px;"><div style="font-size: 12px; color: #991b1b; font-weight: 600;">Intensidad térmica</div><div style="font-size: 18px; font-weight: 800; color: #b91c1c; margin-top: 4px;">\${fire.frp} MW</div></div>\` : '') +
                                    \`<div style="flex: 1; background: rgba(0,0,0,0.03); border-radius: 12px; padding: 12px;"><div style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Temp. superficie</div><div style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-top: 4px;">\${Math.round(fire.tempC)}ºC</div></div>\` +
                                '</div>' +
                                '<div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: var(--text-primary);">' +
                                    '<div style="display: flex; align-items: center; gap: 8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span style="color: var(--text-secondary);">Detectado:</span><span style="font-weight: 600;">' + formatDateTime(fire.date, fire.time) + '</span></div>' +
                                    '<div id="fire-weather-info" style="display: flex; align-items: center; gap: 8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg><span style="color: var(--text-secondary);">Cargando viento en la zona...</span></div>' +
                                    '<div style="display: flex; align-items: center; gap: 8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4-4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/></svg><span style="color: var(--text-secondary);">Satélite:</span><span style="font-weight: 600;">' + (fire.satellite || 'NASA') + '</span></div>' +
                                '</div>' +
                                '<div style="background: rgba(0,0,0,0.02); border-radius: 10px; padding: 10px; font-size: 11px; color: var(--text-secondary); line-height: 1.4; border: 1px solid rgba(0,0,0,0.05);"><div><strong>Nota:</strong> El satélite detecta calor anormal. Aunque filtramos fábricas e industrias, podría tratarse de una quema agrícola u otro foco térmico y no siempre un incendio forestal.</div></div>' +
                                '<div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>Fuente: NASA / Copernicus</div>' +
                              '</div>'
                    };
                }
            },

            // ---------------------------------------------------------
            // EMBALSES
            // ---------------------------------------------------------
            'embalses': {
                type: 'data',
                color: '#3b82f6',
                _markers: [],
                _isActive: false,
                autoZoom: false,
                fetchData: async () => {
                    const res = await fetch('/api/water');
                    const data = await res.json();
                    if (!Array.isArray(data)) throw new Error("API error");
                    return data;
                },
                renderMarker: (embalse, map) => {
                    const waterIcon = window.L.divIcon({
                        html: \`<div style="background-color: #3b82f6; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white; color: white;">
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                               </div>\`,
                        className: '',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });
                    return window.L.marker([embalse.lat, embalse.lon], { icon: waterIcon }).addTo(map);
                },
                onMarkerClick: (embalse) => {
                    let barColor = embalse.percentage >= 50 ? '#00e676' : embalse.color;
                    let alertText = "🟢 Normalidad";
                    let alertBg = "#dcfce7";
                    let alertColor = "#166534";

                    if (embalse.percentage < 20) {
                        barColor = '#ef4444'; alertText = "🔴 Emergencia"; alertBg = "#fee2e2"; alertColor = "#991b1b";
                    } else if (embalse.percentage < 35) {
                        barColor = '#f97316'; alertText = "🟠 Alerta"; alertBg = "#ffedd5"; alertColor = "#9a3412";
                    } else if (embalse.percentage < 50) {
                        barColor = '#eab308'; alertText = "🟡 Prealerta"; alertBg = "#fef9c3"; alertColor = "#854d0e";
                    }
                    
                    const trendIcon = embalse.trend > 0 ? '📈' : (embalse.trend < 0 ? '📉' : '➖');
                    const trendText = embalse.trend > 0 ? \`+\${embalse.trend}\` : embalse.trend;

                    setTimeout(() => {
                        const cityMap = {
                            "Almodóvar": "Tarifa", "Arcos": "Arcos de la Frontera",
                            "Barbate": "Alcalá de los Gazules", "Bornos": "Bornos",
                            "Celemín": "Benalup-Casas Viejas", "Charco Redondo": "Los Barrios",
                            "Guadalcacín": "San José del Valle", "Guadarranque": "Castellar de la Frontera",
                            "Los Hurones": "Algar", "Zahara - El Gastor": "Zahara"
                        };
                        const cityName = cityMap[embalse.name] || "Cádiz";
                        fetch('/api/weather?city=' + encodeURIComponent(cityName))
                            .then(r => r.json())
                            .then(wData => {
                                const wContainer = document.getElementById('water-weather-info');
                                if (wContainer && wData && wData.current) {
                                    wContainer.innerHTML = \`<span style="font-size: 24px; margin-right: 4px;">🌤️</span> <div><div style="font-size: 12px; color: var(--text-secondary);">El tiempo ahora</div><div style="font-weight: 500;">\${wData.current.temp}ºC, \${wData.current.skyDesc || wData.current.sky}</div></div>\`;
                                }
                            }).catch(e => console.error(e));
                    }, 50);

                    window.selectedDestination = { lat: embalse.lat, lon: embalse.lon, name: \`Embalse de \${embalse.name}\` };

                    return {
                        label: 'EMBALSE',
                        labelColor: '#3b82f6',
                        title: embalse.name,
                        recenter: [embalse.lat - 0.05, embalse.lon],
                        showActions: true,
                        desc: \`
                            <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 12px;">
                                <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                    <div>
                                        <div style="font-size: 32px; font-weight: 800; color: \${barColor}; line-height: 1; letter-spacing: -0.5px;">\${embalse.percentage}%</div>
                                        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; font-weight: 500;">\${embalse.current} de \${embalse.capacity} hm³</div>
                                    </div>
                                    <div style="background: \${alertBg}; color: \${alertColor}; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 700; display: flex; align-items: center;">\${alertText}</div>
                                </div>
                                <div style="width: 100%; background: var(--header-border); border-radius: 8px; height: 10px; overflow: hidden;">
                                    <div style="width: \${embalse.percentage}%; background: \${barColor}; height: 100%; border-radius: 8px; transition: width 0.5s ease;"></div>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--text-primary);">
                                    <div style="display: flex; align-items: center; gap: 10px;"><div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: center; font-size: 12px;">\${trendIcon}</div><span>Variación semanal: <b>\${trendText} hm³</b></span></div>
                                    \${embalse.trend < 0 ? \`<div style="display: flex; align-items: center; gap: 10px; color: #b91c1c;"><div style="width: 24px; height: 24px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; font-size: 12px;">⏳</div><span>Agua estimada para <b>\${Math.round(embalse.current / (Math.abs(embalse.trend) * 4.345))} meses</b></span></div>\` : ''}
                                </div>
                                \${embalse.pastYear ? \`
                                <div style="background: rgba(0,0,0,0.02); border: 1px solid var(--header-border); border-radius: 12px; padding: 12px; font-size: 13px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: var(--text-secondary);">Hace un año</span><span style="font-weight: 600; color: var(--text-primary);">\${embalse.pastYearPct}% <span style="color: var(--text-secondary); font-weight: 400; font-size: 12px;">(\${embalse.pastYear} hm³)</span></span></div>
                                    <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Media 10 años</span><span style="font-weight: 600; color: var(--text-primary);">\${embalse.avg10YearPct}% <span style="color: var(--text-secondary); font-weight: 400; font-size: 12px;">(\${embalse.avg10Year} hm³)</span></span></div>
                                </div>\` : ''}
                                <div id="water-weather-info" style="display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: var(--text-primary); border-top: 1px solid var(--header-border); padding-top: 14px;">
                                    <span style="font-size: 20px;">🌤️</span> <span style="color: var(--text-secondary);">Cargando clima en el pantano...</span>
                                </div>
                                <div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>Fuente: Junta de Andalucía</div>
                            </div>\`
                    };
                }
            },

            // ---------------------------------------------------------
            // AIRE (Air Quality)
            // ---------------------------------------------------------
            'aire': {
                type: 'data',
                color: '#10b981',
                _markers: [],
                _isActive: false,
                autoZoom: false,
                fetchData: async () => {
                    const res = await fetch('/api/air-quality');
                    const data = await res.json();
                    if (!Array.isArray(data)) throw new Error("API error");
                    return data;
                },
                renderMarker: (station, map) => {
                    return window.L.circleMarker([station.lat, station.lon], {
                        radius: 14,
                        fillColor: station.color,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map);
                },
                onMarkerClick: (station) => {
                    window.mapActionDirections = () => {
                        window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${station.lat},\${station.lon}\`, '_blank');
                    };
                    return {
                        label: 'CALIDAD DEL AIRE',
                        labelColor: station.color,
                        title: station.name,
                        recenter: [station.lat - 0.05, station.lon],
                        showActions: false,
                        desc: \`
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 6px; font-family: 'Inter', system-ui, sans-serif;">
                                <div style="display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, transparent, \${station.color}15); padding: 8px 12px; border-radius: 8px; border-left: 4px solid \${station.color};">
                                    <div>
                                        <div style="font-size: 18px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px;">\${station.status}</div>
                                        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
                                            <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.5px;"><span>ÍNDICE EAQI</span><span>\${station.aqi}/110</span></div>
                                            <div style="width: 140px; height: 6px; background: var(--chat-bg); border-radius: 3px; overflow: hidden; border: 1px solid var(--header-border);">
                                                <div style="width: \${Math.min((station.aqi / 110) * 100, 100)}%; height: 100%; background: \${station.color};"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="width: 24px; height: 24px; border-radius: 50%; background-color: \${station.color}; box-shadow: 0 0 10px \${station.color}80; border: 2px solid var(--bg-color);"></div>
                                </div>
                                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: -4px;">Agentes Contaminantes</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;"><div style="font-size: 11px; color: var(--text-secondary);">Polvo Fino <span style="font-weight:700;">(PM2.5)</span></div><div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.pm25} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div><div style="font-size: 10px; color: var(--text-secondary); font-style: italic;">Humo, escapes</div></div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;"><div style="font-size: 11px; color: var(--text-secondary);">Polvo <span style="font-weight:700;">(PM10)</span></div><div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.pm10} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div><div style="font-size: 10px; color: var(--text-secondary); font-style: italic;">Polen, arena</div></div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;"><div style="font-size: 11px; color: var(--text-secondary);">Tráfico <span style="font-weight:700;">(NO2)</span></div><div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.no2} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div><div style="font-size: 10px; color: var(--text-secondary); font-style: italic;">Coches, industria</div></div>
                                    <div style="background: var(--chat-bg); padding: 8px; border-radius: 8px; border: 1px solid var(--header-border); display: flex; flex-direction: column; gap: 2px;"><div style="font-size: 11px; color: var(--text-secondary);">Ozono <span style="font-weight:700;">(O3)</span></div><div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">\${station.o3} <span style="font-size: 10px; font-weight: 400; color: var(--text-secondary);">μg/m³</span></div><div style="font-size: 10px; color: var(--text-secondary); font-style: italic;">Sol + químicos</div></div>
                                </div>
                                <div style="margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--header-border); font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>Fuente: Agencia Europea de Medio Ambiente</div>
                            </div>\`
                    };
                }
            }
        };

        window.selectMapLayer = async function(layerId) {
            const map = window.currentMap;
            if (!map || !window.L) return;

            const targetBtn = document.querySelector(\`button[onclick*="\${layerId}"]\`);

            if (layerId === 'popular' || layerId === 'red') {
                document.querySelectorAll('.filter-pill').forEach(btn => {
                    if (btn.innerText.includes('Popular') || btn.innerText.includes('Red')) {
                        btn.classList.remove('active');
                    }
                });
                if (targetBtn) targetBtn.classList.add('active');
                return;
            }

            const filtersPills = document.getElementById('map-filters-pills');
            if (filtersPills) filtersPills.classList.remove('open');

            const filterObj = window.MapFilterRegistry[layerId];
            if (!filterObj) return;

            const isCurrentlyActive = filterObj._isActive;

            if (isCurrentlyActive) {
                filterObj._isActive = false;
                if (targetBtn) {
                    targetBtn.classList.remove('active');
                    targetBtn.style.background = 'transparent';
                    targetBtn.style.color = filterObj.color;
                }
                if (filterObj._markers) {
                    filterObj._markers.forEach(m => map.removeLayer(m));
                    filterObj._markers = [];
                }
            } else {
                filterObj._isActive = true;
                if (targetBtn) {
                    targetBtn.classList.add('active');
                    targetBtn.style.background = filterObj.color;
                    targetBtn.style.color = 'white';
                }

                try {
                    const data = await filterObj.fetchData();

                    if (!data || data.length === 0) {
                        if (filterObj.emptyState) {
                            const pill = document.getElementById('map-info-pill');
                            const container = document.getElementById('map-ui-container');
                            if (pill && container) {
                                document.getElementById('map-info-label').innerText = filterObj.name || layerId.toUpperCase();
                                document.getElementById('map-info-label').style.color = filterObj.color;
                                document.getElementById('map-info-title').innerText = filterObj.emptyState.title;
                                document.getElementById('map-info-desc').innerHTML = filterObj.emptyState.desc;
                                
                                const actionsDiv = document.getElementById('map-pill-actions');
                                if (actionsDiv) actionsDiv.style.display = 'none';

                                container.style.opacity = '1';
                                container.style.pointerEvents = 'auto';
                                container.style.transform = 'translate(-50%, 0)';
                            }
                        }
                        return;
                    }

                    filterObj._markers = [];
                    data.forEach(item => {
                        const marker = filterObj.renderMarker(item, map);
                        
                        marker.on('click', () => {
                            const popupData = filterObj.onMarkerClick(item);
                            const container = document.getElementById('map-ui-container');
                            if (!container) return;

                            document.getElementById('map-info-label').innerText = popupData.label;
                            document.getElementById('map-info-label').style.color = popupData.labelColor || filterObj.color;
                            document.getElementById('map-info-title').innerText = popupData.title;
                            document.getElementById('map-info-desc').innerHTML = popupData.desc;

                            const actionsDiv = document.getElementById('map-pill-actions');
                            if (actionsDiv) {
                                actionsDiv.style.display = popupData.showActions !== false ? 'flex' : 'none';
                            }
                            if (popupData.recenter) {
                                map.setView(popupData.recenter, 11);
                            }
                            container.style.opacity = '1';
                            container.style.pointerEvents = 'auto';
                            container.style.transform = 'translate(-50%, 0)';
                        });
                        filterObj._markers.push(marker);
                    });

                    if (filterObj.autoZoom && filterObj._markers.length > 0) {
                        const group = new window.L.featureGroup(filterObj._markers);
                        map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 9 });
                    }
                } catch (error) {
                    console.error(\`Error loading filter \${layerId}:\`, error);
                    filterObj._isActive = false;
                    if (targetBtn) {
                        targetBtn.classList.remove('active');
                        targetBtn.style.background = 'transparent';
                        targetBtn.style.color = filterObj.color;
                    }
                }
            }
        };
`;

const startIdx = code.indexOf('window.selectMapLayer = function(layerId) {');
const endIdx = code.indexOf('</script>', startIdx);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find boundaries');
    process.exit(1);
}

const newCode = code.substring(0, startIdx) + replacement + '\n    }\n' + code.substring(endIdx);
fs.writeFileSync('src/components/widgets/MapWidget.astro', newCode, 'utf8');
console.log('Successfully replaced!');
