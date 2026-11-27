async function verificarSesion() {
    try {
        const respuesta = await fetch('/api/sesion', {
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        if (!datos.autenticado) return;

        const nav = document.querySelector('header nav');

        if (!nav) return;

        if (document.getElementById('menu-usuario')) return;

        nav.querySelectorAll('a').forEach(enlace => {
            const ruta = new URL(enlace.href).pathname;

            if (
                ruta.endsWith('/login.html') ||
                ruta.endsWith('/registro.html')
            ) {
                enlace.remove();
            }
        });

        const menu = document.createElement('div');

        menu.id = 'menu-usuario';
        menu.style.cssText = `
            position: relative;
            display: inline-block;
        `;



        menu.innerHTML = `
            <button id="btn-usuario" type="button"
                aria-expanded="false"
                style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    background:#e8f5ed;
                    color:#198754;
                    border:none;
                    border-radius:10px;
                    padding:12px 18px;
                    font-size:15px;
                    font-weight:600;
                    cursor:pointer;
                ">

                <svg width="22" height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 21v-2a8 8 0 0 1 16 0v2"/>
                </svg>

                <span id="nombre-usuario"></span>

                <span>&#9662;</span>

            </button>

            <div id="opciones-usuario" style="
                display:none;
                position:absolute;
                right:0;
                top:calc(100% + 10px);
                width:250px;
                background:white;
                border:1px solid #dce5df;
                border-radius:14px;
                box-shadow:0 10px 30px rgba(0,0,0,.12);
                padding:16px;
                z-index:9999;
            ">

                <strong id="nombre-completo"
                    style="color:#18352a;">
                </strong>

                <p id="correo-usuario" style="
                    font-size:12px;
                    color:#64748b;
                    overflow-wrap:anywhere;
                    margin:6px 0 14px;
                "></p>

                <hr style="
                    border:0;
                    border-top:1px solid #dce5df;
                    margin:10px 0;
                ">

                <a href="/entregas360-demo/pages/perfil.html"
                    style="display:block;padding:12px 0;">
                    Mi perfil
                </a>

                <a href="/entregas360-demo/pages/rastreo.html"
                    style="display:block;padding:12px 0;">
                    Mis pedidos
                </a>

                <button id="btn-logout" type="button"
                    style="
                        width:100%;
                        padding:12px;
                        border:none;
                        border-radius:8px;
                        background:#fef2f2;
                        color:#dc2626;
                        font-weight:600;
                        cursor:pointer;
                    ">
                    Cerrar sesi&oacute;n
                </button>

            </div>
        `;

        nav.appendChild(menu);

        document.getElementById('nombre-usuario')
            .textContent = datos.usuario.nombre;

        document.getElementById('nombre-completo')
            .textContent = datos.usuario.nombre + ' ' +
                           datos.usuario.apellido;

        document.getElementById('correo-usuario')
            .textContent = datos.usuario.correo;

        const boton = document.getElementById('btn-usuario');
        const opciones = document.getElementById('opciones-usuario');

        boton.addEventListener('click', () => {
            const abierto = opciones.style.display === 'block';

            opciones.style.display = abierto ? 'none' : 'block';

            boton.setAttribute('aria-expanded', String(!abierto));
        });

        document.addEventListener('click', evento => {
            if (!menu.contains(evento.target)) {
                opciones.style.display = 'none';
                boton.setAttribute('aria-expanded', 'false');
            }
        });

        document.getElementById('btn-logout')
            .addEventListener('click', cerrarSesion);

    } catch (error) {
        console.error('Error al verificar sesion:', error);
    }
}

async function cerrarSesion() {

    const boton = document.getElementById('btn-logout');

    boton.disabled = true;
    boton.textContent = 'Cerrando sesion...';

    try {

        const respuesta = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo cerrar la sesion');
        }

    } catch (error) {

        console.error('Error al cerrar sesion:', error);

        boton.disabled = false;
        boton.textContent = 'Cerrar sesi\u00f3n';

        mostrarAlerta({
            tipo: 'error',
            titulo: 'Error al cerrar sesi\u00f3n',
            mensaje: error.message,
            boton: 'Aceptar'
        });

        return;
    }

    try {

        mostrarAlerta({
            tipo: 'exito',
            titulo: 'Sesi\u00f3n cerrada correctamente',
            mensaje: 'Gracias por utilizar Entregas360. Esperamos verte pronto.',
            boton: 'Aceptar',
            redireccion: '/entregas360-demo/index.html'
        });

    } catch (error) {

        console.error('Error al mostrar alerta:', error);

        window.location.href = '/entregas360-demo/index.html';

    }
}

document.addEventListener(
    'DOMContentLoaded',
    verificarSesion
);

document.addEventListener(
    'DOMContentLoaded',
    verificarSesion
);