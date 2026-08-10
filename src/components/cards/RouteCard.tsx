import { h } from 'preact';
import type { CardData } from './types';
import { IconCar, IconBus, IconTrain, IconShip, IconTraffic } from '../Icons';

export const RouteCard = ({ data }: { data: CardData }) => {
    if (!data.routeData) return null;
    const { origin, destination, options } = data.routeData;

    // Sort options by duration (fastest first)
    const sortedOptions = [...options].sort((a, b) => a.durationValue - b.durationValue);

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
    
    const getModeLabel = (mode: string) => {
        switch (mode) {
            case 'car': return 'Coche';
            case 'bus': return 'Autobús';
            case 'train': return 'Tren';
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
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            background: isFastest ? 'var(--primary-color-light, rgba(59, 130, 246, 0.1))' : 'var(--bg-secondary)',
                            borderRadius: '12px',
                            border: isFastest ? '1px solid var(--primary-color)' : '1px solid transparent'
                        }}>
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
                                        {getModeLabel(opt.mode)}
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
