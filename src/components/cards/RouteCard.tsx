import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import type { CardData } from './types';
import { IconCar, IconBus, IconTrain, IconShip, IconTraffic } from '../Icons';

export const RouteCard = ({ data }: { data: CardData }) => {
    const [expandedOpt, setExpandedOpt] = useState<number | null>(null);

    if (!data.routeData) return null;
    const { origin, destination, options } = data.routeData;

    // Sort options: Public transport first (by duration), then Car at the bottom
    const sortedOptions = [...options].sort((a, b) => {
        if (a.mode === 'car' && b.mode !== 'car') return 1;
        if (b.mode === 'car' && a.mode !== 'car') return -1;
        return a.durationValue - b.durationValue;
    });

    const getIconForMode = (mode: string) => {
        switch (mode) {
            case 'car': return <IconCar size={24} />;
            case 'bus': return <IconBus size={24} />;
            case 'train': return <IconTrain size={24} />;
            case 'boat': return <IconShip size={24} />;
            default: return null;
        }
    };

    const getTrafficColor = (condition?: string) => {
        switch (condition) {
            case 'heavy': return 'var(--danger-color, #ef4444)';
            case 'moderate': return 'var(--warning-color, #f59e0b)';
            case 'good': return 'var(--success-color, #10b981)';
            default: return 'var(--text-secondary)';
        }
    };
    
    const getModeLabel = (opt: any) => {
        switch (opt.mode) {
            case 'car': return 'Coche';
            case 'bus': return 'Autobús';
            case 'train': 
                if (opt.details?.lineCode) {
                    if (opt.details.lineCode === 'MD') return 'Tren Media Distancia';
                    return `Tren ${opt.details.lineCode}`;
                }
                return 'Tren';
            case 'boat': return 'Catamarán';
            default: return 'Transporte';
        }
    };

    return (
        <div className="card route-card" style={{
            background: 'var(--bg-color)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            width: '100%',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            {/* Header: Origin to Destination */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {origin} <span style={{ color: 'var(--text-secondary)', margin: '0 8px' }}>➔</span> {destination}
                    </h3>
                </div>
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sortedOptions.map((opt, index) => {
                    const isFastest = index === 0;
                    
                    return (
                        <div 
                            key={index} 
                            onClick={() => opt.details ? setExpandedOpt(expandedOpt === index ? null : index) : undefined}
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '12px',
                            background: isFastest ? 'var(--primary-color-light, rgba(59, 130, 246, 0.1))' : 'var(--bg-secondary)',
                            borderRadius: '12px',
                            border: isFastest ? '1px solid var(--primary-color)' : '1px solid transparent',
                            cursor: opt.details ? 'pointer' : 'default'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {/* Icon */}
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                background: isFastest ? 'var(--primary-color)' : 'var(--border-color)',
                                color: isFastest ? 'white' : 'var(--text-secondary)',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginRight: '16px'
                            }}>
                                {getIconForMode(opt.mode)}
                            </div>
                            
                            {/* Details */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>
                                        {getModeLabel(opt)}
                                    </span>
                                    {isFastest && (
                                        <span style={{ 
                                            fontSize: '11px', 
                                            background: 'var(--success-color, #10b981)', 
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '12px',
                                            fontWeight: 600
                                        }}>
                                            MÁS RÁPIDO
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{opt.durationText}</span>
                                    
                                    {opt.distanceText && (
                                        <span>{opt.distanceText}</span>
                                    )}
                                    
                                    {opt.mode === 'car' && opt.trafficCondition && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getTrafficColor(opt.trafficCondition) }}>
                                            <IconTraffic size={14} />
                                            Tráfico
                                        </div>
                                    )}
                                    
                                    {opt.nextDeparture && (
                                        <span style={{ background: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                            Sale a las {opt.nextDeparture}
                                        </span>
                                    )}
                                </div>
                            </div>
                            </div>
                            
                            {/* Accordion Details */}
                            {expandedOpt === index && opt.details && (
                                <div style={{ 
                                    marginTop: '16px', 
                                    paddingTop: '16px', 
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}>
                                    <div style={{ display: 'inline-block', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', alignSelf: 'flex-start' }}>
                                        Línea: {opt.details.lineCode}
                                    </div>

                                    {/* Stops Timeline */}
                                    <div style={{ paddingLeft: '8px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Recorrido</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                            {opt.details.stops.map((stop, i) => (
                                                <div key={i} style={{ display: 'flex', position: 'relative', paddingBottom: i === opt.details.stops.length - 1 ? '0' : '12px' }}>
                                                    {i !== opt.details.stops.length - 1 && (
                                                        <div style={{ position: 'absolute', left: '3px', top: '10px', bottom: '0', width: '2px', background: 'var(--border-color)' }} />
                                                    )}
                                                    <div style={{ 
                                                        width: '8px', 
                                                        height: '8px', 
                                                        borderRadius: '50%', 
                                                        background: stop.isOrigin || stop.isDest ? 'var(--primary-color)' : 'white', 
                                                        border: '2px solid var(--primary-color)',
                                                        marginTop: '4px',
                                                        marginRight: '12px',
                                                        zIndex: 1
                                                    }} />
                                                    <div style={{ 
                                                        fontSize: '13px', 
                                                        fontWeight: stop.isOrigin || stop.isDest ? 600 : 400,
                                                        color: stop.isOrigin || stop.isDest ? 'var(--text-primary)' : 'var(--text-secondary)'
                                                    }}>
                                                        {stop.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Full Schedule Grid */}
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Horarios ({opt.details.schedules.length})</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
                                            {opt.details.schedules.map((sched, i) => {
                                                const isNext = opt.nextDeparture && sched.time === opt.nextDeparture;
                                                return (
                                                    <div key={i} style={{
                                                        padding: '4px 0',
                                                        textAlign: 'center',
                                                        fontSize: '13px',
                                                        fontWeight: isNext ? 600 : 400,
                                                        borderRadius: '6px',
                                                        background: isNext ? 'var(--success-color, #10b981)' : (sched.isPast ? 'var(--bg-color)' : 'var(--bg-secondary)'),
                                                        color: isNext ? 'white' : (sched.isPast ? 'var(--text-secondary)' : 'var(--text-primary)'),
                                                        border: sched.isPast ? '1px dashed var(--border-color)' : '1px solid transparent',
                                                        textDecoration: sched.isPast ? 'line-through' : 'none'
                                                    }}>
                                                        {sched.lineCode && (
                                                            <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '2px', fontWeight: 500 }}>
                                                                {sched.lineCode}
                                                            </div>
                                                        )}
                                                        <div>{sched.time}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Open in Maps button if Car is present */}
            {options.some(o => o.mode === 'car') && (
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'block',
                        marginTop: '16px',
                        padding: '10px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '14px'
                    }}
                >
                    📍 Iniciar navegación
                </a>
            )}
        </div>
    );
};
