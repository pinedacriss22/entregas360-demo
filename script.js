let categorias = [];
let comercios = [];
let productos = [];
let categoriaSeleccionada = null;

// Consultar las API

async function consultarAPI(ruta) {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
        throw new Error('Error al consultar ' + ruta);
    }

    return await respuesta.json();
}

// Crear tarjetas

function crearTarjeta(titulo, descripcion) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';

    const encabezado = document.createElement('h3');
    encabezado.textContent = titulo;

    const texto = document.createElement('p');
    texto.textContent = descripcion;

    tarjeta.append(encabezado, texto);

    return tarjeta;
}

// Formato de precios

function precio(valor) {
    return 'L ' + Number(valor).toFixed(2);
}

// Mostrar categorias

function mostrarCategorias() {
    const contenedor = document.getElementById('categorias');
    contenedor.replaceChildren();

    const todos = document.createElement('button');
    todos.className = 'btn';
    todos.textContent = 'Todos';

    todos.onclick = () => {
        categoriaSeleccionada = null;
        mostrarCatalogo();
    };

    contenedor.appendChild(todos);

    categorias.forEach(categoria => {
        const boton = document.createElement('button');

        boton.className = 'btn';
        boton.textContent = categoria.nombre;

        boton.onclick = () => {
            categoriaSeleccionada = categoria.id;
            mostrarCatalogo();
        };

        contenedor.appendChild(boton);
    });
}

// Mostrar comercios

function mostrarComercios(lista) {
    const contenedor = document.getElementById('comercios');
    contenedor.replaceChildren();

    if (lista.length === 0) {
        contenedor.textContent = 'No se encontraron comercios.';
        return;
    }

    lista.forEach(comercio => {
        const tarjeta = crearTarjeta(
            comercio.nombre,
            comercio.descripcion || ''
        );

        const envio = document.createElement('p');

        envio.textContent =
            'Costo de envio: ' + precio(comercio.costo_envio);

        tarjeta.appendChild(envio);
        contenedor.appendChild(tarjeta);
    });
}

// Mostrar productos

function mostrarProductos(lista) {
    const contenedor = document.getElementById('productos');
    contenedor.replaceChildren();

    if (lista.length === 0) {
        contenedor.textContent = 'No se encontraron productos.';
        return;
    }

    lista.forEach(producto => {
        const tarjeta = crearTarjeta(
            producto.nombre,
            producto.descripcion || ''
        );

        const comercio = document.createElement('p');
        comercio.textContent = producto.comercio;

        const valor = document.createElement('h3');
        valor.textContent = precio(producto.precio);
        valor.style.color = '#198754';

        const stock = document.createElement('p');

        stock.textContent = producto.stock > 0
            ? 'Disponible: ' + producto.stock + ' unidades'
            : 'Agotado';

        tarjeta.append(comercio, valor, stock); const agregar=document.createElement('button'); agregar.className='btn'; agregar.textContent='Agregar al carrito'; agregar.onclick=()=>demoAdd(producto.id); tarjeta.append(agregar);
        contenedor.appendChild(tarjeta);
    });
}

// Normalizar texto para las busquedas

function normalizar(texto) {
    return String(texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Filtrar catalogo

function mostrarCatalogo() {
    const busqueda = normalizar(
        document.getElementById('buscador').value
    );

    const comerciosCategoria = comercios.filter(comercio =>
        categoriaSeleccionada === null ||
        comercio.categoria_id === categoriaSeleccionada
    );

    const ids = comerciosCategoria.map(comercio => comercio.id);

    const productosFiltrados = productos.filter(producto =>
        ids.includes(producto.comercio_id) &&
        normalizar(
            producto.nombre + ' ' +
            producto.descripcion + ' ' +
            producto.comercio
        ).includes(busqueda)
    );

    const comerciosFiltrados = comerciosCategoria.filter(comercio =>
        normalizar(comercio.nombre).includes(busqueda) ||
        productosFiltrados.some(
            producto => producto.comercio_id === comercio.id
        )
    );

    mostrarComercios(comerciosFiltrados);
    mostrarProductos(productosFiltrados);
}

// Cargar informacion desde MySQL

async function iniciarCatalogo() {
    try {
        [categorias, comercios, productos] = await Promise.all([
            consultarAPI('/api/categorias'),
            consultarAPI('/api/comercios'),
            consultarAPI('/api/productos')
        ]);

        mostrarCategorias();
        mostrarCatalogo();

        document.getElementById('buscador')
            .addEventListener('input', mostrarCatalogo);

        console.log('Catalogo cargado correctamente');

    } catch (error) {
        console.error(error);

        document.getElementById('productos').textContent =
            'No se pudo cargar el catalogo.';

        document.getElementById('comercios').textContent =
            'No se pudieron cargar los comercios.';

        document.getElementById('categorias').textContent =
            'No se pudieron cargar las categorias.';
    }
}

document.addEventListener('DOMContentLoaded', iniciarCatalogo);