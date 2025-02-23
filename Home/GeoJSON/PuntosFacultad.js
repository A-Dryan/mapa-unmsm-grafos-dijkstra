function dibujarConexiones(grafo, coordenadas) {
  const conexionesLayerGroup = L.layerGroup().addTo(mapa);

  for (const facultad1 in grafo) {
      for (const facultad2 in grafo[facultad1]) {
          const coord1 = coordenadas[facultad1];
          const coord2 = coordenadas[facultad2];

          const linea = L.polyline([coord1, coord2], {
              color: 'blue',
              weight: 2,
              opacity: 0.7
          });

          const distancia = grafo[facultad1][facultad2].toFixed(2);
          linea.bindPopup(`<b>Distancia: ${distancia} km</b>`);

          conexionesLayerGroup.addLayer(linea);
      }
  }
}

dibujarConexiones(grafoFacultades, coordenadasFacultades);
