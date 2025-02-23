function conectarSegmentos(geoJSON, umbralDistancia) {
    const features = geoJSON.features;
    const conexiones = []; // Almacena las conexiones únicas

    features.forEach((featureA, index) => {
        const coordsA = featureA.geometry.coordinates;

        if (!coordsA || coordsA.length < 2) return;

        const endPointA = coordsA[coordsA.length - 1];

        features.slice(index + 1).forEach(featureB => {
            const coordsB = featureB.geometry.coordinates;

            if (!coordsB || coordsB.length < 2) return;

            const startPointB = coordsB[0];

            const distancia = turf.distance(turf.point(endPointA), turf.point(startPointB), { units: 'kilometers' });

            if (distancia <= umbralDistancia) {
                const lineaConexion = {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: [endPointA, startPointB]
                    },
                    properties: { connected: true }
                };
                conexiones.push(lineaConexion);
            }
        });
    });

    return {
        type: "FeatureCollection",
        features: [...features, ...conexiones]
    };
}

window.addEventListener("scroll", function(){
    var menu = document.querySelector(".menu");
    menu.classList.toggle("sticky", window.scrollY > 0);
})



// Selecciona el enlace y el div
const loginLink2 = document.getElementById('loginLink2');
const loginLink = document.getElementById('loginLink');
const loginDiv = document.getElementById('loginDiv');
const contenedorTodo = document.querySelector('.contenedor__todo');

// Muestra el div al hacer clic en el enlace
loginLink.addEventListener('click', (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    loginDiv.style.display = 'flex'; // Muestra el div
    contenedorTodo.classList.add('show');
    contenedorTodo.classList.remove('hide');

});



// Cierra el div al hacer clic en el botón de cierre
loginDiv.addEventListener('click', (event) => {
    if (!contenedorTodo.contains(event.target)) {
        // Si el clic ocurre fuera de contenedor__todo, se cierra loginDiv
        contenedorTodo.classList.add('hide')
        contenedorTodo.classList.remove('show');

        setTimeout(() => {
            loginDiv.style.display = 'none';
            contenedorTodo.classList.remove('hide'); // Quita la clase para el siguiente uso
        }, 600);
    }
});






//Declaración de variables para animación del Log In

document.getElementById("btn__register").addEventListener("click", register);
document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion)

var contenedor_login_register = document.querySelector(".contenedor__login-register");
var formulario_login =document.querySelector(".formulario__login");
var formulario_register =document.querySelector(".formulario__register");

var caja_trasera_login =document.querySelector(".caja__trasera-login");
var caja_trasera_register =document.querySelector(".caja__trasera-register");

function iniciarSesion(){
    formulario_register.style.display = "none";
    contenedor_login_register.style.left = "10px";
    formulario_login.style.display = "block";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.opacity = "0";
}

function register(){
    formulario_register.style.display = "block";
    contenedor_login_register.style.left = "410px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.opacity = "0";
    caja_trasera_login.style.opacity = "1";
}

document.getElementById('formulario_registro').addEventListener('submit', function (e) {
    // Obtener los valores de las contraseñas
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar_contrasena').value;

    // Validar si las contraseñas son iguales
    if (contrasena !== confirmarContrasena) {
      // Mostrar alerta y evitar el envío del formulario
      alert('Las contraseñas no son iguales.');
      e.preventDefault();
    }
});

