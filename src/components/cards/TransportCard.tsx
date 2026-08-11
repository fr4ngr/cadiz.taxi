import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { CardData } from './types';
import { CardWrapper } from './CardShared';
import { IconAlert, IconBus, IconShip, IconTrain } from '../Icons';

export const TransportCard = ({ data }: { data: CardData }) => {
    const { transportData } = data;
    const [expandedOpt, setExpandedOpt] = useState<number | null>(null);
    const [selectedSchedules, setSelectedSchedules] = useState<Record<number, number>>({});

    if (!transportData) return null;

    const getIconForMode = (mode: string) => {
        switch (mode) {
            case 'bus': return <IconBus size={24} />;
            case 'train': return <IconTrain size={24} />;
            case 'boat': return <IconShip size={24} />;
            default: return <IconBus size={24} />;
        }
    };

    return (
        <CardWrapper data={data}>
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
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {transportData.alert && (
                    <div style={{ 
                        background: '#fef2f2', 
                        border: '1px solid #fecaca', 
                        borderRadius: '16px', 
                        padding: '16px', 
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{ color: '#991b1b', marginTop: '2px' }}>
                            <IconAlert size={24} color="#991b1b" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>{transportData.alert.title}</div>
                            <div style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.4' }}>{transportData.alert.description}</div>
                        </div>
                    </div>
                )}

                {transportData.routes && transportData.routes.map((route, i) => {
                    let brandColor = 'var(--primary-color)';
                    if (route.mode === 'train') brandColor = '#e11d48';
                    if (route.mode === 'bus') brandColor = '#0f766e';
                    if (route.mode === 'boat') brandColor = '#0284c7';

                    let activeSched = null;
                    let activeIndex = -1;
                    if (route.details?.schedules?.length > 0) {
                        activeIndex = selectedSchedules[i] ?? route.details.schedules.findIndex((s: any) => s.time === route.nextDeparture);
                        if (activeIndex < 0) activeIndex = 0;
                        activeSched = route.details.schedules[activeIndex];
                    }

                    const activeDurationText = activeSched?.durationText ?? route.durationText ?? '-';
                    const activeStops = activeSched?.stops ?? route.details?.stops ?? [];
                    const activeLineCode = activeSched?.fullLineCode ?? route.details?.lineCode ?? "";
                    const activeTime = activeSched?.time ?? route.nextDeparture;

                    return (
                        <div 
                            key={i} 
                            onClick={() => route.details ? setExpandedOpt(expandedOpt === i ? null : i) : undefined}
                            style={{ 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '24px', 
                                padding: '20px',
                                background: 'var(--bg-secondary)',
                                cursor: route.details ? 'pointer' : 'default',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '50%', 
                                    background: 'white',
                                    color: brandColor,
                                    border: `2px solid ${brandColor}`,
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginRight: '16px',
                                    flexShrink: 0
                                }}>
                                    {getIconForMode(route.mode)}
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>
                                            {route.origin} ➔ {route.destination}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                        {activeTime && (
                                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                                                Sale a las {activeTime}
                                            </div>
                                        )}
                                        
                                        {/* Real-time Indicator */}
                                        {(route.status === 'on_time' || route.status === 'delayed') && (
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, color: route.status === 'delayed' ? '#ef4444' : '#10b981' }}>
                                                <span className={`blinking-dot ${route.status === 'delayed' ? 'delayed' : ''}`}></span>
                                                {route.status === 'delayed' ? `Retraso ${route.delay} min` : 'En hora'}
                                            </div>
                                        )}
                                        
                                        {route.status === 'canceled' && (
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>
                                                <span style={{ marginRight: '4px' }}>✕</span> Cancelado
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {route.details && (
                                    <div style={{ marginLeft: '12px', color: 'var(--text-secondary)', transform: expandedOpt === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                )}
                            </div>

                            {/* Transit Accordion Details (Google Maps Timeline Style) */}
                            {expandedOpt === i && route.details && (
                                <div style={{ 
                                    marginTop: '20px', 
                                    paddingTop: '20px', 
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', background: brandColor, borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontWeight: 600, color: 'white', alignSelf: 'flex-start' }}>
                                        {getIconForMode(route.mode)}
                                        <span style={{ marginLeft: '8px' }}>Línea: {activeLineCode}</span>
                                    </div>

                                    {/* Stops Timeline */}
                                    <div style={{ paddingLeft: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                            {activeStops.map((stop: any, idx: number) => (
                                                <div key={idx} className="timeline-stop">
                                                    {idx !== activeStops.length - 1 && (
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
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Horarios ({route.details.schedules.length})</div>
                                        <div 
                                            id={`schedule-scroll-t${i}`}
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
                                            {route.details.schedules.map((sched: any, idx: number) => {
                                                const isActive = activeIndex === idx;
                                                const isPast = sched.isPast && !isActive;
                                                return (
                                                    <div 
                                                        key={idx} 
                                                        id={isActive ? `active-schedule-t${i}` : undefined}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isPast) setSelectedSchedules(prev => ({ ...prev, [i]: idx }));
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
        </CardWrapper>
    );
};
