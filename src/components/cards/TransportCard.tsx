import { h } from 'preact';
import type { CardData } from './types';
import { CardWrapper } from './CardShared';
import { IconAlert, IconBus, IconShip } from '../Icons';

export const TransportCard = ({ data }: { data: CardData }) => {
    const { transportData } = data;
    if (!transportData) return null;

    return (
        <CardWrapper data={data}>
            <div style={{ padding: '16px' }}>
                {transportData.alert && (
                    <div style={{ 
                        background: '#fef2f2', 
                        border: '1px solid #fecaca', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginBottom: '16px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{ color: '#991b1b', marginTop: '2px' }}>
                            <IconAlert size={24} color="#991b1b" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#991b1b', marginBottom: '4px' }}>{transportData.alert.title}</div>
                            <div style={{ color: '#7f1d1d', fontSize: '0.9rem' }}>{transportData.alert.description}</div>
                        </div>
                    </div>
                )}

                {transportData.routes && transportData.routes.map((route, i) => (
                    <div key={i} style={{ 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '12px', 
                        padding: '16px',
                        marginBottom: i < (transportData.routes?.length || 0) - 1 ? '16px' : '0',
                        background: 'var(--bg-color)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        {/* Header: Origen -> Destino */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ color: 'var(--primary-color)' }}>
                                {route.mode === 'boat' ? <IconShip size={24} color="var(--primary-color)" /> : <IconBus size={24} color="var(--primary-color)" />}
                            </div>
                            <div style={{ flex: 1, fontWeight: 'bold', color: 'var(--text-color)', fontSize: '1.1rem' }}>
                                {route.origin} ➔ {route.destination}
                            </div>
                            {route.price && (
                                <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    {route.price}
                                </div>
                            )}
                        </div>

                        {/* Próxima Salida Destacada */}
                        <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '12px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                Próxima salida
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', lineHeight: 1 }}>
                                {route.nextDeparture || '--:--'}
                            </div>
                        </div>

                        {/* Siguientes Salidas */}
                        {route.upcomingDepartures && route.upcomingDepartures.length > 0 && (
                            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Siguientes:</div>
                                {route.upcomingDepartures.map((time, j) => (
                                    <div key={j} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '600', border: '1px solid var(--border-color)' }}>
                                        {time}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Footer si no hay próximas salidas */}
                        {!route.nextDeparture && (!route.upcomingDepartures || route.upcomingDepartures.length === 0) && (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '8px' }}>
                                No hay más salidas programadas para hoy.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </CardWrapper>
    );
};
