

async function testRoutes() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.error("Missing GOOGLE_MAPS_API_KEY in .env");
        return;
    }

    const origin = "Cádiz, Spain";
    const destination = "Jerez de la Frontera, Spain";

    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        },
        body: JSON.stringify({
            origin: { address: origin },
            destination: { address: destination },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
            computeAlternativeRoutes: false
        })
    });

    if (!response.ok) {
        console.error("Error:", response.status, await response.text());
        return;
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testRoutes().catch(console.error);
