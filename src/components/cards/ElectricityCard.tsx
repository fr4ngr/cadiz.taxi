import { h } from 'preact';
import type { CardData } from './types';
import { CardWrapper, CardButton } from './CardShared';

const SunriseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.6}}>
        <path d="M12 2v2"></path>
        <path d="M4.22 10.22l1.42 1.42"></path>
        <path d="M18.36 11.64l1.42-1.42"></path>
        <path d="M2 18h2"></path>
        <path d="M20 18h2"></path>
        <path d="M8 18a4 4 0 1 1 8 0"></path>
        <path d="M2 22h20"></path>
    </svg>
);

const SunsetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.6}}>
        <path d="M12 10v8"></path>
        <path d="M8 14l4 4 4-4"></path>
        <path d="M4.22 10.22l1.42 1.42"></path>
        <path d="M18.36 11.64l1.42-1.42"></path>
        <path d="M2 18h2"></path>
        <path d="M20 18h2"></path>
        <path d="M2 22h20"></path>
    </svg>
);

export const ElectricityCard = ({ data }: { data: CardData }) => {
    let hours = [];
    try {
        if (data.electricityData) {
            hours = JSON.parse(data.electricityData);
        }
    } catch (e) {
        console.error("Error parsing electricity data", e);
    }

    if (!hours || hours.length === 0) {
        return (
            <CardWrapper data={data}>
                <div style={{ padding: '16px', color: 'var(--text-color)' }}>
                    <p>No se han podido cargar los datos de la luz.</p>
                </div>
            </CardWrapper>
        );
    }

    // Calcula estadísticas
    const currentHourStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', hour12: false, timeZone: 'Europe/Madrid' });
    let currentHourPrefix = currentHourStr.substring(0, 2);
    
    // El formato de api.preciodelaluz.org es "00-01", "14-15"
    let currentPrice = null;
    let sum = 0;
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    hours.forEach(h => {
        sum += h.price;
        if (h.price < minPrice) minPrice = h.price;
        if (h.price > maxPrice) maxPrice = h.price;
        // Check if current hour
        if (h.hour.startsWith(currentHourPrefix + '-')) {
            currentPrice = h;
        }
    });

    const avgPrice = sum / hours.length;

    // Colores para el semáforo (estilo Google)
    const colorCheap = '#10b981'; // emerald-500
    const colorAvg = '#f59e0b'; // amber-500
    const colorExp = '#ef4444'; // red-500

    const getColor = (price: number) => {
        if (price <= minPrice + (avgPrice - minPrice) * 0.4) return colorCheap;
        if (price >= maxPrice - (maxPrice - avgPrice) * 0.4) return colorExp;
        return colorAvg;
    };

    return (
        <CardWrapper data={data}>
            <div style={{ padding: '16px' }}>
                {data.badge && (
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--primary-color)', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        {data.badge}
                    </div>
                )}
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '700' }}>
                    {data.title || 'Precio de la Luz (PVPC)'}
                </h3>
                
                {/* Bloque Precio Actual y Media en Mini-Tarjetas */}
                {currentPrice && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                        gap: '12px', 
                        marginBottom: '24px' 
                    }}>
                        {/* Mini-tarjeta: Precio Actual */}
                        <div style={{ 
                            background: 'rgba(0,0,0,0.03)', 
                            borderRadius: '12px', 
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>
                                Precio actual ({currentPrice.hour.split('-')[0]}h)
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: getColor(currentPrice.price), lineHeight: '1.1' }}>
                                {(currentPrice.price / 1000).toFixed(4)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>€/kWh</span>
                            </div>
                        </div>

                        {/* Mini-tarjeta: Media Diaria */}
                        <div style={{ 
                            background: 'rgba(0,0,0,0.03)', 
                            borderRadius: '12px', 
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>
                                Media del día
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)', lineHeight: '1.1' }}>
                                {(avgPrice / 1000).toFixed(4)} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>€/kWh</span>
                            </div>
                            {data.historicalComparison && (
                                <div style={{ marginTop: '8px' }}>
                                    {(() => {
                                        const p = data.historicalComparison.percentChange;
                                        if (Math.abs(p) < 1) {
                                            return <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>= Sin cambios vs año pasado</span>;
                                        }
                                        const isCheaper = p < 0;
                                        const color = isCheaper ? '#10b981' : '#ef4444';
                                        const bg = isCheaper ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
                                        return (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', background: bg, color: color, fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {isCheaper ? '↓' : '↑'} {Math.abs(p).toFixed(1)}% vs año pasado
                                            </span>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Gráfico de barras */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Evolución por horas</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '2px', width: '100%', marginBottom: '12px' }}>
                    {hours.map((h, i) => {
                        // Altura proporcional absoluta (el máximo es 100%) con un mínimo de 5% para que siempre se vea una rayita
                        const heightPct = Math.max(5, (h.price / (maxPrice || 1)) * 100);
                        const isCurrent = currentPrice && currentPrice.hour === h.hour;
                        
                        return (
                            <div 
                                key={i} 
                                title={`${h.hour}h - ${(h.price / 1000).toFixed(4)} €/kWh`}
                                style={{
                                    flex: 1,
                                    height: `${heightPct}%`,
                                    background: getColor(h.price),
                                    opacity: isCurrent ? 1 : 0.6,
                                    borderRadius: '2px 2px 0 0',
                                    border: isCurrent ? '1px solid var(--bg-color)' : 'none',
                                    outline: isCurrent ? `2px solid ${getColor(h.price)}` : 'none',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                {isCurrent && (
                                    <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                        {currentHourPrefix}h
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>Más barata</div>
                        <div style={{ color: colorCheap, fontWeight: 'bold' }}>{(minPrice / 1000).toFixed(4)} € <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>({hours.find(h=>h.price===minPrice)?.hour.split('-')[0]}h)</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>Más cara</div>
                        <div style={{ color: colorExp, fontWeight: 'bold' }}>{(maxPrice / 1000).toFixed(4)} € <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>({hours.find(h=>h.price===maxPrice)?.hour.split('-')[0]}h)</span></div>
                    </div>
                </div>

                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <details style={{ fontSize: '0.85rem' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>Ver precios de todas las horas</summary>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginTop: '12px' }}>
                            {/* Columna Mañana (00h - 11h) */}
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '8px 12px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase' }}>Mañana</div>
                                {hours.slice(0, 12).map((h, i) => {
                                    const isCurrent = h.hour === currentPrice?.hour;
                                    const isSunrise = data.sunsetData && data.sunsetData.sunrise.startsWith(h.hour.split('-')[0]);
                                    const isSunset = data.sunsetData && data.sunsetData.sunset.startsWith(h.hour.split('-')[0]);
                                    return (
                                        <div key={i} style={{ 
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '4px 0', borderBottom: i < 11 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                            color: isCurrent ? 'var(--text-color)' : 'var(--text-secondary)',
                                            fontWeight: isCurrent ? 'bold' : 'normal'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {isCurrent && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)' }}></span>}
                                                <span style={{ fontSize: '0.8rem' }}>{h.hour.split('-')[0]}h</span>
                                                {isSunrise && <SunriseIcon />}
                                                {isSunset && <SunsetIcon />}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                                                <span style={{ color: getColor(h.price), fontWeight: '600', fontSize: '0.85rem' }}>{(h.price / 1000).toFixed(4)}</span>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>€/kWh</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Columna Tarde/Noche (12h - 23h) */}
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '8px 12px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase' }}>Tarde</div>
                                {hours.slice(12, 24).map((h, i) => {
                                    const isCurrent = h.hour === currentPrice?.hour;
                                    const isSunrise = data.sunsetData && data.sunsetData.sunrise.startsWith(h.hour.split('-')[0]);
                                    const isSunset = data.sunsetData && data.sunsetData.sunset.startsWith(h.hour.split('-')[0]);
                                    return (
                                        <div key={i} style={{ 
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '4px 0', borderBottom: i < 11 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                            color: isCurrent ? 'var(--text-color)' : 'var(--text-secondary)',
                                            fontWeight: isCurrent ? 'bold' : 'normal'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {isCurrent && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)' }}></span>}
                                                <span style={{ fontSize: '0.8rem' }}>{h.hour.split('-')[0]}h</span>
                                                {isSunrise && <SunriseIcon />}
                                                {isSunset && <SunsetIcon />}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                                                <span style={{ color: getColor(h.price), fontWeight: '600', fontSize: '0.85rem' }}>{(h.price / 1000).toFixed(4)}</span>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>€/kWh</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </details>
                </div>

                {data.subtitle && <p style={{ margin: '16px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{data.subtitle}</p>}
                
                <CardButton data={data} />
            </div>
        </CardWrapper>
    );
};
