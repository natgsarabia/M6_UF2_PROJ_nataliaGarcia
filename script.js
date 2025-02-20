window.onload = function() {
    
    //Mostrar el diálogo 
    let dialog = document.getElementById('introDialog');
    let closeBtn = document.getElementById('closeDialogBtn');
    dialog.showModal();

    // Cerrar el diálogo y permitir la búsqueda"
    closeBtn.addEventListener('click', function() {
        dialog.close(); // Cierra el diálogo
        cargaComunidades();  
        let sendButton = document.getElementById('submit');
        sendButton.addEventListener('click',enviarDatos)
    });
};


// FUNCIONES COMBO COMUNIDAD
async function cargaComunidades()
{
    let urlComunidades="https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/ccaa.json";
    let respone = await fetch(urlComunidades);
    let comunidades= await respone.json();
    // console.log(comunidades);
    //seleccionamos el combo comunidad
    let comboComunidades = document.getElementById('ccaa');

    //rellenamos el combo con la información del fetch de la url comunidades
    for (let comunidad of comunidades){
        
        //creamos un nuevo option
        let newComunidad = document.createElement('option');

        //lo nutrimos con la información obtenida en el fetch
        newComunidad.innerHTML=comunidad.label;
        newComunidad.value=comunidad.code;

        //añadimos la opcion al combo
        comboComunidades.append(newComunidad);
    }
    //añadimos el evento para guardar el valor de la comunidad si lo modificamos
    comboComunidades.addEventListener("change",seleccionarValorComunidad);
}

function seleccionarValorComunidad(event)
{
    let codecomunidad = event.target.value;
    // console.log(codecomunidad);

    clearCombo("provincia");
    clearCombo("poblacion");
    feedComboProvincia(codecomunidad);
}


//FUNCIONES COMBO PROVINCIA
async function feedComboProvincia(code)
{
    
    let provinciasFiltradas=[];
    let urlProvincia ="https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/provincias.json";


    let response = await fetch(urlProvincia);
    let provincias = await response.json();
    // console.log(provincias);
    
    for (let provincia of provincias)
    {

        if(provincia['parent_code']==code)
        {
            // console.log(provincia)
            provinciasFiltradas.push(provincia);
        }
    }
    // console.log(provinciasFiltradas)

    //seleccionamos el combo provincia
    let comboProvincia = document.getElementById("provincia");

    //rellenamos el combo con la información del fetch de la url comunidades
    for (let provincia of provinciasFiltradas){
        
        //creamos un nuevo option
        let newProvincia = document.createElement('option');

        //lo nutrimos con la información obtenida en el fetch
        newProvincia.innerHTML=provincia.label;
        newProvincia.value=provincia.code;

        //añadimos la opcion al combo
        comboProvincia.append(newProvincia);
    }
    comboProvincia.addEventListener("change",seleccionarValorProvincia);
}


function seleccionarValorProvincia(event)
{
    let codeprovincia = event.target.value;
    // console.log(codeprovincia);

    clearCombo("poblacion");
    feedComboPoblacion(codeprovincia);
}


async function feedComboPoblacion(code)
{
    
    let poblacionesFiltradas=[];
    let urlPoblaciones ="https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/poblaciones.json";


    let response = await fetch(urlPoblaciones);
    let poblaciones = await response.json();

    
    for (let poblacion of poblaciones)
    {

        if(poblacion['parent_code']==code)
        {
            // console.log(poblacion)
            poblacionesFiltradas.push(poblacion);
        }
    }
    // console.log(poblacionesFiltradas);

    //seleccionamos el combo poblacion
    let comboPoblacion = document.getElementById("poblacion");

    //rellenamos el combo con la información del fetch de la url comunidades
    for (let poblacion of poblacionesFiltradas){
        
        //creamos un nuevo option
        let newPoblacion = document.createElement('option');

        //lo nutrimos con la información obtenida en el fetch
        newPoblacion.innerHTML=poblacion.label;
        newPoblacion.value=poblacion.label;

        //añadimos la opcion al combo
        comboPoblacion.append(newPoblacion);
    }
    comboPoblacion.addEventListener("change",seleccionarValorPoblacion);
}


function seleccionarValorPoblacion(event)
{
    let codepoblacion = event.target.value;
    // console.log(codecomunidad);

}



function clearCombo(combo){
    //cogemos el combo seleccionado
    let comboSeleccionado = document.getElementById(combo);
    // console.log(comboSeleccionado)

    //reseteamos la información del combo
    let opcionesCombo = Array.from(comboSeleccionado.querySelectorAll('option'));

    for (let opcion of opcionesCombo) {
        // console.log(opcion)
        opcion.remove();
    }

    let opcionBase = document.createElement('option');
    opcionBase.textContent='Seleccione una opción';
    opcionBase.value='';
    comboSeleccionado.appendChild(opcionBase);
}


async function cargarImagenes(poblacion){
    console.log('Cargando Imagenes de idPoblacion: '+poblacion);
    let url=`https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=images&titles=${encodeURIComponent(poblacion)}&gimlimit=10&prop=imageinfo&iiprop=url`;

    try{
       let response = await fetch(url);
       let images = await response.json();
       let imageContainer = document.getElementById('image-container');

       if(!images.query){
           let advice = document.createElement('div');
           advice.classList.add('image-caption');
           advice.innerHTML='Lo sentimos, no se han encontrado imagenes para esta población';
           imageContainer.append(advice);
           return;
        }
       else
       {
            let ImagesPages = Object.values(images.query.pages);

            ImagesPages.forEach(page => {
                if (page.imageinfo) {
                let imageBox= document.createElement('div');
                imageBox.classList.add('image-box');

                let image = document.createElement('img');
                image.src = page.imageinfo[0].url;
                imageBox.append(image);
                imageContainer.append(imageBox);
                }
            });
        }
     
    }
    catch(err)
    {
        Console.log(`Se ha producido un error: ${err}.`)
    }
}



function clearImages(){

    let imageContainer = document.getElementById('image-container');
    let images = imageContainer.querySelectorAll('.image-box');
    let errorMissage= imageContainer.querySelector('.image-caption');
    if(errorMissage)
    {
        errorMissage.remove();
    }
    if(images)
    {
        images.forEach(image=>image.remove());
    }
}


//OBTENER UBICACION

//Coordenadas poblacion
async function obtenerCoordenadas(poblacion) {
    let urlGeolocalización = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(poblacion)}`;

    try {
        let response = await fetch(urlGeolocalización);
        let geoData = await response.json();
        
        if (geoData.length > 0) 
        {
            let latitud = geoData[0].lat;
            let longitud = geoData[0].lon;
            console.log(`Coordenadas de ${poblacion} son: latitud ${latitud} y longitud: ${longitud}`);
            await restaurantesCercanosNombre(latitud, longitud);
        } 
        else 
        {
            let divRestaurantes= document.querySelector('.restaurantes-container');
            let sinResultados= document.createElement('p');
            sinResultados.innerHTML="No existen restaurantes en esta población.";
            divRestaurantes.append(sinResultados);
        }

    } 
    catch (error) 
    {
        console.error("Error obteniendo coordenadas:", error);
        
    }
}

//Buscar restaurantes cercanos con Overpass API (OpenStreetMap)
async function restaurantesCercanosNombre(latitud, longitud) {
   
    let busqueda = `
        [out:json];
        node["amenity"="restaurant"](around:2000, ${latitud}, ${longitud});
        out 10;
    `;
    let urlOpenStreetMap = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(busqueda)}`;

    let container = document.getElementById('restaurantes-container');
    let title=document.createElement('h3')
    title.innerHTML = "Restaurantes Cercanos:";
    container.append(title);

    container.style.visibility="visible";

    let spinner = document.createElement('div');
    spinner.id = 'spinner';
    container.appendChild(spinner);
    spinner.style.display = 'block';
    
    try 
    {
        let response = await fetch(urlOpenStreetMap);
        let restaurantData = await response.json();
        let restaurantes=restaurantData.elements;

        spinner.style.display = 'none';

        if (restaurantes.length === 0) 
        {
            let divRestaurantes= document.getElementById('restaurantes-container');
            let sinResultados= document.createElement('p');
            sinResultados.classList.add('errorRestaurantes')
            sinResultados.innerHTML="No existen restaurantes en esta población.";
            divRestaurantes.append(sinResultados);
        } 
        else 
        {
            //enviamos notificación para avisar de que existen restaurantes en la zona
            if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("¡Restaurantes en esta población encontrados!", {
                            body: "Baja al final de la pàgina para más detalles."
                        });
                    }
                });
            }
            mostrarRestaurantes(restaurantes,container);
        }

    } 
    catch (error) 
    {
        console.error("Error obteniendo restaurantes:", error);
 
    }
}

//añadir 10 restaurantes a la pagina
function mostrarRestaurantes(restaurantes,container) {

    console.log(restaurantes);
    restaurantes.forEach(restaurante => {
        let newRestaurante = document.createElement('div');
        newRestaurante.classList.add('restaurant-box');
        let nombre = restaurante.tags.name;
        let calle = restaurante.tags["addr:street"];
        let numero =restaurante.tags["addr:housenumber"];
        let cp = restaurante.tags["addr:postcode"];
        let web = restaurante.tags.website;

        let restaurantName = document.createElement('p');
        restaurantName.classList.add('restaurantName');
        restaurantName.innerHTML=nombre;

        restaurantName.addEventListener('click', () => openModal(nombre, calle, numero, cp, web));

        newRestaurante.append(restaurantName);


        let restaurantDireccion = document.createElement('div');
        restaurantDireccion.classList.add('restaurantDireccion');
    
        if(calle && numero &&cp){
            restaurantDireccion.innerHTML=`Ubicación: ${calle} nº${numero}, ${cp}`;
        }
        else if(calle && numero && !cp)
        {
            restaurantDireccion.innerHTML=`Ubicación: ${calle} nº${numero}`;
        }
        else if(calle && !numero && !cp)
        {
            restaurantDireccion.innerHTML=`Ubicación: ${calle}`;
        }
        else
        {
            restaurantDireccion.innerHTML=`Ubicación: sin datos`;
        }

        let restaurantWeb = document.createElement('a');
        restaurantWeb.classList.add('restaurantWeb');
        if(web)
        {
            restaurantWeb.innerHTML=web;
            restaurantWeb.href=web;
        }

        newRestaurante.append(restaurantName);

        container.appendChild(newRestaurante);

    });
}

// abrir model
function openModal(nombre, calle, numero, cp, web) {
    let modal = document.getElementById('restaurantModal');
    let nombreRestaurante = document.getElementById('restaurantName');
    let direccionRestaurante = document.getElementById('restaurantDireccion');
    let webRestaurante = document.getElementById('restaurantWeb');

    console.log(`La información recibida es: restaurande ${nombre} en ${calle}, codigo postal ${cp} y web ${web}`)
    // Llenar el modal con la información
    nombreRestaurante.innerHTML=nombre;


    if(calle && numero &&cp){
        direccionRestaurante.innerHTML=`Ubicación: ${calle} nº${numero}, ${cp}`;
    }
    else if(calle && numero && !cp)
    {
        direccionRestaurante.innerHTML=`Ubicación: ${calle} nº${numero}`;
    }
    else if(calle && !numero && !cp)
    {
        direccionRestaurante.innerHTML=`Ubicación: ${calle}`;
    }
    else
    {
        direccionRestaurante.innerHTML=`Ubicación: sin datos`;
    }

    if(web)
    {
        webRestaurante.innerHTML=web;
        webRestaurante.href=web;
    }
    else
    {
        webRestaurante.innerHTML="";
        webRestaurante.href="";
    }


    //volvemos visible el modal
    modal.style.display = 'flex';
    
   //utilizamos Web API animation para que el modal aparezca de arriba hacía abajo 
    modal.animate([
        { opacity: 0, transform: 'translateY(-50px)' },  
        { opacity: 1, transform: 'translateY(0)' }      
    ], {
        duration: 500,   
        easing: 'ease-out', 
        fill: 'forwards'   
    });

    // Añadir evento para cerrar el modal
    document.querySelector('.cerrar').addEventListener('click', closeModal);
    document.querySelector('.share').addEventListener('click', compartirRestaurante);
}

// Cerrar el modal con animación
function closeModal() {
    let modal = document.getElementById('restaurantModal');

    // Animación de deslizamiento hacia arriba utilizando Web Animation API
    modal.animate([
        { opacity: 1, transform: 'translateY(0)' },    // estado inicial
        { opacity: 0, transform: 'translateY(-50px)' } // estado final
    ], {
        duration: 500,   // duración de la animación
        easing: 'ease-in', // tipo de transición
        fill: 'forwards'   // asegurarnos de que el modal quede oculto al final
    });

    // Esperar a que termine la animación antes de ocultar el modal
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500); // esperar el tiempo de duración de la animación
}

function compartirRestaurante(){
    const nombreRestaurante = document.getElementById('restaurantName').innerText;
    const direccionRestaurante = document.getElementById('restaurantDireccion').innerText;
    const webRestaurante = document.getElementById('restaurantWeb').href;


    let compartirRestaurante = document.createElement('div');
    compartirRestaurante.classList.add('share');

    if (navigator.share) {
        navigator.share({
            title: 'Restaurante cercano',
            text: `Mira este restaurante: ${nombreRestaurante} en ${direccionRestaurante}`,
            url: webRestaurante
        }).then(() => {
            console.log('Contenido compartido con éxito');
        }).catch((error) => {
            console.error('Error al compartir el contenido:', error);
        });
    }
    else {
    console.error("La API de compartir no está soportada en este navegador.");
    }
}

function clearRestaurants(){

    let restaurantesContainer = document.getElementById('restaurantes-container');
    let title= restaurantesContainer.querySelector('h3');
    let restaurantes = restaurantesContainer.querySelectorAll('.restaurant-box');
    let errorRestaurantes= restaurantesContainer.querySelector('.errorRestaurantes');
    
    if(title)
    {
        title.remove();
    }

    if(errorRestaurantes)
    {
        errorRestaurantes.remove();
    }
    if(restaurantes)
    {
        restaurantes.forEach(restaurante=>restaurante.remove());
    }
}


//FUNCION ENVIAR DATOS 

function enviarDatos(event){
    event.preventDefault();
    clearImages();
    clearRestaurants();

    let comunidad = document.getElementById('ccaa').value;
    let provincia = document.getElementById('provincia').value;
    let poblacion = document.getElementById('poblacion').value;
    if(!comunidad )
    {
        alert('Debe seleccionar una comunidad.')
    }
    else if(!provincia)
    {
        alert('Debe seleccionar una provincia.')
    }
    else if(!poblacion)
    {
        alert('Debe seleccionar una poblacion.')
    }
    else
    {
        cargarImagenes(poblacion);
        obtenerCoordenadas(poblacion);
    }
        
    
}

