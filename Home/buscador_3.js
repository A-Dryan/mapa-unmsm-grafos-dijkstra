document.addEventListener("DOMContentLoaded", function() {
    const searchStartInput = document.getElementById("search-start");
    const suggestionsStartList = document.getElementById("suggestions-start");
    const searchEndInput = document.getElementById("search-end");
    const suggestionsEndList = document.getElementById("suggestions-end");
    const searchRouteButton = document.getElementById("search-route");

    const puntosfacultades = {
        "facultades": [ 
            {
                "nombre": "Clínica Universitaria",
                "coordenadas": [-12.055571198549364, -77.08222645827558]
            },
            {
                "nombre": "Comedor Universitario",
                "coordenadas": [-12.059459585498985, -77.08308369327257]
            },
            {
                "nombre": "Facultad de Letras y Ciencias Humanas",
                "coordenadas": [-12.057463861581558, -77.08146536455192]
            },
            {
                "nombre": "Facultad de Ciencias Administrativas",
                "coordenadas": [-12.057831548969945, -77.08142771240423]
            },
            {
                "nombre": "Facultad de Ciencias Económicas",
                "coordenadas": [-12.05758884380526, -77.0804843203072]
            },
            {
                "nombre": "Facultad de Derecho y Ciencia Política",
                "coordenadas": [-12.058646485036896, -77.08066141016164]
            },
            {
                "nombre": "Facultad de Ciencias Sociales",
                "coordenadas": [
                    [-12.057979339800296, -77.08164663159106],
                    [-12.05845963344347, -77.0821362289589]
                ]
            },
            {
                "nombre": "Rectorado UNMSM",
                "coordenadas": [-12.056420721843532, -77.08637776780245]
            },
            {
                "nombre": "Facultad de Ingeniería de Sistemas e Informática",
                "coordenadas": [-12.053605998711937, -77.0857119029342]
            },
            {
                "nombre": "Facultad de Ciencias Biológicas",
                "coordenadas": [
                    [-12.059648837479825, -77.0821371017456],
                    [-12.059893629177834, -77.08211055273979]
                ]
            },
            {
                "nombre": "Facultad de Ciencias Matemáticas",
                "coordenadas": [
                    [-12.060530917062469, -77.08232638492699],
                    [-12.060153274324263, -77.08202416795078]
                ]
            },
            {
                "nombre": "Facultad de Ingeniería Industrial",
                "coordenadas": [
                    [-12.059479921409936, -77.08086055157021],
                    [-12.059874347379367, -77.0815336247964],
                    [-12.06019828917936, -77.0809475621372]
                ]
            },
            {
                "nombre": "Facultad de Química e Ingeniería Química",
                "coordenadas": [
                    [-12.06008285894848, -77.08380493019877],
                    [-12.060312599093503, -77.08322166748582],
                    [-12.06044428759681, -77.08383287641603]
                ]
            },
            {
                "nombre": "E.P. de Ingeniería de Minas",
                "coordenadas": [-12.052223155266663, -77.08761693392692]
            },
            {
                "nombre": "Instituto de Medicina Tropical",
                "coordenadas": [
                    [-12.053956664971171, -77.08728268866007],
                    [-12.054146209481669, -77.0875649478706],
                    [-12.054284227242904, -77.08725446274323]
                ]
            },
            {
                "nombre": "Facultad de Ingeniería Geológica",
                "coordenadas": [-12.060282573272586, -77.0846788254117]
            },
            {
                "nombre": "Facultad de Educación",
                "coordenadas": [-12.054664325899767, -77.08475564091783]
            },
            {
                "nombre": "Facultad de Psicología",
                "coordenadas": [-12.053552309254608, -77.08679751061341]
            },
            {
                "nombre": "Facultad de Ingeniería Electrónica y Eléctrica",
                "coordenadas": [-12.055238551879087, -77.08685016604964]
            },
            {
                "nombre": "Instituto de Investigación Ciencias Físicas",
                "coordenadas": [-12.059264961454534, -77.08127277352563]
            },
            {
                "nombre": "Centro de Extensión Universitaria y Proyección Social",
                "coordenadas": [-12.059924023431494, -77.08100435516283]
            },
            {
                "nombre": "Escuela de Mecánica de Fluidos",
                "coordenadas": [-12.056801770154076, -77.08693675108465]
            },
            {
                "nombre": "Escuela de Enfermería y Tecnología Médica",
                "coordenadas": [
                    [-12.053365106109856, -77.08749268438356],
                    [-12.053433554673814, -77.08685226086686],
                    [-12.05297837140381, -77.0865512968058]
                ]
            },
            {
                "nombre": "Escuela de Posgrado",
                "coordenadas": [-12.05235301227514, -77.08612471209841]
            },
            {
                "nombre": "Centro Preuniversitario UNMSM",
                "coordenadas": [-12.052211095502493, -77.08535248432604]
            },
            {
                "nombre": "Escuela de Economía Pública",
                "coordenadas": [-12.053476666195667, -77.08627156889185]
            },
            {
                "nombre": "Escuela de Ciencias Políticas",
                "coordenadas": [-12.05875306420291, -77.08049166883829]
            },
            {
                "nombre": "Biblioteca Central Pedro Zulen",
                "coordenadas": [-12.055915723290125, -77.08589613153826]
            },
            {
                "nombre": "Facultad de Odontología",
                "coordenadas": [
                    [-12.054826618175014, -77.08592935553922],
                    [-12.054160543263292, -77.08576182852164]
                ]
            }
        ]
    };

    function showSuggestions(query, suggestionsList) {
        const filteredFacultades = puntosfacultades.facultades.filter(facultad =>
            facultad.nombre.toLowerCase().includes(query.toLowerCase())
        );

        suggestionsList.innerHTML = "";

        filteredFacultades.forEach(facultad => {
            const li = document.createElement("li");
            li.textContent = facultad.nombre;
            li.onclick = () => selectSuggestion(facultad, suggestionsList);
            suggestionsList.appendChild(li);
        });

        suggestionsList.style.display = filteredFacultades.length > 0 ? "block" : "none";
    }

    function selectSuggestion(facultad, suggestionsList) {
        console.log("Facultad seleccionada:", facultad.nombre);

        let latLngs;
        
        if (Array.isArray(facultad.coordenadas[0])) {
            // Si hay varias coordenadas (Ej: facultad con varias sedes), usa la primera
            latLngs = L.latLng(facultad.coordenadas[0][0], facultad.coordenadas[0][1]);
        } else {
            // Si solo hay una coordenada, úsala directamente
            latLngs = L.latLng(facultad.coordenadas[0], facultad.coordenadas[1]);
        }

        if (suggestionsList === suggestionsStartList) {
            searchStartInput.value = facultad.nombre;
            searchStartInput.dataset.coords = JSON.stringify(latLngs);
        } else {
            searchEndInput.value = facultad.nombre;
            searchEndInput.dataset.coords = JSON.stringify(latLngs);
        }

        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";

        // Centrar el mapa en la facultad seleccionada
        mapa.setView(latLngs, 17);
    }

    searchStartInput.addEventListener("input", (event) => {
        const query = event.target.value;
        if (query) {
            showSuggestions(query, suggestionsStartList);
        } else {
            suggestionsStartList.innerHTML = "";
            suggestionsStartList.style.display = "none";
        }
    });

    searchEndInput.addEventListener("input", (event) => {
        const query = event.target.value;
        if (query) {
            showSuggestions(query, suggestionsEndList);
        } else {
            suggestionsEndList.innerHTML = "";
            suggestionsEndList.style.display = "none";
        }
    });

    function handleKeyDown(event, suggestionsList, searchInput) {
        const suggestions = Array.from(suggestionsList.getElementsByTagName("li"));
        const activeSuggestion = suggestions.find(s => s.classList.contains("active"));

        if (event.key === "Tab" || event.key === "ArrowDown") {
            event.preventDefault();
            if (suggestions.length > 0) {
                const nextSuggestion = activeSuggestion ? activeSuggestion.nextElementSibling : suggestions[0];
                if (nextSuggestion) {
                    if (activeSuggestion) activeSuggestion.classList.remove("active");
                    nextSuggestion.classList.add("active");
                    searchInput.value = nextSuggestion.textContent;
                    nextSuggestion.scrollIntoView({ block: "nearest" });
                }
            }
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (activeSuggestion) activeSuggestion.classList.remove("active");
            const prevSuggestion = activeSuggestion ? activeSuggestion.previousElementSibling : suggestions[suggestions.length - 1];
            if (prevSuggestion) {
                prevSuggestion.classList.add("active");
                searchInput.value = prevSuggestion.textContent;
                prevSuggestion.scrollIntoView({ block: "nearest" });
            }
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (activeSuggestion) {
                const facultad = puntosfacultades.facultades.find(f => f.nombre === activeSuggestion.textContent);
                if (facultad) selectSuggestion(facultad, suggestionsList);
            }
        }
    }

    searchStartInput.addEventListener("keydown", (event) => handleKeyDown(event, suggestionsStartList, searchStartInput));
    searchEndInput.addEventListener("keydown", (event) => handleKeyDown(event, suggestionsEndList, searchEndInput));

    document.addEventListener("click", (event) => {
        if (!searchStartInput.contains(event.target) && !suggestionsStartList.contains(event.target)) {
            suggestionsStartList.innerHTML = "";
            suggestionsStartList.style.display = "none";
        }
        if (!searchEndInput.contains(event.target) && !suggestionsEndList.contains(event.target)) {
            suggestionsEndList.innerHTML = "";
            suggestionsEndList.style.display = "none";
        }
    });

    searchRouteButton.addEventListener("click", () => {
        const startName = searchStartInput.value;
        const endName = searchEndInput.value;

        if (startName && endName) {
            const startCoords = JSON.parse(searchStartInput.dataset.coords);
            const endCoords = JSON.parse(searchEndInput.dataset.coords);

            if (startCoords && endCoords) {
                const startLatLng = startCoords;
                const endLatLng = endCoords;

                calcularRuta(startLatLng, endLatLng);
            } else {
                alert("Por favor, seleccione facultades válidas.");
            }
        } else {
            alert("Por favor, complete ambos campos de búsqueda.");
        }
    });

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

                if (rutaLayer) {
                    mapa.removeLayer(rutaLayer);
                }
                rutaLayer = L.geoJSON(routeLine, { color: 'red' }).addTo(mapa);

                const distanceKm = turf.length(routeLine, { units: 'kilometers' }).toFixed(2);
                document.getElementById('distance-value').textContent = `${distanceKm} km`;
            } else {
                alert("No se pudo encontrar una ruta.");
            }
        }
    }
});
