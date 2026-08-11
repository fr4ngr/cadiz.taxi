export interface CardData {
    cardType: 'HeroCard' | 'ListCard' | 'BusinessCard' | 'ArticleCard' | 'AlertCard' | 'NavigationCard' | 'ProductCard' | 'ProfileCard' | 'MapCard' | 'GalleryCard' | 'ReservationCard' | 'ElectricityCard' | 'TransportCard' | 'RouteCard' | string;
    title?: string;
    subtitle?: string;
    content?: string;
    badge?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonAction?: string;
    buttonUrl?: string;
    listItems?: Array<{ title: string; subtitle?: string; icon?: string }>;
    contactName?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    website?: string;
    lat?: number | string;
    lon?: number | string;
    stopName?: string;
    suggestedBlocks?: string[];
    price?: string;
    oldPrice?: string;
    locationTitle?: string;
    imageUrls?: string[];
    electricityData?: string; // JSON stringificado con los datos de las horas
    sunsetData?: {
        sunrise: string;
        sunset: string;
    };
    historicalComparison?: {
        percentChange: number;
    };
    transportData?: {
        routes?: Array<{
            mode: 'bus' | 'boat' | 'train';
            origin: string;
            destination: string;
            nextDeparture: string | null; // e.g. "13:45"
            upcomingDepartures: string[]; // e.g. ["14:30", "15:15"]
            price?: string;
            delay?: number; // en minutos
            status?: 'canceled' | 'on_time' | 'delayed';
        }>;
        alert?: {
            title: string;
            description: string;
            type: 'warning' | 'error' | 'info';
        };
    };
    routeData?: {
        origin: string;
        destination: string;
        options: Array<{
            mode: 'car' | 'bus' | 'train' | 'boat';
            durationText: string; // e.g. "25 min"
            durationValue: number; // in seconds
            distanceText?: string; // e.g. "30 km"
            nextDeparture?: string; // Next departure, e.g. "13:45"
            nextDepartures?: string[]; // Upcoming departures
            trafficCondition?: 'good' | 'moderate' | 'heavy';
            details?: {
                lineCode: string;
                stops: Array<{ name: string; isOrigin?: boolean; isDest?: boolean }>;
                schedules: Array<{ time: string; isPast: boolean }>;
            };
        }>;
    };
    places?: any[];
}
