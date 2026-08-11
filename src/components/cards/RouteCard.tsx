import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import type { CardData } from './types';
import { IconCar, IconBus, IconTrain, IconShip, IconTraffic } from '../Icons';

export const RouteCard = ({ data }: { data: CardData }) => {
    const [expandedOpt, setExpandedOpt] = useState<number | null>(null);
    const [selectedSchedules, setSelectedSchedules] = useState<Record<number, number>>({});

    if (!data.routeData) return null;
    const { origin, destination, options } = data.routeData;

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
            case 'heavy': return '#ef4444'; // Red
            case 'moderate': return '#f59e0b'; // Orange
            case 'good': return '#10b981'; // Green
            default: return 'var(--text-secondary)';
        }
    };

    const getTrafficBackground = (condition?: string) => {
        switch (condition) {
            case 'heavy': return 'rgba(239, 68, 68, 0.1)';
            case 'moderate': return 'rgba(245, 158, 11, 0.1)';
            case 'good': return 'rgba(16, 185, 129, 0.1)';
            default: return 'var(--bg-secondary)';
        }
    };

    const getModeLabel = (opt: any, activeLineCode?: string) => {
        switch (opt.mode) {
            case 'car': return 'Coche';
            case 'bus': return 'Autobús';
            case 'train': 
                const code = activeLineCode || opt.details?.lineCode;
                if (code) {
                    if (code === 'MD') return 'Tren MD';
                    return `Tren ${code}`;
                }
                return 'Tren';
            case 'boat': return 'Catamarán';
            default: return 'Transporte';
        }
    };

    return (
        <div className="card route-card" style={{
            background: 'var(--bg-color)',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.08)',
            width: '100%',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes heartbeat {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                @keyframes heartbeat-red {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .blinking-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #10b981;
                    border-radius: 50%;
                    display: inline-block;
                    animation: heartbeat 2s infinite;
                    margin-right: 6px;
                }
                .blinking-dot.delayed {
                    background-color: #ef4444;
                    animation: heartbeat-red 2s infinite;
                }
                .timeline-stop {
                    display: flex;
                    position: relative;
                    padding-bottom: 16px;
                }
                .timeline-stop:last-child {
                    padding-bottom: 0;
                }
                .timeline-line {
                    position: absolute;
                    left: 5px;
                    top: 14px;
                    bottom: -2px;
                    width: 2px;
                }
                .timeline-circle {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: white;
                    margin-top: 4px;
                    margin-right: 12px;
                    z-index: 1;
                }
            `}} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {origin} <span style={{ color: 'var(--text-secondary)', margin: '0 8px', fontWeight: 400 }}>➔</span> {destination}
                </h3>
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sortedOptions.map((opt, index) => {
                    const isFastest = index === 0;
                    
                    let activeSched = null;
                    let activeIndex = -1;
                    if (opt.details?.schedules?.length > 0) {
                        activeIndex = selectedSchedules[index] ?? opt.details.schedules.findIndex((s: any) => s.time === opt.nextDeparture);
                        if (activeIndex < 0) activeIndex = 0;
                        activeSched = opt.details.schedules[activeIndex];
                    }

                    const activeDurationText = activeSched?.durationText ?? opt.durationText;
                    const activeStops = activeSched?.stops ?? opt.details?.stops ?? [];
                    const activeLineCode = activeSched?.fullLineCode ?? opt.details?.lineCode ?? "";
                    const activeTime = activeSched?.time ?? opt.nextDeparture;
                    
                    // Brand Color for the transit mode
                    let brandColor = 'var(--primary-color)';
                    if (opt.mode === 'train') brandColor = '#e11d48'; // Renfe Red
                    if (opt.mode === 'bus') brandColor = '#0f766e'; // Consorcio Teal
                    if (opt.mode === 'boat') brandColor = '#0284c7'; // Sea Blue
                    
                    // Traffic styling for cars
                    const isCar = opt.mode === 'car';
                    const bgStyle = isCar 
                        ? getTrafficBackground(opt.trafficCondition)
                        : (isFastest ? 'var(--primary-color-light, rgba(59, 130, 246, 0.05))' : 'var(--bg-secondary)');
                    const borderStyle = isCar
                        ? `1px solid ${getTrafficColor(opt.trafficCondition)}`
                        : (isFastest ? '1px solid var(--primary-color)' : '1px solid transparent');

                    return (
                        <div 
                            key={index} 
                            onClick={() => opt.details ? setExpandedOpt(expandedOpt === index ? null : index) : undefined}
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '16px',
                            background: bgStyle,
                            borderRadius: '20px',
                            border: borderStyle,
                            cursor: opt.details ? 'pointer' : 'default',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {/* Icon */}
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '50%', 
                                    background: isCar ? getTrafficColor(opt.trafficCondition) : (isFastest ? 'var(--primary-color)' : 'var(--border-color)'),
                                    color: isCar || isFastest ? 'white' : 'var(--text-secondary)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginRight: '16px',
                                    flexShrink: 0
                                }}>
                                    {getIconForMode(opt.mode)}
                                </div>
                                
                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>
                                            {getModeLabel(opt, activeLineCode)}
                                        </span>
                                        {isFastest && !isCar && (
                                            <span style={{ 
                                                fontSize: '11px', 
                                                background: 'var(--primary-color)', 
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontWeight: 600
                                            }}>
                                                MÁS RÁPIDO
                                            </span>
                                        )}
                                        {isCar && opt.trafficCondition && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: getTrafficColor(opt.trafficCondition) }}>
                                                <IconTraffic size={14} />
                                                {opt.trafficCondition === 'heavy' ? 'Tráfico denso' : (opt.trafficCondition === 'moderate' ? 'Tráfico moderado' : 'Sin tráfico')}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{activeDurationText}</span>
                                        
                                        {opt.distanceText && (
                                            <span>{opt.distanceText}</span>
                                        )}
                                        
                                        {activeTime && (
                                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                                                Sale a las {activeTime}
                                            </div>
                                        )}
                                        
                                        {opt.status && opt.status !== 'theoretical' && (
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, color: opt.status === 'delayed' ? '#ef4444' : '#10b981' }}>
                                                <span className={`blinking-dot ${opt.status === 'delayed' ? 'delayed' : ''}`}></span>
                                                {opt.status === 'delayed' ? `Retraso ${opt.delay} min` : 'En hora'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Chevron Indicator */}
                                {opt.details && (
                                    <div style={{ marginLeft: '12px', color: 'var(--text-secondary)', transform: expandedOpt === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Transit Accordion Details (Google Maps Timeline Style) */}
                            {expandedOpt === index && opt.details && (
                                <div style={{ 
                                    marginTop: '20px', 
                                    paddingTop: '20px', 
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', background: brandColor, borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontWeight: 600, color: 'white', alignSelf: 'flex-start' }}>
                                        {getIconForMode(opt.mode)}
                                        <span style={{ marginLeft: '8px' }}>Línea: {activeLineCode}</span>
                                    </div>

                                    {/* Stops Timeline */}
                                    <div style={{ paddingLeft: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                            {activeStops.map((stop: any, i: number) => (
                                                <div key={i} className="timeline-stop">
                                                    {i !== activeStops.length - 1 && (
                                                        <div className="timeline-line" style={{ background: brandColor }} />
                                                    )}
                                                    <div className="timeline-circle" style={{ 
                                                        border: `3px solid ${brandColor}`,
                                                        background: stop.isOrigin || stop.isDest ? brandColor : 'var(--bg-color)'
                                                    }} />
                                                    <div style={{ 
                                                        fontSize: '14px', 
                                                        fontWeight: stop.isOrigin || stop.isDest ? 600 : 500,
                                                        color: stop.isOrigin || stop.isDest ? 'var(--text-primary)' : 'var(--text-secondary)',
                                                        marginTop: '2px'
                                                    }}>
                                                        {stop.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Full Schedule Grid */}
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Horarios ({opt.details.schedules.length})</div>
                                        <div 
                                            id={`schedule-scroll-${index}`}
                                            style={{ 
                                                display: 'flex', 
                                                gap: '8px', 
                                                overflowX: 'auto', 
                                                paddingBottom: '8px',
                                                scrollBehavior: 'smooth',
                                                scrollbarWidth: 'none',
                                                msOverflowStyle: 'none'
                                            }}
                                        >
                                            {opt.details.schedules.map((sched: any, i: number) => {
                                                const isActive = activeIndex === i;
                                                const isPast = sched.isPast && !isActive;
                                                return (
                                                    <div 
                                                        key={i} 
                                                        id={isActive ? `active-schedule-${index}` : undefined}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isPast) setSelectedSchedules(prev => ({ ...prev, [index]: i }));
                                                        }}
                                                        style={{
                                                        flexShrink: 0,
                                                        minWidth: '64px',
                                                        padding: '8px 12px',
                                                        textAlign: 'center',
                                                        fontSize: '14px',
                                                        fontWeight: isActive ? 600 : 500,
                                                        borderRadius: '12px',
                                                        cursor: isPast ? 'not-allowed' : 'pointer',
                                                        opacity: isPast ? 0.5 : 1,
                                                        background: isActive ? brandColor : (isPast ? 'var(--bg-color)' : 'var(--bg-color)'),
                                                        color: isActive ? 'white' : 'var(--text-primary)',
                                                        border: isPast ? '1px dashed var(--border-color)' : (isActive ? `1px solid ${brandColor}` : '1px solid var(--border-color)'),
                                                        boxShadow: isActive ? `0 4px 12px ${brandColor}40` : 'none',
                                                    }}>
                                                        {sched.lineCode && (
                                                            <div style={{ fontSize: '11px', opacity: isActive ? 0.9 : 0.6, marginBottom: '4px', fontWeight: 600 }}>
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
            
            {/* Open in Maps button */}
            {options.some(o => o.mode === 'car') && (
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '24px',
                        padding: '14px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '100px', // Material You Pill shape
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '15px',
                        boxShadow: '0 4px 12px var(--primary-color-light)'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                    Iniciar navegación
                </a>
            )}
        </div>
    );
};
