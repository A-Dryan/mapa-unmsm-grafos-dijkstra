// Crear el mapa y agregar el control de pantalla completa
var mapa = L.map("contenedor-del-mapa", {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([-12.056519215, -77.0842319000621], 16.2);

// Agregar capa base de OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {}).addTo(mapa);

let startMarker, endMarker;
let startConnectionLayer, endConnectionLayer;
let rutaLayer;
let grafo = {};
let senderosConectados;

// Cargar el archivo GeoJSON de senderos y procesarlo
fetch('senderos_limpios.json')
    .then(response => response.json())
    .then(data => {
        senderosConectados = conectarSegmentos(data, 10);
        construirGrafo(senderosConectados);
    })
    .catch(error => console.error('Error al cargar el archivo GeoJSON:', error));

// Función para construir el grafo con las conexiones entre los puntos
function construirGrafo(geoJSON) {
    geoJSON.features.forEach(feature => {
        const coordinates = feature.geometry.coordinates;

        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const startId = `${start[1]},${start[0]}`;
            const endId = `${end[1]},${end[0]}`;

            // Calcular la distancia entre los dos puntos
            const distance = turf.distance(turf.point(start), turf.point(end), { units: 'meters' });

            // Añadir las conexiones en ambas direcciones
            if (!grafo[startId]) grafo[startId] = [];
            if (!grafo[endId]) grafo[endId] = [];
            grafo[startId].push({ node: endId, weight: distance });
            grafo[endId].push({ node: startId, weight: distance });
        }
    });
}

// Función para encontrar el nodo más cercano a un punto dado
function encontrarNodoMasCercano(latLng) {
    let closestNode = null;
    let minDistance = Infinity;

    if (isNaN(latLng.lng) || isNaN(latLng.lat)) {
        console.error("Coordenadas no válidas:", latLng);
        return null;
    }

    const point = turf.point([latLng.lng, latLng.lat]);

    for (const node in grafo) {
        const [lat, lng] = node.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) continue;

        const distance = turf.distance(point, turf.point([lng, lat]), { units: 'meters' });

        if (distance < minDistance) {
            minDistance = distance;
            closestNode = node;
        }
    }

    return closestNode;
}

L.control.buttons = L.Control.extend ({
    onAdd: function(map) {

        // Crear el contenedor de los botones
        var container = L.DomUtil.create('div', 'leaflet-control-buttons');

        var distanceDisplay = L.DomUtil.create('div', 'distance-display', container);
        distanceDisplay.id = 'distance-display';
        distanceDisplay.innerHTML = '<strong>Distancia:</strong> <span id="distance-value">0 km</span>';

        return container;
    }
})

// Función para manejar la selección de puntos
function seleccionarPuntos(e) {
    const clickedLatLng = e.latlng;
    const closestNode = encontrarNodoMasCercano(clickedLatLng);

    if (closestNode) {
        const [closestLat, closestLng] = closestNode.split(',').map(Number);

        if (!startMarker) {
            // Primer clic, establecer como inicio
            startMarker = L.marker(clickedLatLng, { draggable: false })
                .addTo(mapa)
                .bindPopup("Inicio")
                .openPopup();

            // Eliminar la línea de conexión anterior
            if (startConnectionLayer) mapa.removeLayer(startConnectionLayer);
            
            startConnectionLayer = L.geoJSON(turf.lineString([
                [clickedLatLng.lng, clickedLatLng.lat], 
                [closestLng, closestLat]
            ]), {
                color: 'red',
                weight: 2,
                dashArray: '5, 5'
            }).addTo(mapa);
        } else if (!endMarker) {
            // Segundo clic, establecer como final
            endMarker = L.marker(clickedLatLng, { draggable: false })
                .addTo(mapa)
                .bindPopup("Final")
                .openPopup();

            // Eliminar la línea de conexión anterior
            if (endConnectionLayer) mapa.removeLayer(endConnectionLayer);
            
            endConnectionLayer = L.geoJSON(turf.lineString([
                [clickedLatLng.lng, clickedLatLng.lat], 
                [closestLng, closestLat]
            ]), {
                color: 'red',
                weight: 2,
                dashArray: '5, 5'
            }).addTo(mapa);

            // Calcular la ruta automáticamente
            calcularRuta(startMarker.getLatLng(), endMarker.getLatLng());

            // Desactivar el clic del mapa
            mapa.off('click', seleccionarPuntos);
        }
    }
}

// Función para calcular la ruta entre los puntos seleccionados
function calcularRuta(startLatLng, endLatLng) {
    const startNode = encontrarNodoMasCercano(startLatLng);
    const endNode = encontrarNodoMasCercano(endLatLng);

    if (startNode && endNode) {
        const rutaNodos = dijkstra(grafo, startNode, endNode);

        if (rutaNodos.length > 1) {
            const rutaCoordenadas = rutaNodos.map(node => {
                const [lat, lng] = node.split(',').map(Number);
                return [lng, lat];
            });

            const routeLine = turf.lineString(rutaCoordenadas);

            if (rutaLayer) mapa.removeLayer(rutaLayer);

            rutaLayer = L.geoJSON(routeLine, { color: 'blue' }).addTo(mapa);

            // Calcular distancia de la ruta
            const distanceKm = turf.length(routeLine, { units: 'kilometers' }).toFixed(2);
            const distanceElement = document.getElementById("distance-value");
            if (distanceElement) distanceElement.textContent = `${distanceKm} km`;
        } else {
            alert("No se pudo encontrar una ruta.");
        }
    }
}

// ✅ Asignar eventos a los botones cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
    const selectPointsBtn = document.getElementById("select-points");
    const resetBtn = document.getElementById("reset-locations");

    if (!selectPointsBtn || !resetBtn) {
        console.error("No se encontraron los botones en el DOM");
        return;
    }

    // Evento para seleccionar puntos
    selectPointsBtn.addEventListener("click", function (e) {
        L.DomEvent.stopPropagation(e);
        startMarker = null;
        endMarker = null;
        startConnectionLayer = null;
        endConnectionLayer = null;
        mapa.on("click", seleccionarPuntos);
    });

    // Evento para reiniciar ubicaciones y limpiar la ruta
    resetBtn.addEventListener("click", function (e) {
        L.DomEvent.stopPropagation(e);

        if (startMarker) { mapa.removeLayer(startMarker); startMarker = null; }
        if (endMarker) { mapa.removeLayer(endMarker); endMarker = null; }
        if (startConnectionLayer) { mapa.removeLayer(startConnectionLayer); startConnectionLayer = null; }
        if (endConnectionLayer) { mapa.removeLayer(endConnectionLayer); endConnectionLayer = null; }
        if (rutaLayer) { mapa.removeLayer(rutaLayer); rutaLayer = null; }

        const distanceElement = document.getElementById("distance-value");
        if (distanceElement) distanceElement.textContent = "0 km";
    });
});

mapa.addControl(new L.control.buttons({ position: 'topright' }));