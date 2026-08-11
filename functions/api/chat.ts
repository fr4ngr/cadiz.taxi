import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { brains, systemPromptA, systemPromptB, abConfig } from './compiled-brains';

function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return Math.abs(hash);
}

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const userMessage = body.message;
        const sessionId = body.sessionId || 'anonymous';
        const userCity = body.city || null;
        const userProfile = body.userProfile || 'desconocido';
        
        // A/B Testing Assignment
        let activeVariant = 'A';
        let activeSystemPrompt = systemPromptA;
        if (abConfig && abConfig.active) {
            const hashVal = hashCode(sessionId) % 100;
            if (hashVal >= abConfig.trafficA) {
                activeVariant = 'B';
                activeSystemPrompt = systemPromptB || systemPromptA;
            }
        }
        
        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing key. Available env keys: " + Object.keys(env).join(", ") }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

        // ----------------------------------------------------
        // RAG VECTOR SEARCH (Cloudflare Vectorize)
        // ----------------------------------------------------
        let cerebrosXml = "";
        let cerebrosFiltrados = [];
        try {
            const aiEmbedding = await env.AI.run('@cf/baai/bge-large-en-v1.5', { text: [userMessage] });
            const vector = aiEmbedding.data[0];

            const vecMatches = await env.VECTORIZE_INDEX.query(vector, { topK: 3 });
            
            if (vecMatches && vecMatches.matches && vecMatches.matches.length > 0) {
                const matchIds = vecMatches.matches.map(m => m.id);
                const placeholders = matchIds.map(() => '?').join(',');
                const query = `SELECT * FROM knowledge_base WHERE id IN (${placeholders})`;
                const dbResults = await env.DB.prepare(query).bind(...matchIds).all();
                
                if (dbResults && dbResults.results) {
                    cerebrosFiltrados = dbResults.results;
                    cerebrosXml = cerebrosFiltrados.map(b => `
<cerebro materia="${b.materia}" tipo="${b.tipo}" documento="${b.id}">
${b.content}
</cerebro>
`).join('');
                }
            }
        } catch (ragError) {
            console.error("Error en RAG Vectorize:", ragError);
        }

        const userCityContext = userCity ? `<contexto_usuario>\nEl usuario ha configurado explícitamente su ciudad actual como: ${userCity}. Prioriza y orienta tus recomendaciones a esta ciudad si es relevante.\n</contexto_usuario>\n` : "";
        const systemInstruction = (activeSystemPrompt || "Eres un asistente.").replace('{{CEREBROS_INJECTION_POINT}}', `<cerebros_activos>\n${cerebrosXml}\n</cerebros_activos>\n${userCityContext}`);

        const schema = {
            type: SchemaType.OBJECT,
            properties: {
                cardType: {
                    type: SchemaType.STRING,
                    enum: ['TextCard', 'MapCard', 'NavigationCard', 'GalleryCard', 'HeroCard', 'ListCard', 'BusinessCard', 'ArticleCard', 'AlertCard', 'ProductCard', 'ProfileCard', 'ElectricityCard'],
                    description: "El tipo de tarjeta visual a mostrar."
                },
                content: {
                    type: SchemaType.STRING,
                    description: "Mensaje principal del asistente."
                },
                badge: { type: SchemaType.STRING, description: "Etiqueta superior (ej. '🏛️ Historia', '⚠️ Alerta')." },
                title: { type: SchemaType.STRING, description: "Título principal de la tarjeta." },
                subtitle: { type: SchemaType.STRING, description: "Subtítulo o texto secundario corto." },
                imageUrl: { type: SchemaType.STRING, description: "URL de una imagen principal (para HeroCard, ProductCard, ProfileCard)." },
                imageUrls: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Lista de URLs de imágenes (para GalleryCard)." },
                listItems: { 
                    type: SchemaType.ARRAY, 
                    items: { 
                        type: SchemaType.OBJECT, 
                        properties: { 
                            title: { type: SchemaType.STRING }, 
                            subtitle: { type: SchemaType.STRING },
                            icon: { type: SchemaType.STRING }
                        },
                        required: ["title"]
                    }, 
                    description: "Elementos de una lista (para ListCard)." 
                },
                lat: { type: SchemaType.STRING, description: "Latitud exacta (MapCard, NavigationCard)." },
                lon: { type: SchemaType.STRING, description: "Longitud exacta (MapCard, NavigationCard)." },
                locationTitle: { type: SchemaType.STRING, description: "Nombre del lugar (MapCard, NavigationCard)." },
                price: { type: SchemaType.STRING, description: "Precio actual (ProductCard, BusinessCard)." },
                oldPrice: { type: SchemaType.STRING, description: "Precio anterior tachado (ProductCard)." },
                contactName: { type: SchemaType.STRING, description: "Nombre del contacto (BusinessCard, ProfileCard)." },
                phoneNumber: { type: SchemaType.STRING, description: "Teléfono (BusinessCard, ProfileCard)." },
                whatsappNumber: { type: SchemaType.STRING, description: "WhatsApp (BusinessCard, ProfileCard)." },
                email: { type: SchemaType.STRING, description: "Email (BusinessCard, ProfileCard)." },
                website: { type: SchemaType.STRING, description: "URL de la página web (BusinessCard)." },
                buttonText: { type: SchemaType.STRING, description: "Texto del botón principal." },
                buttonAction: { type: SchemaType.STRING, description: "Comando o prompt interno a enviar cuando se hace clic en el botón." },
                intentCategory: {
                    type: SchemaType.STRING,
                    description: "Categoría de la intención del usuario. OBLIGATORIO.",
                    enum: ["Gastronomia", "Transporte y movilidad", "Alojamiento", "Clima", "Playas", "Zonas verdes", "Bahía", "Deporte", "Belleza", "Eventos-Agenda", "Compras", "Kids", "Mascotas", "Caravana", "Inclusivo", "Love", "Social-Sostenible", "Iglesias", "Catedral", "La Caleta", "Historia", "Arte", "Crucerista", "Flamencos", "Ocio", "Otros"]
                },
                suggestedBlocks: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.STRING
                    },
                    description: "1 a 3 bloques sugeridos para guiar al usuario hacia la conversión."
                }
            },
            required: ['cardType', 'content', 'suggestedBlocks', 'intentCategory']
        };

        // Injecting the Profile into the prompt
        let finalSystemPrompt = systemInstruction;
        if (userProfile && userProfile !== 'desconocido') {
            finalSystemPrompt += `\n\n<GADITAN_PROFILE>\nEl usuario actual se ha identificado como: **${userProfile.toUpperCase()}**.\nAdapta tus respuestas, recomendaciones y tono a este perfil. Por ejemplo, si es Turista recomiéndale básicos; si es Gaditano, cosas locales o avanzadas; si es Negocio, facilítale opciones profesionales.\n</GADITAN_PROFILE>`;
        }

        const today = new Date();
        const dateString = today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Madrid' });
        finalSystemPrompt += `\n\n<FECHA_ACTUAL>\nHoy es ${dateString}. Usa esta fecha EXACTA como referencia absoluta para responder preguntas sobre "hoy", "mañana" o eventos próximos.\n</FECHA_ACTUAL>`;

        const clientContext = body.clientContext || null;
        if (clientContext) {
            let contextStr = `\n\n<HIPERSEGMENTACION_CONTEXTO>\n`;
            contextStr += `INFORMACION OBTENIDA IMPLICITAMENTE DEL DISPOSITIVO DEL USUARIO (NO REQUIERE COOKIES):\n`;
            if (clientContext.geo) {
                contextStr += `- Ubicación detectada (IP): ${clientContext.geo.city || 'Desconocida'}, ${clientContext.geo.region || ''}, ${clientContext.geo.country || ''}\n`;
                contextStr += `- Zona horaria: ${clientContext.geo.timezone || 'Desconocida'}\n`;
                contextStr += `- Proveedor (ASN): ${clientContext.geo.asn || 'Desconocido'}\n`;
            }
            if (clientContext.userAgent) {
                const ua = clientContext.userAgent.toLowerCase();
                const device = ua.includes('mobile') ? 'Móvil' : 'Escritorio';
                const os = ua.includes('iphone') || ua.includes('mac') ? 'Apple/iOS' : ua.includes('windows') ? 'Windows' : ua.includes('android') ? 'Android' : 'Otro';
                contextStr += `- Dispositivo: ${device} (${os})\n`;
            }
            if (clientContext.browser) {
                const b = clientContext.browser;
                contextStr += `- Idioma del navegador: ${b.language || 'desconocido'} (todos: ${b.languages || b.language})\n`;
                contextStr += `- Pantalla: ${b.screenWidth}x${b.screenHeight} (densidad: ${b.devicePixelRatio}x)\n`;
                contextStr += `- Táctil: ${b.touchScreen ? 'Sí (móvil/tablet)' : 'No (ratón/trackpad)'}\n`;
                contextStr += `- Modo oscuro: ${b.darkMode ? 'Sí' : 'No'}\n`;
                if (b.connection) {
                    contextStr += `- Conexión: ${b.connection.type || '?'} (${b.connection.downlink || '?'} Mbps)\n`;
                }
                contextStr += `- Llegó desde: ${b.referrer || 'directo (escribió la URL)'}\n`;
                contextStr += `- Hora local del usuario: ${b.localHour}:00 (${b.localDay})\n`;
            }
            contextStr += `\nINSTRUCCIONES DE HIPERSEGMENTACIÓN:
- Usa estos datos DISCRETAMENTE para personalizar tus respuestas desde el PRIMER mensaje.
- Si el idioma del navegador NO es español, saluda en su idioma y ofrécete a hablar en ese idioma.
- Si la hora local es de mañana (6-12), saluda con "Buenos días". Si es tarde (12-20), "Buenas tardes". Si es noche (20-6), "Buenas noches".
- Si el usuario está en una ciudad de la provincia de Cádiz, menciónala sutilmente en tu saludo (ej: "desde ${clientContext.geo?.city || 'ahí'}").
- Si viene desde un buscador (Google), asume que busca información turística.
- Si está en móvil con pantalla táctil, prioriza respuestas cortas y accionables.
- NUNCA reveles que tienes estos datos ni menciones "hipersegmentación" o "fingerprint".\n</HIPERSEGMENTACION_CONTEXTO>`;
            finalSystemPrompt += contextStr;
        }

        // Construir la estructura final que Gemini espera
        let apiHistory: any[] = [];
        if (finalSystemPrompt) {
            apiHistory.push({ role: 'user', parts: [{ text: finalSystemPrompt }] });
            apiHistory.push({ role: 'model', parts: [{ text: 'Entendido. Actuaré según las directrices y el esquema JSON establecido, considerando el perfil del usuario.' }] });
        }

        let historyContents = body.history && body.history.length > 0 ? body.history : [{ role: 'user', parts: [{ text: userMessage }] }];
        historyContents = [...apiHistory, ...historyContents];
        const inputType = body.inputType || 'typed';

        const beachTool = {
            functionDeclarations: [{
                name: "get_beach_conditions",
                description: "Llama a esta función EXCLUSIVAMENTE cuando el usuario te pregunte explícitamente por el clima, el tiempo o el estado de las PLAYAS (ej. 'cómo está la playa', 'hace día de playa en la caleta', 'estado de las olas'). Devuelve datos reales de AEMET (temperatura del agua, oleaje, viento, sensación térmica). NO la llames para saludos genéricos.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        beach_id: {
                            type: SchemaType.STRING,
                            description: "El ID de la playa a consultar. Usa '1101201' si preguntan por La Caleta. Usa '1101203' si preguntan por La Victoria, Cortadura, Santa Maria del Mar, o por las playas de Cádiz en general."
                        }
                    },
                    required: ["beach_id"]
                }
            }]
        };

        const transportTool = {
            functionDeclarations: [{
                name: "get_transport_schedule",
                description: "Llama a esta función EXCLUSIVAMENTE cuando el usuario pregunte por horarios, próximas salidas o tiempos de espera de transporte público metropolitano desde o hacia Cádiz o el Campo de Gibraltar (ej. 'cuándo sale el catamarán', 'autobús a San Fernando', 'bus a Chiclana', 'horario al cementerio mancomunado', 'autobus de Tarifa', 'bus de Algeciras'). Devuelve las próximas salidas reales del Consorcio de Transportes.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        route: {
                            type: SchemaType.STRING,
                            description: "La ruta solicitada. Debe ser uno de los siguientes valores exactos: 'catamaran_puerto', 'catamaran_rota', 'bus_sanfernando', 'bus_chiclana', 'bus_puertoreal', 'bus_cementerio_ida', 'bus_cementerio_vuelta', 'bus_algeciras', 'bus_lalinea', 'bus_tarifa'."
                        }
                    },
                    required: ["route"]
                }
            }]
        };

        const newsTool = {
            functionDeclarations: [{
                name: "get_latest_news",
                description: "Llama a esta función cuando el usuario pregunte por noticias recientes, actualidad o qué ha pasado hoy. IMPORTANTE: Si el usuario pregunta por una zona amplia (ej. 'Sierra de Cádiz', 'Campo de Gibraltar', 'Costa') o un pueblo específico, deja 'municipio' como 'all' y FILTRA TÚ MISMO las noticias en tu respuesta final basándote en la zona pedida.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        municipio: {
                            type: SchemaType.STRING,
                            description: "Filtra las noticias por municipio exacto de Cádiz (ej. 'Cádiz', 'Jerez de la Frontera', 'Chiclana de la Frontera'). Si el usuario pide una comarca (ej. Sierra), un pueblo sin sección propia, o toda la provincia, usa 'all'."
                        },
                        categoria: {
                            type: SchemaType.STRING,
                            description: "Filtra por categoría si el usuario pide algo específico (ej. 'deporte', 'cultura', 'sucesos', 'politica', 'economia', 'salud'). Si no, usa 'all'."
                        }
                    }
                }
            }]
        };

        const eventsTool = {
            functionDeclarations: [{
                name: "get_official_events",
                description: "Llama a esta función SIEMPRE que el usuario pregunte por la agenda cultural, eventos, exposiciones, actividades, talleres o planes en cualquier lugar de la provincia (incluyendo pueblos específicos, la 'Sierra de Cádiz', la 'Bahía', etc.). Pide siempre la provincia completa y luego TÚ filtra los resultados en tu respuesta basándote en la zona que pidió el usuario. Devuelve eventos activos o futuros.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        provincia: {
                            type: SchemaType.STRING,
                            description: "Provincia a consultar, por defecto 'Cádiz'."
                        }
                    }
                }
            }]
        };

        const gasTool = {
            functionDeclarations: [{
                name: "get_gas_prices",
                description: "Llama a esta función EXCLUSIVAMENTE cuando el usuario pregunte por precios de gasolina, diésel, gasolineras baratas o dónde repostar combustible en la provincia. Devuelve el Top 5 de las gasolineras más baratas para ese combustible en la localidad.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        municipio: {
                            type: SchemaType.STRING,
                            description: "Municipio exacto de Cádiz (ej. 'Jerez de la Frontera', 'Cádiz', 'Chiclana de la Frontera', 'San Fernando', 'El Puerto de Santa María', 'Algeciras'). Si el usuario pide toda la provincia, usa 'all'."
                        },
                        tipo_combustible: {
                            type: SchemaType.STRING,
                            description: "Tipo de combustible a buscar. Valores permitidos: 'Gasolina 95 E5', 'Gasolina 98 E5', 'Gasoleo A', 'Gasoleo Premium', 'Gases licuados del petróleo'. Por defecto usa 'Gasolina 95 E5' si no se especifica."
                        }
                    },
                    required: ["municipio", "tipo_combustible"]
                }
            }]
        };

        const electricityTool = {
            functionDeclarations: [{
                name: "get_electricity_prices",
                description: "Llama a esta función cuando el usuario pregunte por el precio de la luz de hoy, a qué hora es más barata o más cara, o por los tramos horarios (PVPC). No necesita parámetros.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        dummy: {
                            type: SchemaType.STRING,
                            description: "Parámetro vacío."
                        }
                    }
                }
            }]
        };

        let responseText = '';
        let currentModel = 'gemini-2.5-flash';
        let latencyMs = 0;
        let tokensUsed = 0;
        const startTime = Date.now();

        // ----------------------------------------------------
        // 0. FAST-PATH INTENT ROUTER (Bypasses Gemini entirely for zero-latency)
        // ----------------------------------------------------
        const msgLower = userMessage.toLowerCase().trim();
        const isTransportQuery = msgLower.includes('bus') || msgLower.includes('autobús') || msgLower.includes('autobuses') || msgLower.includes('catamaran') || msgLower.includes('catamarán') || msgLower.includes('barco') || msgLower.includes('barquito') || msgLower.includes('horario') || msgLower.includes('salidas') || msgLower.includes('líneas') || msgLower.includes('lineas') || msgLower.includes('tren') || msgLower.includes('renfe') || msgLower.includes('cercan') || msgLower.includes('trambahia') || msgLower.includes('trambahía');
        const isRoutingQuery = msgLower.includes('como ir') || msgLower.includes('cómo ir') || msgLower.includes('ruta') || msgLower.includes('alternativa');
        const isBeachQuery = msgLower.includes('playa') || msgLower.includes('caleta') || msgLower.includes('victoria') || msgLower.includes('cortadura') || msgLower.includes('santa maría') || msgLower.includes('oleaje') || msgLower.includes('olas');

        if (isTransportQuery || isRoutingQuery || isBeachQuery) {
            try {
                if (isTransportQuery || isRoutingQuery) {
                    const destinationsToSearch = [];
                    if (msgLower.includes('rota')) destinationsToSearch.push({ route: 'catamaran_rota', idParada: 193, consorcioId: 2, targetDestino: 'Rota', name: '🚢 Catamarán a Rota' });
                    if (msgLower.includes('puerto')) destinationsToSearch.push({ route: 'catamaran_puerto', idParada: 193, consorcioId: 2, targetDestino: 'El Puerto', name: '🚢 Catamarán a El Puerto' });
                    if (msgLower.includes('san fernando') || msgLower.includes('la isla')) destinationsToSearch.push({ route: 'bus_sanfernando', idParada: 300, consorcioId: 2, targetDestino: 'San Fernando', name: '🚌 Autobús a San Fernando' });
                    if (msgLower.includes('chiclana')) destinationsToSearch.push({ route: 'bus_chiclana', idParada: 300, consorcioId: 2, targetDestino: 'Chiclana', name: '🚌 Autobús a Chiclana' });
                    if (msgLower.includes('puerto real')) destinationsToSearch.push({ route: 'bus_puertoreal', idParada: 300, consorcioId: 2, targetDestino: 'Puerto Real', name: '🚌 Autobús a Puerto Real' });
                    if (msgLower.includes('cementerio')) {
                        if (msgLower.includes('vuelta') || msgLower.includes('regreso') || msgLower.includes('volver')) {
                            destinationsToSearch.push({ route: 'bus_cementerio_vuelta', idParada: 56, consorcioId: 2, targetDestino: 'Cádiz', name: '🚌 Autobús Cementerio ➔ Cádiz' });
                        } else {
                            destinationsToSearch.push({ route: 'bus_cementerio_ida', idParada: 300, consorcioId: 2, targetDestino: 'Cementerio', name: '🚌 Autobús Cádiz ➔ Cementerio' });
                        }
                    }
                    if (msgLower.includes('algeciras')) destinationsToSearch.push({ route: 'bus_algeciras', idParada: 1, consorcioId: 5, targetDestino: 'Algeciras', name: '🚌 Autobús a Algeciras' });
                    if (msgLower.includes('linea') || msgLower.includes('línea')) destinationsToSearch.push({ route: 'bus_lalinea', idParada: 116, consorcioId: 5, targetDestino: 'La Línea', name: '🚌 Autobús a La Línea' });
                    if (msgLower.includes('tarifa')) destinationsToSearch.push({ route: 'bus_tarifa', idParada: 143, consorcioId: 5, targetDestino: 'Tarifa', name: '🚌 Autobús a Tarifa' });

                    const transportRoutes = [];

                    if (isRoutingQuery || msgLower.includes('tren') || msgLower.includes('renfe') || msgLower.includes('cercan') || msgLower.includes('trambahia') || msgLower.includes('trambahía')) {
                        let originStr = 'cádiz';
                        let destStr = 'jerez';
                        if (msgLower.includes('san fernando') || msgLower.includes('isla')) destStr = 'san fernando-bahía sur';
                        else if (msgLower.includes('puerto real') || msgLower.includes('universidad')) destStr = 'puerto real';
                        else if (msgLower.includes('puerto')) destStr = 'puerto de santa maría';
                        else if (msgLower.includes('chiclana') || msgLower.includes('pelagatos')) destStr = 'pelagatos';
                        else if (msgLower.includes('aeropuerto')) destStr = 'aeropuerto de jerez';
                        
                        if (env.ASSETS) {
                            try {
                                const renfeReq = new Request(new URL('/data/renfe_cadiz.json', request.url));
                                const renfeRes = await env.ASSETS.fetch(renfeReq);
                                if (renfeRes.ok) {
                                    const renfeData = await renfeRes.json();
                                    let originId, destId;
                                    let originName = originStr, destName = destStr;
                                    for (const [id, stop] of Object.entries(renfeData.stops)) {
                                        if (stop.name.toLowerCase().includes(originStr.toLowerCase())) { originId = id; originName = stop.name; }
                                        if (stop.name.toLowerCase().includes(destStr.toLowerCase())) { destId = id; destName = stop.name; }
                                    }
                                    
                                    if (originId && destId) {
                                        let upcoming = [];
                                        const formatter = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false });
                                        const nowStr = formatter.format(new Date());
                                        const madridDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
                                        const dayOfWeek = madridDate.getDay() === 0 ? 6 : madridDate.getDay() - 1;
                                        
                                        for (const trip of renfeData.trips) {
                                            const cal = renfeData.calendar[trip.s];
                                            if (cal && cal.days[dayOfWeek] === 1) {
                                                const oIdx = trip.st.findIndex(s => s[0] === originId);
                                                const dIdx = trip.st.findIndex(s => s[0] === destId);
                                                if (oIdx !== -1 && dIdx !== -1 && oIdx < dIdx) {
                                                    const time = trip.st[oIdx][1];
                                                    if (time >= nowStr) upcoming.push({ time, tripId: trip.t });
                                                }
                                            }
                                        }
                                        
                                        upcoming.sort((a, b) => a.time.localeCompare(b.time));
                                        const rtRes = await fetch("https://gtfsrt.renfe.com/trip_updates.json", { signal: AbortSignal.timeout(3000) }).catch(() => null);
                                        let rtData = null;
                                        if (rtRes && rtRes.ok) rtData = await rtRes.json();
                                        
                                        let nextDeparture = null, nextDelay = null, nextStatus = null;
                                        const upcomingDepartures = [];
                                        
                                        for (let i = 0; i < Math.min(upcoming.length, 4); i++) {
                                            const u = upcoming[i];
                                            let delay = null;
                                            let status = 'on_time';
                                            if (rtData && rtData.entity) {
                                                const rtEntity = rtData.entity.find(e => e.id === 'TUUPDATE_' + u.tripId);
                                                if (rtEntity && rtEntity.tripUpdate) {
                                                    if (rtEntity.tripUpdate.trip && rtEntity.tripUpdate.trip.scheduleRelationship === 'CANCELED') status = 'canceled';
                                                    if (rtEntity.tripUpdate.delay) {
                                                        delay = Math.round(rtEntity.tripUpdate.delay / 60);
                                                        if (delay > 0) status = 'delayed';
                                                    }
                                                }
                                            }
                                            if (i === 0) {
                                                nextDeparture = u.time; nextDelay = delay; nextStatus = status;
                                            } else {
                                                upcomingDepartures.push(u.time);
                                            }
                                        }
                                        
                                        if (nextDeparture) {
                                            transportRoutes.push({ mode: 'train', origin: originName, destination: destName, nextDeparture, upcomingDepartures, delay: nextDelay, status: nextStatus });
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error("Error cargando Renfe:", e);
                            }
                        }
                    }

                    if (destinationsToSearch.length > 0) {
                        for (const item of destinationsToSearch) {
                            const cacheKey = `transport_${item.consorcioId}_${item.idParada}`;
                            const cacheResult = await env.DB.prepare('SELECT value, updated_at FROM system_cache WHERE key = ?').bind(cacheKey).first();
                            
                            let servicios = null;
                            if (cacheResult && cacheResult.value) {
                                servicios = JSON.parse(cacheResult.value);
                            } else {
                                const res = await fetch(`http://api.ctan.es/v1/Consorcios/${item.consorcioId}/paradas/${item.idParada}/servicios`, { signal: AbortSignal.timeout(4000) }).catch(() => null);
                                if (res && res.ok) {
                                    const json = await res.json();
                                    if (json && json.servicios) {
                                        servicios = json.servicios;
                                        context.waitUntil(env.DB.prepare(`
                                            INSERT INTO system_cache (key, value) VALUES (?, ?)
                                            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
                                        `).bind(cacheKey, JSON.stringify(servicios)).run());
                                    }
                                }
                            }
                            
                            if (servicios) {
                                const formatter = new Intl.DateTimeFormat("es-ES", {
                                    timeZone: "Europe/Madrid",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                });
                                const nowMadrid = formatter.format(new Date()).trim();
                                let upcoming = servicios.filter(s => s.servicio && s.servicio >= nowMadrid);
                                if (item.targetDestino) {
                                    upcoming = upcoming.filter(s => s.destino && s.destino.toLowerCase().includes(item.targetDestino.toLowerCase()));
                                }
                                
                                const nextDeparture = upcoming.length > 0 ? upcoming[0].servicio : null;
                                const upcomingDepartures = upcoming.slice(1, 4).map(s => s.servicio);
                                
                                const originName = item.idParada === 300 ? 'Cádiz' : (item.idParada === 193 ? 'Cádiz (Terminal)' : (item.idParada === 1 ? 'Algeciras' : `Parada ${item.idParada}`));
                                
                                transportRoutes.push({
                                    mode: item.route.startsWith('catamaran') ? 'boat' : 'bus',
                                    origin: originName,
                                    destination: item.targetDestino,
                                    nextDeparture,
                                    upcomingDepartures
                                });
                            }
                        }
                    }

                    if (transportRoutes.length > 0) {
                        let finalCardType = isRoutingQuery ? 'RouteCard' : 'TransportCard';
                        let finalContent = `He consultado los horarios en tiempo real. Aquí tienes las próximas salidas disponibles:`;
                        
                        let parsedData: any = {
                            cardType: finalCardType,
                            content: finalContent,
                            intentCategory: 'Transporte y movilidad',
                            suggestedBlocks: ['¿Qué tiempo hace en La Caleta?', 'Ver paradas en el mapa', '¿Cómo ir a San Fernando?']
                        };

                        if (isRoutingQuery && env.GOOGLE_MAPS_API_KEY) {
                            // Convert transit routes to route options
                            const options = transportRoutes.map(tr => ({
                                mode: tr.mode,
                                durationText: tr.mode === 'train' ? '40 min' : '50 min', // Approx
                                durationValue: tr.mode === 'train' ? 2400 : 3000,
                                nextDeparture: tr.nextDeparture,
                                price: tr.mode === 'train' ? '4.10€' : '2.50€'
                            }));

                            // Fetch car route
                            const target = transportRoutes[0].destination;
                            const originStr = "Cádiz, Spain";
                            const destStr = `${target}, Cádiz, Spain`;

                            try {
                                const googleRes = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-Goog-Api-Key': env.GOOGLE_MAPS_API_KEY,
                                        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
                                    },
                                    body: JSON.stringify({
                                        origin: { address: originStr },
                                        destination: { address: destStr },
                                        travelMode: 'DRIVE',
                                        routingPreference: 'TRAFFIC_AWARE',
                                        computeAlternativeRoutes: false
                                    })
                                });

                                if (googleRes.ok) {
                                    const googleData = await googleRes.json();
                                    if (googleData.routes && googleData.routes.length > 0) {
                                        const route = googleData.routes[0];
                                        const durSecs = parseInt(route.duration.replace('s', ''));
                                        const distKm = (route.distanceMeters / 1000).toFixed(1);
                                        
                                        options.push({
                                            mode: 'car',
                                            durationText: `${Math.round(durSecs / 60)} min`,
                                            durationValue: durSecs,
                                            distanceText: `${distKm} km`,
                                            trafficCondition: durSecs > 3000 ? 'heavy' : (durSecs > 2100 ? 'moderate' : 'good')
                                        });
                                    }
                                }
                            } catch(e) {
                                console.error("Error fetching Google Maps:", e);
                            }

                            parsedData.routeData = {
                                origin: 'Cádiz',
                                destination: target,
                                options: options
                            };
                            parsedData.content = `Aquí tienes una comparativa de las mejores alternativas para ir a ${target} en tiempo real:`;
                        } else {
                            parsedData.transportData = { routes: transportRoutes };
                        }

                        if (env.DB) {
                            context.waitUntil(env.DB.prepare(
                                "INSERT INTO chat_logs (user_message, bot_response, intent_category, latency_ms, tokens_used, brains_injected, input_type, ab_variant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
                            ).bind(userMessage, parsedData.content, 'Transporte y movilidad', Date.now() - startTime, 0, 'Fast-Path Local', 'typed', activeVariant).run().catch(console.error));
                        }

                        return new Response(JSON.stringify(parsedData), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                } else if (isBeachQuery) {
                    let beachId = '1101203'; // Playa Victoria/Cortadura por defecto
                    if (msgLower.includes('caleta')) beachId = '1101201';
                    
                    const cacheKey = `beach_${beachId}`;
                    const cacheResult = await env.DB.prepare('SELECT value FROM system_cache WHERE key = ?').bind(cacheKey).first();
                    
                    if (cacheResult && cacheResult.value) {
                        const data = JSON.parse(cacheResult.value);
                        const parsedData = {
                            cardType: 'TextCard',
                            badge: '🌊 Clima de Playas',
                            title: `Estado de la Playa: ${data.nombre}`,
                            content: `Aquí tienes las condiciones actuales en **${data.nombre}**:\n\n` +
                                     `• **Cielo:** ${data.estadoCielo || 'N/A'}\n` +
                                     `• **Viento:** ${data.viento || 'N/A'}\n` +
                                     `• **Oleaje:** ${data.oleaje || 'N/A'}\n` +
                                     `• **Temp. Agua:** ${data.temperaturaAgua || 'N/A'}\n` +
                                     `• **Sensación:** ${data.sensacionTermica || 'N/A'}\n` +
                                     `• **Índice UV:** ${data.uvMax || 'N/A'}\n\n` +
                                     `*Fuente: AEMET (Caché Rápida D1)*`,
                            intentCategory: 'Playas',
                            suggestedBlocks: ['Horario bus a San Fernando', 'Qué ver en Cádiz']
                        };

                        if (env.DB) {
                            context.waitUntil(env.DB.prepare(
                                "INSERT INTO chat_logs (user_message, bot_response, intent_category, latency_ms, tokens_used, brains_injected, input_type, ab_variant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
                            ).bind(userMessage, parsedData.content, 'Playas', Date.now() - startTime, 0, 'Fast-Path Local', 'typed', activeVariant).run().catch(console.error));
                        }

                        return new Response(JSON.stringify(parsedData), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                }
            } catch (fastPathErr) {
                console.error("Fallo en enrutador rápido (Fast-Path):", fastPathErr);
            }
        }

        try {
            let model = genAI.getGenerativeModel({
                model: currentModel,
                generationConfig: {
                    temperature: 0.1
                },
                tools: [beachTool, transportTool, newsTool, eventsTool, gasTool, electricityTool]
            });

            let response = await model.generateContent({
                contents: historyContents
            });

            // Handle Function Call
            if (response.response.functionCalls() && response.response.functionCalls().length > 0) {
                const call = response.response.functionCalls()[0];
                let toolResponseData = { error: "No se pudo obtener datos" };
                let toolCalled = true;

                if (call.name === 'get_beach_conditions') {
                    const beachId = call.args.beach_id || '1101203';
                    
                    try {
                        const cacheResult = await env.DB.prepare('SELECT value FROM system_cache WHERE key = ?').bind(`beach_${beachId}`).first();
                        if (cacheResult && cacheResult.value) {
                            toolResponseData = JSON.parse(cacheResult.value);
                            toolResponseData.fuente = "Caché Rápida (Cerebro B)";
                        } else {
                            const playaRes = await fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/playa/${beachId}/?api_key=${env.AEMET_API_KEY}`);
                            const playaJson = await playaRes.json();
                            if (playaJson.estado == 200 && playaJson.datos) {
                                const dataRes = await fetch(playaJson.datos);
                                const dataArr = await dataRes.json();
                                if (dataArr && dataArr[0] && dataArr[0].prediccion && dataArr[0].prediccion.dia) {
                                    const todayData = dataArr[0].prediccion.dia[0];
                                    toolResponseData = {
                                        nombre: dataArr[0].nombre,
                                        estadoCielo: todayData.estadoCielo ? todayData.estadoCielo.descripcion1 : "N/A",
                                        viento: todayData.viento ? todayData.viento.descripcion1 : "N/A",
                                        oleaje: todayData.oleaje ? todayData.oleaje.descripcion1 : "N/A",
                                        temperaturaAgua: todayData.tAgua ? `${todayData.tAgua.valor1}ºC` : "N/A",
                                        sensacionTermica: todayData.sTermica ? todayData.sTermica.descripcion1 : "N/A",
                                        uvMax: todayData.uvMax ? todayData.uvMax.valor1 : "N/A",
                                        fuente: "AEMET en vivo"
                                    };
                                }
                            }
                        }
                    } catch (e) {
                        console.error("AEMET Cache/API error:", e);
                    }
                } else if (call.name === 'get_transport_schedule') {
                    const route = call.args.route;
                    let idParada = null;
                    let consorcioId = 2; // Por defecto Bahía de Cádiz
                    let targetDestino = null;

                    if (route === 'catamaran_puerto') { idParada = 193; targetDestino = 'El Puerto'; }
                    else if (route === 'catamaran_rota') { idParada = 193; targetDestino = 'Rota'; }
                    else if (route === 'bus_sanfernando') { idParada = 300; targetDestino = 'San Fernando'; }
                    else if (route === 'bus_chiclana') { idParada = 300; targetDestino = 'Chiclana'; }
                    else if (route === 'bus_puertoreal') { idParada = 300; targetDestino = 'Puerto Real'; }
                    else if (route === 'bus_cementerio_ida') { idParada = 300; targetDestino = 'Cementerio'; }
                    else if (route === 'bus_cementerio_vuelta') { idParada = 56; targetDestino = 'Cádiz'; }
                    // Campo de Gibraltar
                    else if (route === 'bus_algeciras') { idParada = 1; consorcioId = 5; targetDestino = 'Algeciras'; }
                    else if (route === 'bus_lalinea') { idParada = 116; consorcioId = 5; targetDestino = 'La Línea'; }
                    else if (route === 'bus_tarifa') { idParada = 143; consorcioId = 5; targetDestino = 'Tarifa'; }
                    
                    if (idParada) {
                        try {
                            const cacheKey = `transport_${consorcioId}_${idParada}`;
                            const cacheResult = await env.DB.prepare('SELECT value, updated_at FROM system_cache WHERE key = ?').bind(cacheKey).first();
                            
                            let servicios = null;
                            let needsRevalidate = false;
                            
                            if (cacheResult && cacheResult.value) {
                                servicios = JSON.parse(cacheResult.value);
                                const updatedAt = new Date(cacheResult.updated_at).getTime();
                                // Si tiene más de 10 minutos se revalida
                                if (Date.now() - updatedAt > 10 * 60 * 1000) {
                                    needsRevalidate = true;
                                }
                            } else {
                                needsRevalidate = true;
                            }
                            
                            const revalidate = async () => {
                                try {
                                    const res = await fetch(`http://api.ctan.es/v1/Consorcios/${consorcioId}/paradas/${idParada}/servicios`, { signal: AbortSignal.timeout(5000) });
                                    if (res.ok) {
                                        const json = await res.json();
                                        if (json && json.servicios) {
                                            const upsertQuery = `
                                                INSERT INTO system_cache (key, value) 
                                                VALUES (?, ?)
                                                ON CONFLICT(key) DO UPDATE SET 
                                                    value = excluded.value, 
                                                    updated_at = CURRENT_TIMESTAMP;
                                            `;
                                            await env.DB.prepare(upsertQuery).bind(cacheKey, JSON.stringify(json.servicios)).run();
                                            return json.servicios;
                                        }
                                    }
                                } catch (err) {
                                    console.error("Error revalidando transportes en background:", err);
                                }
                                return null;
                            };
                            
                            if (needsRevalidate) {
                                if (servicios) {
                                    // SWR (Stale-While-Revalidate): devolvemos los datos cacheados y refrescamos en background
                                    context.waitUntil(revalidate());
                                } else {
                                    // Si no hay caché de ningún tipo, hacemos fetch síncrono
                                    servicios = await revalidate();
                                }
                            }
                            
                            if (servicios) {
                                const formatter = new Intl.DateTimeFormat("es-ES", {
                                    timeZone: "Europe/Madrid",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                });
                                const nowMadrid = formatter.format(new Date()).trim();
                                
                                // Filtrar viajes que sean a partir de la hora actual de Madrid
                                let upcoming = servicios.filter(s => s.servicio && s.servicio >= nowMadrid);
                                
                                if (targetDestino) {
                                    upcoming = upcoming.filter(s => s.destino && s.destino.toLowerCase().includes(targetDestino.toLowerCase()));
                                }
                                
                                toolResponseData = {
                                    ruta_solicitada: route,
                                    parada_origen: servicios[0] ? servicios[0].nombreParada || `Parada ${idParada}` : 'Desconocida',
                                    proximas_salidas: upcoming.slice(0, 3).map(s => ({
                                        hora: s.servicio,
                                        linea: s.linea,
                                        destino: s.destino,
                                        nombre_ruta: s.nombre
                                    })),
                                    fuente: needsRevalidate && !cacheResult ? "Consorcio de Transportes (Live)" : "Consorcio de Transportes (Caché D1)"
                                };
                            }
                        } catch(e) {
                            console.error("CTAN API error:", e);
                        }
                    }
                } else if (call.name === 'get_latest_news') {
                    const municipio = call.args.municipio || 'all';
                    const categoria = call.args.categoria || 'all';
                    
                    try {
                        const cacheResult = await env.DB.prepare('SELECT value FROM system_cache WHERE key = ?').bind('news_cadiz_v9').first();
                        if (cacheResult && cacheResult.value) {
                            const data = JSON.parse(cacheResult.value);
                            let items = data.items || [];
                            
                            if (municipio !== 'all') items = items.filter(i => i.municipio === municipio);
                            if (categoria !== 'all') items = items.filter(i => i.categoria === categoria);
                            
                            toolResponseData = {
                                resumen_noticias: items.slice(0, 15).map(i => `[${i.fuente}] ${i.titulo} (${i.hace})`).join('\n'),
                                total_encontradas: items.length,
                                aviso: "Responde de forma conversacional destacando lo más importante. Ofrece más detalles si el usuario lo pide."
                            };
                        } else {
                            toolResponseData = { error: "Las noticias aún no se han sincronizado en caché." };
                        }
                    } catch (e) {
                        console.error("Error obteniendo noticias para IA:", e);
                    }
                } else if (call.name === 'get_official_events') {
                    const provincia = call.args.provincia || 'Cádiz';
                    try {
                        const url = new URL(request.url);
                        const eventsRes = await fetch(`${url.protocol}//${url.host}/api/events?provincia=${encodeURIComponent(provincia)}`);
                        if (eventsRes.ok) {
                            toolResponseData = await eventsRes.json();
                            
                            // Buscar también en prensa (RSS) para rellenar los huecos
                            try {
                                const cacheResult = await env.DB.prepare('SELECT value FROM system_cache WHERE key = ?').bind('news_cadiz_v9').first();
                                if (cacheResult && cacheResult.value) {
                                    const data = JSON.parse(cacheResult.value);
                                    let items = data.items || [];
                                    const keywords = ['concierto', 'festival', 'actuación', 'actuacion', 'teatro', 'agenda', 'exposición', 'exposicion', 'entradas', 'cartel', 'musical'];
                                    
                                    const newsEvents = items.filter(i => {
                                        const text = (i.titulo + ' ' + (i.descripcion || '')).toLowerCase();
                                        return keywords.some(kw => text.includes(kw));
                                    });
                                    
                                    if (newsEvents.length > 0) {
                                        toolResponseData.eventos_en_prensa = newsEvents.slice(0, 15).map(i => `[${i.fuente}] ${i.titulo}`);
                                        toolResponseData.instruccion_extra = "OBLIGATORIO: Enumera de forma EXPLÍCITA y EXACTA los eventos mencionados en 'eventos_en_prensa'. NO hagas resúmenes genéricos (ej. no digas 'hay más conciertos y ferias'). Tienes que dar los nombres exactos de los eventos que aparecen en la lista.";
                                    }
                                }
                            } catch (err) {
                                console.error("Error inyectando prensa en eventos:", err);
                            }
                        } else {
                            toolResponseData = { error: "No se pudo obtener la agenda de eventos." };
                        }
                    } catch (e) {
                        console.error("Error obteniendo eventos:", e);
                    }
                } else if (call.name === 'get_gas_prices') {
                    const municipioStr = call.args.municipio || 'all';
                    const tipoGas = call.args.tipo_combustible || 'Gasolina 95 E5';
                    
                    try {
                        const mitecoUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/11';
                        // Usamos caché de Cloudflare (1 hora) para no quemar la API del Ministerio
                        const gasRes = await fetch(mitecoUrl, { cf: { cacheTtl: 3600 } });
                        
                        if (gasRes.ok) {
                            const data = await gasRes.json();
                            const estaciones = data.ListaEESSPrecio || [];
                            
                            // Normalizar nombre del tipo de gas para buscar en el JSON
                            const keyMap = {
                                'Gasolina 95 E5': 'Precio Gasolina 95 E5',
                                'Gasolina 98 E5': 'Precio Gasolina 98 E5',
                                'Gasoleo A': 'Precio Gasoleo A',
                                'Gasoleo Premium': 'Precio Gasoleo Premium',
                                'Gases licuados del petróleo': 'Precio Gases licuados del petróleo'
                            };
                            const priceKey = keyMap[tipoGas] || 'Precio Gasolina 95 E5';
                            
                            // Filtrar por municipio si se especifica
                            let filtradas = estaciones.filter(e => e[priceKey] && e[priceKey].trim() !== '');
                            if (municipioStr.toLowerCase() !== 'all') {
                                const normalizeStr = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
                                const munBuscado = normalizeStr(municipioStr);
                                filtradas = filtradas.filter(e => normalizeStr(e.Municipio).includes(munBuscado) || normalizeStr(e.Localidad).includes(munBuscado));
                            }
                            
                            // Parsear precios (vienen con coma "1,654") y ordenar de menor a mayor
                            filtradas.sort((a, b) => {
                                const pa = parseFloat(a[priceKey].replace(',', '.'));
                                const pb = parseFloat(b[priceKey].replace(',', '.'));
                                return pa - pb;
                            });
                            
                            const top5 = filtradas.slice(0, 5).map(e => ({
                                rotulo: e['Rótulo'],
                                direccion: e['Dirección'],
                                localidad: e['Localidad'],
                                precio: e[priceKey] + ' €',
                                horario: e['Horario']
                            }));
                            
                            toolResponseData = {
                                combustible_consultado: tipoGas,
                                municipio_consultado: municipioStr,
                                resultados: top5.length > 0 ? top5 : "No se encontraron gasolineras con precios reportados para este combustible en esta zona."
                            };
                        } else {
                            toolResponseData = { error: "El servicio del Ministerio de Transición Ecológica no está disponible temporalmente." };
                        }
                    } catch (e) {
                        console.error("Error obteniendo gasolineras:", e);
                        toolResponseData = { error: "Error interno al procesar los datos de gasolineras." };
                    }
                } else if (call.name === 'get_electricity_prices') {
                    try {
                        const { hoursData, percentChange } = await fetchElectricityWithHistory();
                        
                        if (hoursData) {
                            (context as any).electricityHoursData = hoursData;
                            if (percentChange !== null) {
                                (context as any).historicalComparison = { percentChange };
                            }
                                
                                let sunsetDataStr = "";
                                try {
                                    let weatherData: any = null;
                                    const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key LIKE 'weather_v8_%' LIMIT 1`).first();
                                    if (row) {
                                        weatherData = JSON.parse(row.value as string);
                                    } else {
                                        const weatherUrl = new URL('/api/weather?city=Cádiz', request.url);
                                        const wRes = await fetch(weatherUrl.toString());
                                        if (wRes.ok) weatherData = await wRes.json();
                                    }

                                    if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
                                        const tf = weatherData.forecast[0];
                                        if (tf.orto && tf.ocaso) {
                                            (context as any).sunsetData = { sunrise: tf.orto, sunset: tf.ocaso };
                                            sunsetDataStr = ` Hoy amanece a las ${tf.orto} y anochece a las ${tf.ocaso}. Puedes usar este dato para aconsejar cuándo aprovechar la luz solar.`;
                                        }
                                    }
                                } catch(e) {
                                    console.error("Error sunsetData tool:", e);
                                }
                                
                                toolResponseData = {
                                    info: "Datos obtenidos con éxito. Usa cardType 'ElectricityCard' y el sistema inyectará los datos automáticamente." + sunsetDataStr + " IMPORTANTE: En tu respuesta de texto (content), explica súper brevemente qué es la tarifa PVPC, menciona que existe el Bono Social, y recuerda que al consumo hay que sumarle la potencia contratada y los impuestos.",
                                    status: "OK"
                                };
                            } else {
                                toolResponseData = { error: "No se encontraron datos de PVPC." };
                            }
                    } catch (e) {
                        console.error("Error obteniendo luz:", e);
                        toolResponseData = { error: "Error interno al consultar la luz." };
                    }
                } else {
                    toolCalled = false;
                }

                if (toolCalled) {
                    historyContents.push({
                        role: 'model',
                        parts: response.response.candidates[0].content.parts
                    });

                    historyContents.push({
                        role: 'function',
                        parts: [{
                            functionResponse: {
                                name: call.name,
                                response: toolResponseData
                            }
                        }]
                    });

                    // Añadir instrucción para que responda en JSON válido
                    historyContents.push({
                        role: 'user',
                        parts: [{ text: 'Ahora responde al usuario usando los datos de la herramienta. Tu respuesta DEBE ser un único objeto JSON válido. NO añadas texto fuera del JSON, ni saltos de línea al principio. Sigue ESTRICTAMENTE esta estructura de ejemplo:\n{"cardType":"ListCard","content":"Respuesta aquí...","intentCategory":"Eventos-Agenda","listItems":[{"title":"...","subtitle":"..."}],"suggestedBlocks":["..."]}' }]
                    });

                    model = genAI.getGenerativeModel({
                        model: currentModel,
                        generationConfig: {
                            temperature: 0.1
                        }
                    });

                    response = await model.generateContent({
                        contents: historyContents
                    });
                }
            }
            
            responseText = response.response.text();
            latencyMs = Date.now() - startTime;
            if (response.response.usageMetadata) {
                tokensUsed = response.response.usageMetadata.totalTokenCount || 0;
            }
            
        } catch (error: any) {
            console.error("Error with model:", error);
            let fallbackMsg = "Ha ocurrido un error de conexión con mi cerebro. Por favor, inténtalo de nuevo en unos segundos.";
            if (error.message && error.message.includes('524')) {
                fallbackMsg = "¡Uf! La conexión ha tardado demasiado y se ha agotado el tiempo de espera. ¿Podrías repetírmelo?";
            } else if (error.message && error.message.includes('429')) {
                fallbackMsg = "Estoy hablando con demasiada gente a la vez y me he quedado sin aliento. ¡Dame 1 minuto!";
            } else if (error.message && error.message.includes('503')) {
                fallbackMsg = "Mis servidores están saturados temporalmente. Por favor, inténtalo de nuevo en unos segundos.";
            } else if (error.message) {
                fallbackMsg = `Error interno: ${error.message}`;
            }
            return new Response(JSON.stringify({ error: fallbackMsg }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let parsedData;
        try {
            let cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            
            let startIdx = cleanText.indexOf('{');
            let jsonExtracted = null;
            if (startIdx !== -1) {
                let braceCount = 0;
                let inString = false;
                let escapeNext = false;
                
                for (let i = startIdx; i < cleanText.length; i++) {
                    const char = cleanText[i];
                    if (!escapeNext && char === '"') {
                        inString = !inString;
                    }
                    if (char === '\\' && inString) {
                        escapeNext = true;
                    } else {
                        escapeNext = false;
                    }

                    if (!inString) {
                        if (char === '{') braceCount++;
                        else if (char === '}') braceCount--;
                    }
                    
                    if (braceCount === 0 && !inString) {
                        try {
                            jsonExtracted = JSON.parse(cleanText.substring(startIdx, i + 1));
                            break;
                        } catch(e) {
                            // Ignorar
                        }
                    }
                }
            }
            
            if (jsonExtracted) {
                parsedData = jsonExtracted;
            } else {
                parsedData = JSON.parse(cleanText);
            }
        } catch(e) {
            let fallbackText = responseText.replace(/\{"cardType.*?\}/gs, '').trim();
            if (!fallbackText) fallbackText = "Ha ocurrido un error entendiendo el formato de la respuesta.";
            parsedData = { cardType: 'TextCard', content: fallbackText, suggestedBlocks: ['¿Qué más puedo ver?'], intentCategory: 'Otros' };
        }
        
        // Auto-inyectar los datos de la luz si la IA seleccionó la tarjeta
        if (parsedData.cardType === 'ElectricityCard') {
            if ((context as any).sunsetData) {
                parsedData.sunsetData = (context as any).sunsetData;
            } else {
                try {
                    let weatherData: any = null;
                    const row = await env.DB.prepare(`SELECT value FROM system_cache WHERE key LIKE 'weather_v8_%' LIMIT 1`).first();
                    if (row) {
                        weatherData = JSON.parse(row.value as string);
                    } else {
                        const weatherUrl = new URL('/api/weather?city=Cádiz', request.url);
                        const wRes = await fetch(weatherUrl.toString());
                        if (wRes.ok) weatherData = await wRes.json();
                    }

                    if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
                        const tf = weatherData.forecast[0];
                        if (tf.orto && tf.ocaso) {
                            parsedData.sunsetData = { sunrise: tf.orto, sunset: tf.ocaso };
                        }
                    }
                } catch(e) {
                    console.error("Error sunsetData fallback:", e);
                }
            }
            if ((context as any).historicalComparison) {
                parsedData.historicalComparison = (context as any).historicalComparison;
            }

            if ((context as any).electricityHoursData) {
                parsedData.electricityData = JSON.stringify((context as any).electricityHoursData);
            } else {
                const { hoursData, percentChange } = await fetchElectricityWithHistory();
                if (hoursData) {
                    parsedData.electricityData = JSON.stringify(hoursData);
                    if (percentChange !== null) {
                        parsedData.historicalComparison = { percentChange };
                    }
                }
            }
        }

        if (env.DB) {
            context.waitUntil((async () => {
                try {
                    const intentCat = parsedData.intentCategory || 'Otros';
                    const botRespText = parsedData.content || 'Sin respuesta';
                    const brainsInjected = cerebrosFiltrados.length > 0 ? cerebrosFiltrados.map(b => b.materia || b.id).join(', ') : '';
                    
                    await env.DB.prepare(
                        "INSERT INTO chat_logs (user_message, bot_response, intent_category, latency_ms, tokens_used, brains_injected, input_type, ab_variant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
                    ).bind(userMessage, botRespText, intentCat, latencyMs, tokensUsed, brainsInjected, inputType, activeVariant).run();
                } catch (dbError) {
                    console.error("D1 Insert Error:", dbError);
                }
            })());
        }

        return new Response(JSON.stringify(parsedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        let errorMessage = "Ha ocurrido un error inesperado.";
        if (error.message && error.message.includes('429')) {
            errorMessage = "¡Uf! Estoy hablando con demasiada gente a la vez y me he quedado sin aliento (Límite de la capa gratuita). Espera 1 minuto e inténtalo de nuevo.";
        } else if (error.message && error.message.includes('524')) {
            errorMessage = "¡Uf! La conexión ha tardado demasiado y se ha agotado el tiempo de espera. ¿Podrías repetírmelo?";
        } else if (error.message && error.message.includes('503')) {
            errorMessage = "Mis servidores están saturados temporalmente. Por favor, inténtalo de nuevo en unos segundos.";
        } else if (error.message) {
            errorMessage = error.message;
        }

        return new Response(JSON.stringify({ error: errorMessage }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function fetchElectricityWithHistory() {
    const spainDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const dateObj = new Date();
    dateObj.setFullYear(dateObj.getFullYear() - 1);
    const lastYearStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(dateObj);

    const urlToday = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${spainDate}T00:00&end_date=${spainDate}T23:59&time_trunc=hour`;
    const urlLastYear = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${lastYearStr}T00:00&end_date=${lastYearStr}T23:59&time_trunc=hour`;

    let hoursData = null;
    let percentChange = null;

    try {
        const [resToday, resLastYear] = await Promise.all([
            fetch(urlToday, { cf: { cacheTtl: 3600 } }),
            fetch(urlLastYear, { cf: { cacheTtl: 86400 } })
        ]);

        if (resToday.ok) {
            const data: any = await resToday.json();
            const pvpc = data.included?.find((i: any) => i.id === '1001');
            if (pvpc?.attributes?.values) {
                hoursData = pvpc.attributes.values.map((v: any, idx: number) => {
                    const hStr = idx.toString().padStart(2, '0');
                    const nextHStr = (idx + 1).toString().padStart(2, '0');
                    return { hour: `${hStr}-${nextHStr}`, price: v.value };
                });

                if (resLastYear.ok) {
                    const dataLY: any = await resLastYear.json();
                    const pvpcLY = dataLY.included?.find((i: any) => i.id === '1001');
                    if (pvpcLY?.attributes?.values) {
                        const sumToday = hoursData.reduce((acc: any, curr: any) => acc + curr.price, 0);
                        const avgToday = sumToday / hoursData.length;
                        
                        const valuesLY = pvpcLY.attributes.values;
                        const sumLY = valuesLY.reduce((acc: any, curr: any) => acc + curr.value, 0);
                        const avgLY = sumLY / valuesLY.length;

                        if (avgLY > 0) {
                            percentChange = ((avgToday - avgLY) / avgLY) * 100;
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.error("Error fetchElectricityWithHistory", e);
    }
    return { hoursData, percentChange };
}

