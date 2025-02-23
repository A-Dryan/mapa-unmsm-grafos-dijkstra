function calcularRuta(startLatLng, endLatLng) {
    if (isNaN(startLatLng.lng) || isNaN(startLatLng.lat) || isNaN(endLatLng.lng) || isNaN(endLatLng.lat)) {
        console.error("Coordenadas no válidas:", startLatLng, endLatLng);
        return;
    }

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

            startConnectionLayer = L.geoJSON(routeLine, { color: 'blue' }).addTo(mapa);

            const distanceKm = turf.length(routeLine, { units: 'kilometers' }).toFixed(2);

            const distanceElement = document.getElementById('distance-value');
            if (distanceElement) {
                distanceElement.textContent = `${distanceKm} km`;
            } else {
                console.error("Elemento para mostrar la distancia no encontrado");
            }
        } else {
            alert("No se pudo encontrar una ruta.");
        }
    }
}

function dijkstra(grafo, inicio, fin) {
    const nodos = new Set(Object.keys(grafo));
    const distancias = {};
    const anteriores = {};

    nodos.forEach(nodo => {
        distancias[nodo] = Infinity;
        anteriores[nodo] = null;
    });
    distancias[inicio] = 0;

    while (nodos.size) {
        let nodoActual = null;

        nodos.forEach(nodo => {
            if (!nodoActual || distancias[nodo] < distancias[nodoActual]) {
                nodoActual = nodo;
            }
        });

        if (nodoActual === fin) break;
        nodos.delete(nodoActual);

        grafo[nodoActual].forEach(({ node: vecino, weight }) => {
            const nuevaDistancia = distancias[nodoActual] + weight;
            if (nuevaDistancia < distancias[vecino]) {
                distancias[vecino] = nuevaDistancia;
                anteriores[vecino] = nodoActual;
            }
        });
    }

    const ruta = [];
    let actual = fin;

    while (actual) {
        ruta.push(actual);
        actual = anteriores[actual];
    }

    return ruta.reverse();
}
