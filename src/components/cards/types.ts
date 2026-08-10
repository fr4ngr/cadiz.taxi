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
            durationText: string; // ej. "35 min"
            durationValue: number; // en segundos
            distanceText?: string; // ej. "42 km"
            trafficCondition?: 'good' | 'moderate' | 'heavy'; // solo para coche
            nextDeparture?: string; // solo para transporte público
            price?: string;
        }>;
    };
    places?: any[];
}
